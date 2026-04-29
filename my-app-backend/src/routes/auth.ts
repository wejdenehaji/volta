import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { generateOTP, hashOTP, verifyOTPHash, getExpiryTime } from '../lib/otp';
import { sendSMSOTP } from '../lib/twilio';
import { sendEmailOTP } from '../lib/email';
import { sendRateLimit, verifyRateLimit } from '../lib/redis';
import { globalLimiter } from '../middleware/rateLimit';

const router = Router();
router.use(globalLimiter);

// ── Validation schemas ──────────────────────────────────────────────────────
const sendSchema = z.object({
  channel: z.enum(['sms', 'email']),
  phone: z.string().regex(/^\+\d{8,15}$/, 'Invalid phone number format').optional(),
  email: z.string().email('Invalid email address').optional(),
}).refine(
  d => (d.channel === 'sms' ? !!d.phone : !!d.email),
  { message: 'Phone required for SMS channel, email required for email channel' }
);

const verifySchema = z.object({
  code: z.string().length(6).regex(/^\d{6}$/, 'Code must be exactly 6 digits'),
  phone: z.string().optional(),
  email: z.string().email().optional(),
}).refine(d => d.phone || d.email, { message: 'Phone or email required' });

// ────────────────────────────────────────────────────────────────────────────
// POST /api/auth/send-otp
// ────────────────────────────────────────────────────────────────────────────
router.post('/send-otp', async (req: Request, res: Response) => {
  // 1. Validate input
  const parsed = sendSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message ?? 'Invalid input',
    });
  }

  const { channel, phone, email } = parsed.data;
  const identifier = channel === 'sms' ? phone! : email!;

  // 2. Rate limit per identifier
  const { success: allowed, reset } = await sendRateLimit.limit(identifier);
  if (!allowed) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    return res.status(429).json({
      success: false,
      message: `Too many requests. Try again in ${Math.ceil(retryAfter / 60)} minute(s).`,
    });
  }

  // 3. Invalidate all previous unused OTPs for this identifier
  await supabase
    .from('otp_codes')
    .update({ used: true, used_at: new Date().toISOString() })
    .eq(channel === 'sms' ? 'phone' : 'email', identifier)
    .eq('used', false);

  // 4. Generate + hash OTP
  const otp = generateOTP();
  const codeHash = await hashOTP(otp);
  const expiresAt = getExpiryTime(10);

  // 5. Store hashed OTP
  const ip = (req.headers['x-forwarded-for'] as string) ?? req.socket.remoteAddress ?? 'unknown';
  const { error: dbError } = await supabase.from('otp_codes').insert({
    phone: channel === 'sms' ? phone : null,
    email: channel === 'email' ? email : null,
    code_hash: codeHash,
    expires_at: expiresAt.toISOString(),
    ip_address: ip,
    user_agent: req.headers['user-agent'] ?? 'unknown',
  });

  if (dbError) {
    console.error('[send-otp] DB error:', dbError);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }

  // 6. Deliver OTP
  try {
    if (channel === 'sms') {
      await sendSMSOTP(phone!, otp);
    } else {
      await sendEmailOTP(email!, otp);
    }
  } catch (deliveryErr: any) {
    // Delivery failed — clean up so user can retry cleanly
    await supabase.from('otp_codes').delete().eq('code_hash', codeHash);
    return res.status(502).json({ success: false, message: deliveryErr.message });
  }

  // 7. Respond — never include the OTP in the response
  const maskedIdentifier = channel === 'sms'
    ? `${phone!.slice(0, 4)}****${phone!.slice(-2)}`
    : `${email!.split('@')[0].slice(0, 2)}***@${email!.split('@')[1]}`;

  return res.status(200).json({
    success: true,
    message: `Code sent to ${maskedIdentifier}`,
    expiresIn: 600, // 10 minutes in seconds
  });
});

// ────────────────────────────────────────────────────────────────────────────
// POST /api/auth/verify-otp
// ────────────────────────────────────────────────────────────────────────────
router.post('/verify-otp', async (req: Request, res: Response) => {
  // 1. Validate input
  const parsed = verifySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message ?? 'Invalid input',
    });
  }

  const { code, phone, email } = parsed.data;
  const ip = (req.headers['x-forwarded-for'] as string) ?? req.socket.remoteAddress ?? 'unknown';

  // 2. IP-level rate limit (brute force protection)
  const { success: allowed } = await verifyRateLimit.limit(ip);
  if (!allowed) {
    return res.status(429).json({
      success: false,
      message: 'Too many verification attempts. Please wait a moment.',
    });
  }

  // 3. Fetch latest valid OTP record
  const column = phone ? 'phone' : 'email';
  const value = phone ?? email!;

  const { data: record, error: fetchErr } = await supabase
    .from('otp_codes')
    .select('*')
    .eq(column, value)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .lt('attempts', 3)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (fetchErr || !record) {
    return res.status(400).json({
      success: false,
      message: 'No valid code found. Please request a new one.',
      attemptsLeft: 0,
    });
  }

  // 4. Increment attempts BEFORE checking — prevents timing attacks
  const newAttempts = record.attempts + 1;
  await supabase
    .from('otp_codes')
    .update({ attempts: newAttempts })
    .eq('id', record.id);

  // 5. Verify hash
  const isValid = await verifyOTPHash(code, record.code_hash);

  if (!isValid) {
    const attemptsLeft = record.max_attempts - newAttempts;

    if (attemptsLeft <= 0) {
      // Lock out — mark as used
      await supabase
        .from('otp_codes')
        .update({ used: true, used_at: new Date().toISOString() })
        .eq('id', record.id);
    }

    return res.status(400).json({
      success: false,
      message: attemptsLeft > 0
        ? `Incorrect code. ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining.`
        : 'Too many incorrect attempts. Please request a new code.',
      attemptsLeft: Math.max(0, attemptsLeft),
    });
  }

  // 6. Mark OTP as used
  await supabase
    .from('otp_codes')
    .update({ used: true, used_at: new Date().toISOString() })
    .eq('id', record.id);

  // 7. Upsert user
  const userPayload = phone ? { phone } : { email };
  const { data: user, error: userErr } = await supabase
    .from('users')
    .upsert(
      { ...userPayload, is_verified: true, updated_at: new Date().toISOString() },
      { onConflict: phone ? 'phone' : 'email' }
    )
    .select('id')
    .single();

  if (userErr || !user) {
    console.error('[verify-otp] User upsert failed:', userErr);
    return res.status(500).json({ success: false, message: 'Account setup failed. Contact support.' });
  }

  // 8. Return success with session cookie
  const sessionPayload = Buffer.from(JSON.stringify({
    userId: user.id,
    ...(phone ? { phone } : { email }),
    verifiedAt: new Date().toISOString(),
  })).toString('base64');

  // HttpOnly cookie — not accessible by frontend JS
  res.cookie('session', sessionPayload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(200).json({
    success: true,
    message: 'Verification successful.',
  });
});

export default router;