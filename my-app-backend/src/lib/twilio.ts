import twilio from 'twilio';

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  throw new Error('Missing Twilio environment variables');
}

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendSMSOTP(to: string, otp: string): Promise<void> {
  try {
    await client.messages.create({
      body: `Your verification code is ${otp}. Expires in 10 minutes. Do not share it.`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to,
    });
  } catch (err: any) {
    console.error('[Twilio] Failed:', { code: err.code, to: to.slice(0, -4) + '****' });
    throw new Error('SMS delivery failed. Please try again.');
  }
}