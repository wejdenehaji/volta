import { useState, useEffect, useCallback, useRef } from 'react';
import { sendOTP, verifyOTP } from '@/lib/api';
import type { OTPChannel } from '@/types/autho';

export type OTPStatus = 'idle' | 'sending' | 'sent' | 'verifying' | 'success' | 'locked';

interface UseOTPOptions {
  channel: OTPChannel;
  phone?: string;
  email?: string;
  onSuccess?: () => void;
}

export function useOTP({ channel, phone, email, onSuccess }: UseOTPOptions) {
  const [status, setStatus] = useState<OTPStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [expiresIn, setExpiresIn] = useState(600);
  const countdownRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Resend countdown ticker
  useEffect(() => {
    if (resendCountdown <= 0) return;
    countdownRef.current = setInterval(() => {
      setResendCountdown(c => {
        if (c <= 1) clearInterval(countdownRef.current);
        return Math.max(0, c - 1);
      });
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, [resendCountdown]);

  const send = useCallback(async (overridePhone?: string) => {
    setStatus('sending');
    setErrorMsg('');

    const result = await sendOTP({
      channel,
      phone: channel === 'sms' ? (overridePhone ?? phone) : undefined,
      email: channel === 'email' ? email : undefined,
    });

    if (!result.success) {
      setErrorMsg(result.message);
      setStatus('idle');
      return false;
    }

    setExpiresIn(result.expiresIn ?? 600);
    setAttemptsLeft(3);
    setResendCountdown(60);
    setStatus('sent');
    return true;
  }, [channel, phone, email]);

  const verify = useCallback(async (code: string) => {
    if (status === 'verifying' || status === 'success') return;
    setStatus('verifying');
    setErrorMsg('');

    const result = await verifyOTP({
      code,
      phone: channel === 'sms' ? phone : undefined,
      email: channel === 'email' ? email : undefined,
    });

    if (result.success) {
      setStatus('success');
      onSuccess?.();
      return;
    }

    setAttemptsLeft(result.attemptsLeft ?? 0);
    setErrorMsg(result.message);
    setStatus(result.attemptsLeft === 0 ? 'locked' : 'sent');
  }, [status, channel, phone, email, onSuccess]);

  const reset = useCallback(() => {
    setStatus('idle');
    setErrorMsg('');
    setAttemptsLeft(3);
    setResendCountdown(0);
  }, []);

  return {
    status,
    errorMsg,
    attemptsLeft,
    resendCountdown,
    expiresIn,
    send,
    verify,
    reset,
    isSending: status === 'sending',
    isSent: ['sent', 'verifying', 'success', 'locked'].includes(status),
    isVerifying: status === 'verifying',
    isSuccess: status === 'success',
    isLocked: status === 'locked',
    canResend: resendCountdown === 0 && status === 'sent',
  };
}