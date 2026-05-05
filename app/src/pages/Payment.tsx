import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CreditCard, Zap, Shield, ChevronRight, Loader2, Check } from 'lucide-react';
import { useReservation } from '@/context/ReservationContext';
import BookingStepper from '@/components/BookingStepper';

export default function Payment() {
  const navigate = useNavigate();
  const { reservation } = useReservation();
  const [timer, setTimer] = useState(131);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'apple' | 'google'>('card');

  const estimatedCost = reservation.estimatedCost || '3.24';
  const preAuth = (parseFloat(estimatedCost) * 1.9).toFixed(2);

  useEffect(() => {
    const iv = setInterval(() => setTimer(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(iv);
  }, []);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const timerCritical = timer < 60;

  const handlePay = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2200));
    setDone(true);
    await new Promise(r => setTimeout(r, 800));
    navigate('/app/qr');
  };

  return (
    <div className="page-container" style={{ maxWidth: 760 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/summary')} style={{ gap: 6 }}>
          <ArrowLeft size={15} />
          Back
        </button>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 14px',
          background: timerCritical ? 'var(--error-tint)' : 'var(--surface-2)',
          border: `1px solid ${timerCritical ? 'var(--error)' : 'var(--border-default)'}`,
          borderRadius: 100,
        }}>
          <Clock size={13} color={timerCritical ? 'var(--error)' : 'var(--text-tertiary)'} />
          <span style={{
            fontFamily: 'DM Mono, monospace', fontSize: 13, fontWeight: 500,
            color: timerCritical ? 'var(--error)' : 'var(--text-secondary)',
          }}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      <BookingStepper currentPath="/app/payment" />

      <div className="page-header">
        <h1>Complete payment</h1>
        <p>Pre-authorization only — billed after your session ends</p>
      </div>

      {processing ? (
        /* ── Processing state ── */
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '80px 0', gap: 24,
        }}>
          {done ? (
            <>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'var(--green-muted)',
                border: '2px solid var(--green)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Check size={28} color="var(--green)" strokeWidth={2.5} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Payment confirmed</div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Generating your QR code...</div>
              </div>
            </>
          ) : (
            <>
              <div style={{ position: 'relative', width: 64, height: 64 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  border: '2px solid var(--border-subtle)',
                  position: 'absolute',
                }} />
                <Loader2 size={64} color="var(--green)" style={{
                  position: 'absolute',
                  animation: 'spin 1s linear infinite',
                }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Processing payment</div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Please don't close this page...</div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
          {/* Left: payment methods */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Quick pay */}
            <div>
              <label className="field-label" style={{ marginBottom: 10 }}>Express checkout</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {/* Apple Pay */}
                <button
                  onClick={() => setSelectedMethod('apple')}
                  style={{
                    padding: '14px',
                    background: selectedMethod === 'apple' ? '#fff' : 'var(--surface-2)',
                    border: `1px solid ${selectedMethod === 'apple' ? '#fff' : 'var(--border-default)'}`,
                    borderRadius: 10,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'all 140ms',
                    color: selectedMethod === 'apple' ? '#000' : 'var(--text-secondary)',
                    fontSize: 13, fontWeight: 500,
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.72 9.73c-.04-1.54.63-2.71 2.01-3.57-.77-1.1-1.93-1.7-3.45-1.8-1.44-.1-3.05.85-3.64.85-.63 0-2.05-.81-3.18-.81C6.43 4.43 3.5 6.9 3.5 10.38c0 1.06.19 2.15.57 3.27.51 1.51 2.35 5.21 4.28 5.15 1.02-.02 1.75-.74 3.08-.74 1.29 0 1.97.74 3.18.72 1.31-.03 2.2-1.2 3.02-2.41.95-1.39 1.34-2.74 1.37-2.81-.03-.01-2.64-1.02-2.68-3.83zM14.94 3.5c.72-.88 1.21-2.1 1.07-3.32-1.04.04-2.29.69-3.03 1.57-.67.78-1.25 2.03-1.09 3.24 1.15.09 2.33-.66 3.05-1.49z"/>
                  </svg>
                  Apple Pay
                </button>

                {/* Google Pay */}
                <button
                  onClick={() => setSelectedMethod('google')}
                  style={{
                    padding: '14px',
                    background: selectedMethod === 'google' ? 'var(--surface-3)' : 'var(--surface-2)',
                    border: `1px solid ${selectedMethod === 'google' ? 'var(--green)' : 'var(--border-default)'}`,
                    borderRadius: 10,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'all 140ms',
                    color: 'var(--text-secondary)',
                    fontSize: 13, fontWeight: 500,
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google Pay
                </button>
              </div>
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>or pay with card</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            </div>

            {/* Saved card */}
            <div>
              <label className="field-label" style={{ marginBottom: 10 }}>Saved card</label>
              <button
                onClick={() => setSelectedMethod('card')}
                style={{
                  width: '100%',
                  padding: '16px 18px',
                  background: selectedMethod === 'card' ? 'var(--green-muted)' : 'var(--surface-2)',
                  border: `1px solid ${selectedMethod === 'card' ? 'var(--green)' : 'var(--border-default)'}`,
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 14,
                  transition: 'all 140ms',
                  textAlign: 'left',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                <div style={{
                  width: 44, height: 30, borderRadius: 6,
                  background: 'linear-gradient(135deg, #1a237e, #0d47a1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <CreditCard size={14} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Visa •••• 4821</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>Expires 09/27</div>
                </div>
                {selectedMethod === 'card' && (
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'var(--green)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Check size={11} color="#001a0d" strokeWidth={3} />
                  </div>
                )}
              </button>

              <button
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--green)', marginTop: 10, fontSize: 13 }}
              >
                + Add new card
              </button>
            </div>

            {/* Security note */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 14px',
              background: 'var(--surface-1)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 8,
            }}>
              <Shield size={14} color="var(--text-tertiary)" />
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                Payments are encrypted end-to-end. Your card details are never stored on our servers.
              </span>
            </div>
          </div>

          {/* Right: order summary */}
          <div style={{ position: 'sticky', top: 0 }}>
            <div className="card-elevated" style={{ padding: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
                Order summary
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Station', value: reservation.station?.name || '—' },
                  { label: 'Date & time', value: reservation.timeSlot ? `${reservation.date} · ${reservation.timeSlot}` : '—' },
                  { label: 'Duration', value: reservation.duration || '—' },
                  { label: 'Est. energy', value: reservation.estimatedKwh ? `~${reservation.estimatedKwh} kWh` : '—' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right', maxWidth: '55%' }}>{value}</span>
                  </div>
                ))}
              </div>

              <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0 0 16px' }} />

              <div style={{
                padding: '16px',
                background: 'var(--green-tint)',
                border: '1px solid #00c85325',
                borderRadius: 10,
                marginBottom: 20,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Pre-auth amount</span>
                  <span style={{ fontSize: 22, fontWeight: 600, color: 'var(--green)', fontFamily: 'DM Mono, monospace' }}>
                    {preAuth} DT
                  </span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                  Released after session. You pay only for actual kWh used (~{estimatedCost} DT estimated).
                </div>
              </div>

              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginBottom: 10 }}
                onClick={handlePay}
              >
                <Zap size={15} />
                Confirm & pay {preAuth} DT
                <ChevronRight size={15} />
              </button>

              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'center', lineHeight: 1.5 }}>
                By confirming you agree to our billing terms.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}