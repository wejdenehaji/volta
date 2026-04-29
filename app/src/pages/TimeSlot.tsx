import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const durations = ['30 min', '1h', '1.5h', '2h'];
const timeSlots = [
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];
const days = ['Today', 'Thu 8', 'Fri 9', 'Sat 10'];

export default function TimeSlot() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState('Today');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState('1h');
  const [timer, setTimer] = useState(240); // 4 minutes in seconds
  const [takenSlots] = useState(['13:00', '15:30']);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timerColor = timer < 30 ? 'text-error' : 'text-warning';
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  const canConfirm = selectedTime !== null;

  // Estimate charge % based on duration
  const estimatedCharge = useMemo(() => {
    const hours = selectedDuration === '30 min' ? 0.5 : selectedDuration === '1h' ? 1 : selectedDuration === '1.5h' ? 1.5 : 2;
    return Math.min(100, Math.round(50 + hours * 34));
  }, [selectedDuration]);

  return (
    <div className="w-full max-w-[390px] mx-auto bg-bg-base min-h-[100dvh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={() => navigate('/app/map')} className="p-2 -ml-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EAEAEA" strokeWidth="1.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-[17px] font-medium text-text-primary">Select a time</h1>
        <div className={`font-mono text-[13px] font-medium ${timerColor}`}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4">
        {/* Station summary card */}
        <div className="p-4 bg-surface border border-border-subtle rounded-xl mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[13px] font-medium text-text-primary">Lac 1 — Zone A</span>
            <span className="text-[11px] text-brand">Change</span>
          </div>
          <div className="text-[11px] text-text-secondary">4 connectors · Connector 3</div>
        </div>

        {/* Date selector */}
        <div className="mb-4">
          <div className="text-[11px] text-text-tertiary uppercase tracking-wide mb-2">Select date</div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {days.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap border transition-colors ${
                  selectedDay === day
                    ? 'bg-brand-tint border-brand text-brand'
                    : 'bg-surface border-border-subtle text-text-secondary hover:border-border-strong'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Time slots */}
        <div className="mb-4">
          <div className="text-[11px] text-text-tertiary uppercase tracking-wide mb-2">Select arrival time</div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {timeSlots.map(time => {
              const isTaken = takenSlots.includes(time);
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  disabled={isTaken}
                  onClick={() => setSelectedTime(time)}
                  className={`px-4 py-2.5 rounded-lg text-[13px] font-medium whitespace-nowrap border transition-all flex items-center gap-1 ${
                    isTaken
                      ? 'bg-bg-base border-border-subtle text-text-disabled cursor-not-allowed'
                      : isSelected
                      ? 'bg-brand-tint border-brand text-brand'
                      : 'bg-surface border-border-subtle text-text-secondary hover:border-brand'
                  }`}
                >
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00E56B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                  {time}
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration */}
        <div className="mb-4">
          <div className="text-[11px] text-text-tertiary uppercase tracking-wide mb-2">Duration</div>
          <div className="flex gap-2">
            {durations.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDuration(d)}
                className={`flex-1 py-2.5 rounded-lg text-[13px] font-medium border transition-colors ${
                  selectedDuration === d
                    ? 'bg-brand-tint border-brand text-brand'
                    : 'bg-surface border-border-subtle text-text-secondary hover:border-border-strong'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Charge preview */}
        <div className="p-4 bg-brand-tint/30 border border-brand/20 rounded-xl mb-6">
          <p className="text-[13px] text-text-secondary">
            Your car will reach ~<span className="text-brand font-medium">{estimatedCharge}%</span> by {selectedTime ? `${parseInt(selectedTime.split(':')[0]) + (selectedDuration === '30 min' ? 0 : parseInt(selectedDuration))}:${selectedTime.split(':')[1]}` : 'end time'}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-6 pt-2 bg-bg-base border-t border-border-subtle">
        <button
          disabled={!canConfirm}
          onClick={() => navigate('/app/vehicle')}
          className={`w-full py-3 rounded-lg text-[13px] font-medium transition-colors ${
            canConfirm
              ? 'bg-brand text-brand-on hover:bg-brand-hover'
              : 'bg-surface text-text-disabled border border-border-subtle cursor-not-allowed'
          }`}
        >
          Confirm time slot
        </button>
      </div>
    </div>
  );
}
