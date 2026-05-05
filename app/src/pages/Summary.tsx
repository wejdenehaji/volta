import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Edit2, CreditCard, ChevronRight, AlertTriangle, Zap, MapPin, Calendar, User } from 'lucide-react';
import { useReservation } from '../context/ReservationContext';
import BookingStepper from '../components/BookingStepper';

function DetailRow({ icon, label, value, onEdit }: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  onEdit?: () => void;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '13px 0',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {icon && <span style={{ color: 'var(--text-tertiary)', display: 'flex' }}>{icon}</span>}
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right' }}>{value}</span>
        {onEdit && (
          <button
            onClick={onEdit}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--green)', fontSize: 12, padding: '2px 8px',
              borderRadius: 6,
              display: 'flex', alignItems: 'center', gap: 4,
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500,
            }}
          >
            <Edit2 size={11} />
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default function Summary() {
  const navigate = useNavigate();
  const { reservation } = useReservation();
  const [timer, setTimer] = useState(154);

  useEffect(() => {
    if (!reservation.station) navigate('/app/map');
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(iv);
  }, []);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const timerCritical = timer < 60;
  const preAuth = reservation.estimatedCost
    ? (parseFloat(reservation.estimatedCost) * 1.9).toFixed(2)
    : '6.30';

  return (
    <div className="page-container" style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/otp')} style={{ gap: 6 }}>
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

      <BookingStepper currentPath="/app/summary" />

      <div className="page-header">
        <h1>Review your booking</h1>
        <p>Confirm all details before payment</p>
      </div>

      {timerCritical && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px',
          background: 'var(--warning-tint)',
          border: '1px solid var(--warning)',
          borderRadius: 10, marginBottom: 24,
          fontSize: 13, color: 'var(--warning)', fontWeight: 500,
        }} className="animate-fade-in">
          <AlertTriangle size={15} />
          Less than 1 minute to confirm — act quickly
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Session details */}
          <div className="card-elevated" style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              Session details
            </div>
            <DetailRow
              icon={<MapPin size={14} />}
              label="Station"
              value={reservation.station?.name || '—'}
              onEdit={() => navigate('/app/map')}
            />
            <DetailRow
              icon={<Calendar size={14} />}
              label="Date & time"
              value={reservation.timeSlot ? `${reservation.date} · ${reservation.timeSlot}` : '—'}
              onEdit={() => navigate('/app/time-slot')}
            />
            <DetailRow icon={<Clock size={14} />} label="Duration" value={reservation.duration || '—'} />
            <DetailRow
              icon={<Zap size={14} />}
              label="Connector"
              value={reservation.connectorType}
            />
            <DetailRow
              icon={<User size={14} />}
              label="Vehicle"
              value={reservation.vehiclePlate || '—'}
              onEdit={() => navigate('/app/vehicle')}
            />
            {reservation.userEmail && (
              <DetailRow label="Contact" value={reservation.userEmail} />
            )}
          </div>

          {/* Pricing */}
          <div className="card-elevated" style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              Pricing
            </div>
            <DetailRow label="Rate" value="0.18 DT / kWh" />
            <DetailRow
              label="Estimated energy"
              value={reservation.estimatedKwh ? `~${reservation.estimatedKwh} kWh` : '—'}
            />
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '14px 0 2px',
            }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Estimated total</span>
              <span style={{ fontSize: 20, fontWeight: 600, color: 'var(--green)', fontFamily: 'DM Mono, monospace' }}>
                ~{reservation.estimatedCost || '—'} DT
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', paddingTop: 4 }}>
              Billed after session ends based on actual kWh used
            </div>
          </div>

          {/* Payment */}
          <div className="card-elevated" style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              Payment method
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 40, height: 28, borderRadius: 5,
                  background: 'linear-gradient(135deg, #1a237e, #0d47a1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <CreditCard size={14} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Visa •••• 4821</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Pre-auth: {preAuth} DT</div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--green)', fontSize: 12 }}>Change</button>
            </div>
          </div>
        </div>

        {/* Right CTA panel */}
        <div style={{ position: 'sticky', top: 0 }}>
          <div className="card-elevated" style={{ padding: 24 }}>
            <div style={{
              padding: '16px',
              background: 'var(--green-tint)',
              border: '1px solid #00c85325',
              borderRadius: 10, marginBottom: 20,
            }}>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>You'll be charged</div>
              <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--green)', fontFamily: 'DM Mono, monospace', lineHeight: 1 }}>
                ~{reservation.estimatedCost || '—'} DT
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 }}>
                Pre-auth of {preAuth} DT — released after session
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: 12 }}
              onClick={() => navigate('/app/payment')}
            >
              Confirm & Pay
              <ChevronRight size={16} />
            </button>

            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'center', lineHeight: 1.5 }}>
              By confirming, you agree to our billing terms.
              No account required.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}