import { useEffect, useRef, useState } from 'react';
import { verifyOTP } from '../lib/api';
import { sendOTP } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Mail, Phone, CheckCircle, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { useReservation } from '../context/ReservationContext';
import BookingStepper from '../components/BookingStepper';

type Status = 'idle' | 'sending' | 'sent' | 'verifying' | 'success' | 'error';
type Channel = 'email' | 'sms';

export default function OTPPage() {
  const navigate = useNavigate();
  const { reservation, update } = useReservation();

  const [channel, setChannel] = useState<Channel>('email');
  const [email, setEmail] = useState(reservation.userEmail || '');
  const [phone, setPhone] = useState(reservation.userPhone || '');
  const [fieldError, setFieldError] = useState('');
  const [fieldTouched, setFieldTouched] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [codeError, setCodeError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [sessionTimer, setSessionTimer] = useState(300);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const fieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!reservation.station) navigate('/app/map');
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setSessionTimer(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const iv = setInterval(() => setResendTimer(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(iv);
  }, [resendTimer]);

  useEffect(() => {
    if (status === 'sent') {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [status]);

  // Reset field state when switching channels
  useEffect(() => {
    setFieldError('');
    setFieldTouched(false);
  }, [channel]);

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const isValidPhone = (v: string) => /^\+\d{8,15}$/.test(v.trim());

  const currentValue = channel === 'email' ? email : phone;
  const isValid = channel === 'email' ? isValidEmail(email) : isValidPhone(phone);
  const fieldIsInvalid = fieldTouched && currentValue.length > 0 && !isValid;
  const fieldIsValid = currentValue.length > 0 && isValid;

  const handleFieldBlur = () => {
    setFieldTouched(true);
    if (currentValue && !isValid) {
      setFieldError(
        channel === 'email'
          ? 'Please enter a valid email address'
          : 'Please enter a valid phone number (e.g. +21612345678)'
      );
    } else {
      setFieldError('');
    }
  };

  const handleSend = async () => {
    setFieldTouched(true);
    if (!isValid) {
      setFieldError(
        channel === 'email'
          ? 'Please enter a valid email address'
          : 'Please enter a valid phone number (e.g. +21612345678)'
      );
      fieldRef.current?.focus();
      return;
    }
    setFieldError('');
    setStatus('sending');

    try {
      const payload =
        channel === 'email'
          ? { channel: 'email' as const, email }
          : { channel: 'sms' as const, phone };

      const result = await sendOTP(payload);

      if (result.success) {
        if (channel === 'email') update({ userEmail: email });
        else update({ userPhone: phone });
        setStatus('sent');
        setResendTimer(60);
      } else {
        setFieldError(result.message || 'Failed to send code');
        setStatus('idle');
      }
    } catch (err) {
      setFieldError('Network error. Is the backend running?');
      setStatus('idle');
    }
  };

  const handleDigit = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...code];
    next[i] = val.slice(-1);
    setCode(next);
    setCodeError('');
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
    if (i === 5 && val) {
      const full = [...next.slice(0, 5), val.slice(-1)].join('');
      if (full.length === 6) handleVerify(full);
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handleVerify = async (fullCode: string) => {
    setStatus('verifying');

    try {
      const payload =
        channel === 'email'
          ? { code: fullCode, email }
          : { code: fullCode, phone };

      const result = await verifyOTP(payload);

      if (result.success) {
        setStatus('success');
        setTimeout(() => navigate('/app/summary'), 900);
      } else {
        setStatus('error');
        setCodeError(result.message || 'Invalid code');
        setCode(['', '', '', '', '', '']);
        setTimeout(() => {
          setStatus('sent');
          inputRefs.current[0]?.focus();
        }, 800);
      }
    } catch (err) {
      setStatus('error');
      setCodeError('Connection lost. Try again.');
    }
  };

  const handleResend = async () => {
    setCode(['', '', '', '', '', '']);
    setCodeError('');
    setStatus('sending');
    await new Promise(r => setTimeout(r, 800));
    setStatus('sent');
    setResendTimer(60);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const maskedIdentifier =
    channel === 'email' && email.includes('@')
      ? `${email.split('@')[0].slice(0, 2)}***@${email.split('@')[1]}`
      : channel === 'sms' && phone.length > 4
      ? `${phone.slice(0, 4)}****${phone.slice(-2)}`
      : currentValue;

  const sessionMin = Math.floor(sessionTimer / 60);
  const sessionSec = sessionTimer % 60;
  const sessionCritical = sessionTimer < 60;

  return (
    <div className="page-container" style={{ maxWidth: 640 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/vehicle')} style={{ gap: 6 }}>
          <ArrowLeft size={15} />
          Back
        </button>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 14px',
          background: sessionCritical ? 'var(--error-tint)' : 'var(--surface-2)',
          border: `1px solid ${sessionCritical ? 'var(--error)' : 'var(--border-default)'}`,
          borderRadius: 100,
        }}>
          <Clock size={13} color={sessionCritical ? 'var(--error)' : 'var(--text-tertiary)'} />
          <span style={{
            fontFamily: 'DM Mono, monospace', fontSize: 13, fontWeight: 500,
            color: sessionCritical ? 'var(--error)' : 'var(--text-secondary)',
          }}>
            {sessionMin}:{sessionSec.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      <BookingStepper currentPath="/app/otp" />

      <div className="card-elevated" style={{ padding: '40px 48px', maxWidth: 480, margin: '0 auto' }}>
        {/* Icon */}
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: 'var(--green-muted)',
          border: '1px solid #00c85330',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
        }}>
          {channel === 'email'
            ? <Mail size={22} color="var(--green)" />
            : <Phone size={22} color="var(--green)" />}
        </div>

        <h2 style={{ margin: '0 0 8px', fontSize: 22 }}>Verify your identity</h2>
        <p style={{ margin: '0 0 24px', fontSize: 14 }}>
          {status === 'idle' || status === 'sending'
            ? "We'll send a one-time code to confirm your booking."
            : `Code sent to ${maskedIdentifier}`}
        </p>

        {/* Channel toggle — only shown before sending */}
        {(status === 'idle' || status === 'sending') && (
          <div style={{
            display: 'flex', gap: 8, marginBottom: 24,
            background: 'var(--surface-2)',
            border: '1px solid var(--border-default)',
            borderRadius: 10, padding: 4,
          }}>
            {(['email', 'sms'] as Channel[]).map(ch => (
              <button
                key={ch}
                onClick={() => setChannel(ch)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 6, padding: '8px 0', borderRadius: 7, border: 'none',
                  cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 150ms',
                  background: channel === ch ? 'var(--surface-1)' : 'transparent',
                  color: channel === ch ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  boxShadow: channel === ch ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {ch === 'email' ? <Mail size={13} /> : <Phone size={13} />}
                {ch === 'email' ? 'Email' : 'SMS'}
              </button>
            ))}
          </div>
        )}

        {/* Input phase */}
        {(status === 'idle' || status === 'sending') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fade-in">
            <div>
              <label className="field-label">
                {channel === 'email' ? 'Email address' : 'Phone number'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  ref={fieldRef}
                  type={channel === 'email' ? 'email' : 'tel'}
                  className={`field-input ${fieldIsInvalid ? 'is-invalid' : fieldIsValid ? 'is-valid' : ''}`}
                  value={channel === 'email' ? email : phone}
                  onChange={e => {
                    setFieldError('');
                    if (channel === 'email') setEmail(e.target.value);
                    else setPhone(e.target.value);
                  }}
                  onBlur={handleFieldBlur}
                  placeholder={channel === 'email' ? 'you@example.com' : '+21612345678'}
                  disabled={status === 'sending'}
                  style={{ fontSize: 15 }}
                />
                {fieldIsValid && (
                  <CheckCircle
                    size={16}
                    color="var(--green)"
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                )}
              </div>
              {(fieldError || fieldIsInvalid) && (
                <div className="field-error">
                  <AlertCircle size={12} />
                  {fieldError || (channel === 'email' ? 'Please enter a valid email address' : 'Please enter a valid phone number')}
                </div>
              )}
              <div className="field-hint">
                {channel === 'email'
                  ? "We'll send a 6-digit code. No account required."
                  : 'Include your country code (e.g. +216…). No account required.'}
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              onClick={handleSend}
              disabled={status === 'sending'}
            >
              {status === 'sending' ? (
                <>
                  <Loader2 size={16} className="animate-spin-slow" />
                  Sending code...
                </>
              ) : (
                'Send verification code'
              )}
            </button>
          </div>
        )}

        {/* OTP entry phase */}
        {(status === 'sent' || status === 'verifying' || status === 'error' || status === 'success') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
            <div>
              <label className="field-label" style={{ marginBottom: 12 }}>6-digit code</label>
              <div style={{ display: 'flex', gap: 8, overflow: 'hidden' }}>
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleDigit(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    disabled={status === 'verifying' || status === 'success'}
                    style={{
                      width: 0, flex: 1, height: 52, textAlign: 'center',
                      fontFamily: 'DM Mono, monospace', fontSize: 22, fontWeight: 500,
                      background: status === 'success'
                        ? 'var(--green-muted)'
                        : status === 'error'
                        ? 'var(--error-tint)'
                        : 'var(--surface-2)',
                      border: `1px solid ${
                        status === 'success' ? 'var(--green)' :
                        status === 'error' ? 'var(--error)' :
                        digit ? 'var(--green)' : 'var(--border-default)'}`,
                      borderRadius: 10,
                      color: 'var(--text-primary)',
                      outline: 'none',
                      transition: 'all 150ms',
                      caretColor: 'var(--green)',
                    }}
                  />
                ))}
              </div>

              {status === 'verifying' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 16, color: 'var(--text-secondary)', fontSize: 13 }}>
                  <Loader2 size={15} className="animate-spin-slow" color="var(--green)" />
                  Verifying...
                </div>
              )}

              {status === 'success' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 16, color: 'var(--green)', fontSize: 13, fontWeight: 500 }}>
                  <CheckCircle size={16} color="var(--green)" />
                  Identity verified! Redirecting...
                </div>
              )}

              {codeError && status !== 'verifying' && (
                <div className="field-error" style={{ justifyContent: 'center', marginTop: 12 }}>
                  <AlertCircle size={12} />
                  {codeError}
                </div>
              )}
            </div>

            {/* Resend */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--text-tertiary)' }}>Didn't receive it?</span>
              {resendTimer > 0 ? (
                <span style={{ color: 'var(--text-tertiary)', fontFamily: 'DM Mono, monospace' }}>
                  Resend in {resendTimer}s
                </span>
              ) : (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={handleResend}
                  style={{ color: 'var(--green)', gap: 5 }}
                >
                  <RefreshCw size={12} />
                  Resend code
                </button>
              )}
            </div>

            {/* Change contact */}
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { setStatus('idle'); setCode(['', '', '', '', '', '']); setCodeError(''); setFieldTouched(false); setFieldError(''); }}
              style={{ color: 'var(--text-tertiary)', alignSelf: 'center', fontSize: 12 }}
            >
              Use a different {channel === 'email' ? 'email' : 'number'}
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: 20, textAlign: 'center', fontSize: 12, color: 'var(--text-tertiary)' }}>
        Demo tip: use code <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--green)' }}>123456</span>
      </div>
    </div>
  );
}