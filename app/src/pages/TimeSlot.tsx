import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Zap, Calendar, ChevronRight, AlertCircle } from 'lucide-react';
import { useReservation } from '../context/ReservationContext';
import BookingStepper from '../components/BookingStepper';

const durations = ['30 min', '1h', '1.5h', '2h'];
const timeSlots = ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
const days = ['Today', 'Thu 8', 'Fri 9', 'Sat 10'];
const takenSlots = ['13:00', '15:30'];

export default function TimeSlot() {
  const navigate = useNavigate();
  const { reservation, update } = useReservation();
  const [selectedDay, setSelectedDay] = useState('Today');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState('1h');
  const [timer, setTimer] = useState(240);

  useEffect(() => {
    if (!reservation.station) navigate('/app/map');
  }, [reservation.station, navigate]);

  useEffect(() => {
    const iv = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(iv);
  }, []);

  const estimatedKwh = useMemo(() => {
    const h = selectedDuration === '30 min' ? 0.5 : selectedDuration === '1h' ? 1 : selectedDuration === '1.5h' ? 1.5 : 2;
    return (h * 18).toFixed(0);
  }, [selectedDuration]);

  const estimatedCost = useMemo(() => {
    return (parseFloat(estimatedKwh) * 0.18).toFixed(2);
  }, [estimatedKwh]);

  const endTime = useMemo(() => {
    if (!selectedTime) return '--:--';
    const [h, m] = selectedTime.split(':').map(Number);
    const mins = h * 60 + m + (
      selectedDuration === '30 min' ? 30 :
      selectedDuration === '1h' ? 60 :
      selectedDuration === '1.5h' ? 90 : 120
    );
    return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
  }, [selectedTime, selectedDuration]);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const timerCritical = timer < 60;

  const handleContinue = () => {
    if (!selectedTime) return;
    update({
      date: selectedDay,
      timeSlot: `${selectedTime} – ${endTime}`,
      duration: selectedDuration,
      estimatedKwh,
      estimatedCost,
    });
    navigate('/app/vehicle');
  };

  return (
    <div className="page-container" style={{ maxWidth: 900 }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/map')} style={{ gap: 6 }}>
          <ArrowLeft size={15} />
          Back to map
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
            fontFamily: 'DM Mono, monospace',
            fontSize: 13, fontWeight: 500,
            color: timerCritical ? 'var(--error)' : 'var(--text-secondary)',
          }}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      <BookingStepper currentPath="/app/time-slot" />

      <div className="page-header">
        <h1>Select a time slot</h1>
        <p>Choose when you'd like to charge at {reservation.station?.name}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        {/* Left: selectors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Station reminder */}
          <div className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{reservation.station?.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                {reservation.station?.connectors} connectors · {reservation.station?.address}
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/map')}>Change</button>
          </div>

          {/* Date */}
          <div>
            <label className="field-label" style={{ marginBottom: 10 }}>
              <Calendar size={12} style={{ display: 'inline', marginRight: 5 }} />
              Select date
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    padding: '9px 20px',
                    borderRadius: 8, fontSize: 13, fontWeight: 500,
                    border: `1px solid ${selectedDay === day ? 'var(--green)' : 'var(--border-default)'}`,
                    background: selectedDay === day ? 'var(--green-muted)' : 'var(--surface-2)',
                    color: selectedDay === day ? 'var(--green)' : 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'all 120ms',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Time slots */}
          <div>
            <label className="field-label" style={{ marginBottom: 10 }}>
              <Clock size={12} style={{ display: 'inline', marginRight: 5 }} />
              Arrival time
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {timeSlots.map(time => {
                const taken = takenSlots.includes(time);
                const active = selectedTime === time;
                return (
                  <button
                    key={time}
                    disabled={taken}
                    onClick={() => setSelectedTime(time)}
                    style={{
                      padding: '9px 18px',
                      borderRadius: 8, fontSize: 13, fontWeight: 500,
                      border: `1px solid ${taken ? 'var(--border-subtle)' : active ? 'var(--green)' : 'var(--border-default)'}`,
                      background: taken ? 'var(--surface-0)' : active ? 'var(--green-muted)' : 'var(--surface-2)',
                      color: taken ? 'var(--text-disabled)' : active ? 'var(--green)' : 'var(--text-secondary)',
                      cursor: taken ? 'not-allowed' : 'pointer',
                      opacity: taken ? 0.5 : 1,
                      transition: 'all 120ms',
                      fontFamily: 'DM Mono, monospace',
                      letterSpacing: '0.04em',
                      textDecoration: taken ? 'line-through' : 'none',
                    }}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 8 }}>
              Strikethrough slots are already reserved
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="field-label" style={{ marginBottom: 10 }}>
              <Zap size={12} style={{ display: 'inline', marginRight: 5 }} />
              Charging duration
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {durations.map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDuration(d)}
                  style={{
                    flex: 1, padding: '10px 0',
                    borderRadius: 8, fontSize: 13, fontWeight: 500,
                    border: `1px solid ${selectedDuration === d ? 'var(--green)' : 'var(--border-default)'}`,
                    background: selectedDuration === d ? 'var(--green-muted)' : 'var(--surface-2)',
                    color: selectedDuration === d ? 'var(--green)' : 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'all 120ms',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: summary card */}
        <div style={{ position: 'sticky', top: 0 }}>
          <div className="card-elevated" style={{ padding: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}>
              Session preview
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              {[
                { label: 'Station', value: reservation.station?.name || '—' },
                { label: 'Date', value: selectedDay },
                { label: 'Start time', value: selectedTime || '—' },
                { label: 'End time', value: selectedTime ? endTime : '—' },
                { label: 'Duration', value: selectedDuration },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0 0 16px' }} />

            {selectedTime && (
              <div style={{
                padding: '12px 14px',
                background: 'var(--green-tint)',
                border: '1px solid #00c85325',
                borderRadius: 10,
                marginBottom: 16,
              }}>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>Estimated charge</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Energy</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--green)', fontFamily: 'DM Mono, monospace' }}>~{estimatedKwh} kWh</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Cost</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--green)', fontFamily: 'DM Mono, monospace' }}>~{estimatedCost} DT</span>
                </div>
              </div>
            )}

            {!selectedTime && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 14px',
                background: 'var(--surface-2)',
                borderRadius: 10,
                marginBottom: 16,
              }}>
                <AlertCircle size={14} color="var(--text-tertiary)" />
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Select a time slot to see estimate</span>
              </div>
            )}

            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={!selectedTime}
              onClick={handleContinue}
            >
              Continue
              <ChevronRight size={15} />
            </button>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 10 }}>
              0.18 DT / kWh · Billed after session
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}