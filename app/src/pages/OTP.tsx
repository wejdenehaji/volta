import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOTP } from '@/hooks/useOTP';

interface OTPPageProps {
  phone?: string;
  email?: string;
  channel?: 'sms' | 'email';
}

export default function OTPPage({
  phone = '+21698765447',
  email: emailProp,
  channel = 'email', // ← changed default to 'email'
}: OTPPageProps) {
  const navigate = useNavigate();
  const [sessionTimer, setSessionTimer] = useState(600);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [overridePhone, setOverridePhone] = useState('');
  const [showAltPhone, setShowAltPhone] = useState(false);

  // ── NEW: let user type their email if not passed as prop ──────────────
  const [emailInput, setEmailInput] = useState(emailProp ?? '');
  const [emailError, setEmailError] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);
  // ─────────────────────────────────────────────────────────────────────

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const resolvedEmail = channel === 'email' ? emailInput.trim() : undefined;
  const resolvedPhone = channel === 'sms'
    ? (showAltPhone && overridePhone ? overridePhone : phone)
    : undefined;

  const {
    status, errorMsg, attemptsLeft, resendCountdown,
    send, verify, reset,
    isSending, isSent, isVerifying, isSuccess, isLocked, canResend,
  } = useOTP({
    channel,
    phone: resolvedPhone,
    email: resolvedEmail,
    onSuccess: () => setTimeout(() => navigate('/app/summary'), 800),
  });

  // Session countdown
  useEffect(() => {
    const t = setInterval(() => setSessionTimer(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  // Focus first OTP input when sent
  useEffect(() => {
    if (isSent) setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, [isSent]);

  // Clear code on error
  useEffect(() => {
    if (errorMsg && isSent && !isVerifying) {
      setCode(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  }, [errorMsg]);

  // ── NEW: validate email before sending ───────────────────────────────
  const handleSend = () => {
    if (channel === 'email') {
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.trim());
      if (!valid) {
        setEmailError('Please enter a valid email address.');
        emailInputRef.current?.focus();
        return;
      }
      setEmailError('');
    }
    send(channel === 'sms' && showAltPhone ? overridePhone : undefined);
  };
  // ─────────────────────────────────────────────────────────────────────

  const handleDigitChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...code];
    next[index] = val.slice(-1);
    setCode(next);
    if (val && index < 5) inputRefs.current[index + 1]?.focus();
    if (index === 5 && val) {
      const full = [...next.slice(0, 5), val.slice(-1)].join('');
      if (full.length === 6) setTimeout(() => verify(full), 200);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const mins = Math.floor(sessionTimer / 60);
  const secs = sessionTimer % 60;
  const isError = !!errorMsg && !isVerifying;

  // Masked display for confirmed email
  const maskedEmail = emailInput.includes('@')
    ? `${emailInput.split('@')[0].slice(0, 2)}***@${emailInput.split('@')[1]}`
    : emailInput;
  const maskedPhone = `${phone?.slice(0, 4)} •• •• •• ${phone?.slice(-2)}`;

  return (
    <div className="w-full max-w-[390px] mx-auto bg-bg-base min-h-[100dvh] flex flex-col">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button
          onClick={() => navigate('/app/vehicle')}
          disabled={isVerifying || isSuccess}
          className="p-2 -ml-2 disabled:opacity-40"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="#EAEAEA" strokeWidth="1.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-[17px] font-medium text-text-primary">
          {channel === 'email' ? 'Verify your email' : 'Verify your number'}
        </h1>
        <div className={`font-mono text-[13px] font-medium ${sessionTimer < 60 ? 'text-error' : 'text-warning'}`}>
          {mins}:{secs.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="flex-1 px-4 pb-4">

        {/* ── PRE-SEND ─────────────────────────────────────────────────────── */}
        {!isSent && (
          <div className="animate-slide-up">
            <p className="text-[14px] text-text-secondary text-center mb-8">
              We'll send a one-time code to confirm your identity.
            </p>

            {/* ── EMAIL INPUT (new) ───────────────────────────────────────── */}
            {channel === 'email' && (
              <div className="mb-4">
                <div className="p-4 bg-surface border border-border-subtle rounded-xl">
                  <div className="text-[11px] text-text-tertiary uppercase tracking-wide mb-1">
                    Your email address
                  </div>
                  <input
                    ref={emailInputRef}
                    type="email"
                    value={emailInput}
                    onChange={e => { setEmailInput(e.target.value); setEmailError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="you@example.com"
                    disabled={isSending}
                    className="w-full bg-transparent text-[15px] text-text-primary
                               placeholder:text-text-tertiary outline-none disabled:opacity-50"
                  />
                </div>
                {emailError && (
                  <p className="text-[12px] text-error mt-1 pl-1">{emailError}</p>
                )}
              </div>
            )}
            {/* ─────────────────────────────────────────────────────────────── */}

            {/* SMS: show masked phone on file */}
            {channel === 'sms' && (
              <div className="p-4 bg-surface border border-border-subtle rounded-xl mb-4">
                <div className="text-[11px] text-text-tertiary uppercase tracking-wide mb-1">
                  Owner number on file
                </div>
                <div className="font-mono text-[15px] text-text-primary tracking-wide">
                  {maskedPhone}
                </div>
              </div>
            )}

            {channel === 'sms' && (
              <>
                <button
                  onClick={() => setShowAltPhone(!showAltPhone)}
                  className="text-[13px] text-brand hover:text-brand-hover transition-colors mb-4 block"
                >
                  Use a different number for this session →
                </button>
                {showAltPhone && (
                  <div className="px-3 py-3 bg-surface border border-border-subtle rounded-xl mb-4 animate-slide-up">
                    <input
                      type="tel"
                      value={overridePhone}
                      onChange={e => setOverridePhone(e.target.value)}
                      placeholder="+216 ..."
                      className="w-full bg-transparent text-[14px] text-text-primary placeholder:text-text-tertiary outline-none"
                    />
                  </div>
                )}
              </>
            )}

            {errorMsg && (
              <div className="px-3 py-2 bg-error-tint border border-error rounded-lg mb-4">
                <p className="text-[13px] text-error">{errorMsg}</p>
              </div>
            )}

            {/* ── Send button now calls handleSend ───────────────────────── */}
            <button
              onClick={handleSend}
              disabled={isSending}
              className="w-full py-3 bg-brand text-brand-on rounded-lg text-[13px] font-medium
                         hover:bg-brand-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {isSending
                ? <><Spinner /> Sending...</>
                : 'Send code'
              }
            </button>
          </div>
        )}

        {/* ── POST-SEND ──────────────────────────────────────────────────────── */}
        {isSent && (
          <div className="animate-slide-up">
            <p className="text-[14px] text-text-secondary text-center mb-1">
              Enter the 6-digit code sent to
            </p>
            {/* ── Show where the code was sent ──────────────────────────── */}
            <p className="text-[13px] text-brand text-center font-mono mb-6">
              {channel === 'email' ? maskedEmail : maskedPhone}
            </p>

            {/* Code boxes */}
            <div className={`flex gap-2 justify-center mb-4 ${isError ? 'animate-shake' : ''}`}>
              {code.map((digit, i) => (
                <div key={i} className={`w-12 h-14 flex items-center justify-center rounded-lg border-2 transition-all ${
                  isSuccess ? 'bg-brand-tint border-brand'
                  : isError  ? 'bg-error-tint border-error'
                  : digit    ? 'bg-surface border-brand'
                  :            'bg-surface border-border-subtle'
                }`}>
                  <input
                    ref={el => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleDigitChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    disabled={isVerifying || isSuccess || isLocked}
                    className="w-full h-full bg-transparent text-center font-mono text-[22px]
                               font-medium text-text-primary outline-none disabled:opacity-50"
                  />
                </div>
              ))}
            </div>

            {/* Spinner / Success icon */}
            <div className="flex justify-center mb-4 h-10">
              {isVerifying && <Spinner color="#00c853" size={24} />}
              {isSuccess && (
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="#001A0D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
              )}
            </div>

            {/* Error message */}
            {isError && !isLocked && (
              <div className="px-3 py-2 bg-error-tint border border-error rounded-lg mb-4">
                <p className="text-[13px] text-error text-center">{errorMsg}</p>
              </div>
            )}

            {/* Locked state */}
            {isLocked && (
              <div className="px-3 py-3 bg-error-tint border border-error rounded-lg mb-4 text-center">
                <p className="text-[13px] text-error font-medium mb-1">Code locked</p>
                <p className="text-[12px] text-error opacity-80">Too many attempts. Please request a new code.</p>
                <button
                  onClick={reset}
                  className="mt-2 text-[12px] text-brand underline"
                >
                  Request new code
                </button>
              </div>
            )}

            {/* Resend */}
            {!isSuccess && !isLocked && (
              <div className="text-center mb-3">
                {canResend ? (
                  <button
                    onClick={() => send()}
                    className="text-[13px] text-brand hover:text-brand-hover transition-colors"
                  >
                    Resend code
                  </button>
                ) : (
                  <span className="text-[13px] text-text-tertiary">
                    Resend in 0:{resendCountdown.toString().padStart(2, '0')}
                  </span>
                )}
              </div>
            )}

            {/* Attempts badge */}
            {!isSuccess && !isLocked && attemptsLeft < 3 && (
              <p className={`text-center text-[11px] ${attemptsLeft === 1 ? 'text-error' : 'text-text-tertiary'}`}>
                {attemptsLeft} attempt{attemptsLeft === 1 ? '' : 's'} remaining
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Small reusable spinner ────────────────────────────────────────────────────
function Spinner({ color = 'currentColor', size = 16 }: { color?: string; size?: number }) {
  return (
    <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}