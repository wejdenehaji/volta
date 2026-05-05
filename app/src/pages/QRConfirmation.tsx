import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Car, Zap, Download, ArrowRight } from 'lucide-react';
import { useReservation } from '@/context/ReservationContext';

export default function QRConfirmation() {
  const navigate = useNavigate();
  const { reservation } = useReservation();
  const [timer, setTimer] = useState(15);
  const [expired, setExpired] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setQrVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { setExpired(true); clearInterval(iv); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const totalSeconds = timer;
  const hh = Math.floor(totalSeconds / 3600);
  const mm = Math.floor((totalSeconds % 3600) / 60);
  const ss = totalSeconds % 60;
  const countdownStr = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;

  const stationName = reservation.station?.name || 'Lac 1 · Zone A';
  const vehiclePlate = reservation.vehiclePlate || '183 · TN · 24';
  const timeSlot = reservation.timeSlot || '14:30 – 15:30';
  const sessionCode = 'V3 · LAC1 · 2026 · 7F4A';

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>

      {/* Success badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '6px 16px',
        background: 'var(--green-muted)',
        border: '1px solid #00c85330',
        borderRadius: 100,
        marginBottom: 32,
      }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)' }} />
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--green)', letterSpacing: '0.04em' }}>
          Booking confirmed
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 380px', gap: 48, alignItems: 'start', maxWidth: 820, width: '100%' }}>

        {/* Left: QR */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{ textAlign: 'center', marginBottom: 4 }}>
            <h2 style={{ margin: '0 0 6px', fontSize: 22 }}>Show this at the station</h2>
            <p style={{ margin: 0, fontSize: 13 }}>Scan the QR code on the charger to begin your session</p>
          </div>

          {/* QR card */}
          <div style={{
            background: '#f2f2f2',
            borderRadius: 20,
            padding: 28,
            opacity: qrVisible ? 1 : 0,
            transform: qrVisible ? 'scale(1)' : 'scale(0.92)',
            transition: 'all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>
            <div style={{ position: 'relative', width: 220, height: 220 }}>
              <svg viewBox="0 0 200 200" width="220" height="220">
                {Array.from({ length: 25 }).map((_, row) =>
                  Array.from({ length: 25 }).map((_, col) => {
                    const isCorner = (row < 7 && col < 7) || (row < 7 && col > 17) || (row > 17 && col < 7);
                    const isCenter = row >= 9 && row <= 15 && col >= 9 && col <= 15;
                    const seed = (row * 31 + col * 17) % 7;
                    const show = isCorner || (!isCenter && seed > 2);
                    if (show) {
                      return <rect key={`${row}-${col}`} x={col * 8} y={row * 8} width="7" height="7" rx="1" fill="#0a0a0a" />;
                    }
                    return null;
                  })
                )}
                <rect x="4" y="4" width="49" height="49" fill="none" stroke="#0a0a0a" strokeWidth="4" />
                <rect x="12" y="12" width="33" height="33" fill="#0a0a0a" />
                <rect x="147" y="4" width="49" height="49" fill="none" stroke="#0a0a0a" strokeWidth="4" />
                <rect x="155" y="12" width="33" height="33" fill="#0a0a0a" />
                <rect x="4" y="147" width="49" height="49" fill="none" stroke="#0a0a0a" strokeWidth="4" />
                <rect x="12" y="155" width="33" height="33" fill="#0a0a0a" />
                <circle cx="100" cy="100" r="22" fill="#f2f2f2" />
              </svg>
              {/* Center logo */}
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: '#f2f2f2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Zap size={18} color="#0a0a0a" fill="#0a0a0a" />
                </div>
              </div>
            </div>
          </div>

          {/* Session code */}
          <div style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: 15, fontWeight: 500,
            color: 'var(--text-primary)',
            letterSpacing: '0.12em',
            padding: '8px 20px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border-default)',
            borderRadius: 8,
          }}>
            {sessionCode}
          </div>

          {/* Wallet buttons */}
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            {['Apple Wallet', 'Google Wallet'].map(label => (
              <button
                key={label}
                style={{
                  flex: 1, padding: '10px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 8,
                  fontSize: 12, color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'border-color 140ms',
                }}
              >
                <Download size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Countdown / go plug in */}
          <div className="card-elevated" style={{ padding: '24px', textAlign: 'center' }}>
            {expired ? (
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 12 }}>Your slot is ready</div>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  onClick={() => navigate('/app/handshake')}
                >
                  Go plug in
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
                  Slot begins in
                </div>
                <div style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: 36, fontWeight: 600,
                  color: 'var(--green)',
                  letterSpacing: '0.08em',
                  lineHeight: 1,
                }}>
                  {countdownStr}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 10 }}>
                  Head to the station before your slot starts
                </div>
              </div>
            )}
          </div>

          {/* Booking details */}
          <div className="card-elevated" style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
              Booking details
            </div>
            {[
              { icon: <MapPin size={13} />, label: 'Station', value: stationName },
              { icon: <Clock size={13} />, label: 'Time slot', value: timeSlot },
              { icon: <Car size={13} />, label: 'Vehicle', value: vehiclePlate },
              { icon: <Zap size={13} />, label: 'Connector', value: 'Type 2 · Connector 3' },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid var(--border-subtle)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-tertiary)' }}>
                  {icon}
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.04em' }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Create account nudge */}
          <div style={{
            padding: '16px 18px',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3 }}>Save for next time</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Create a free account to track sessions</div>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--green)', gap: 4, flexShrink: 0 }}
              onClick={() => navigate('/app/convert')}
            >
              Sign up <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}