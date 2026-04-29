export interface SendOTPBody {
  channel: 'sms' | 'email';
  phone?: string;
  email?: string;
}

export interface VerifyOTPBody {
  code: string;
  phone?: string;
  email?: string;
}