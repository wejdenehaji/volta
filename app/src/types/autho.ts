export type OTPChannel = 'sms' | 'email';

export interface SendOTPPayload {
  channel: OTPChannel;
  phone?: string;
  email?: string;
}

export interface SendOTPResult {
  success: boolean;
  message: string;
  expiresIn?: number;
}

export interface VerifyOTPPayload {
  code: string;
  phone?: string;
  email?: string;
}

export interface VerifyOTPResult {
  success: boolean;
  message: string;
  attemptsLeft?: number;
}