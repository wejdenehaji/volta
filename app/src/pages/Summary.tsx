import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Summary() {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(154);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => {
        if (t === 60) setShowWarning(true);
        return t > 0 ? t - 1 : 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const timerColor = timer < 60 ? 'text-error' : 'text-warning';

  return (
    <div className="w-full max-w-[390px] mx-auto bg-bg-base min-h-[100dvh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={() => navigate('/app/otp')} className="p-2 -ml-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EAEAEA" strokeWidth="1.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-[17px] font-medium text-text-primary">Your reservation</h1>
        <div className={`font-mono text-[13px] font-medium ${timerColor}`}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4">
        {/* Station card */}
        <div className="p-4 bg-surface border border-border-subtle rounded-xl mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[13px] font-medium text-text-primary">Lac 1 — Zone A, Connector 3</span>
            <button onClick={() => navigate('/app/time-slot')} className="text-[11px] text-brand">Edit →</button>
          </div>
          <div className="text-[11px] text-text-secondary">Today · 14:30 – 15:30 · 60 min</div>
        </div>

        {/* Details list */}
        <div className="bg-surface border border-border-subtle rounded-xl mb-4 overflow-hidden">
          <DetailRow label="Vehicle" value="183 · TN · 24" mono />
          <div className="h-px bg-border-subtle mx-4" />
          <DetailRow label="Time slot" value="14:30 – 15:30" />
          <div className="h-px bg-border-subtle mx-4" />
          <DetailRow label="Estimated charge" value="28–35 kWh" />
          <div className="h-px bg-border-subtle mx-4" />
          <DetailRow label="Rate" value="0.18 DT / kWh" />
          <div className="h-px bg-border-subtle mx-4" />
          <DetailRow label="Pre-authorization" value="6.30 DT" highlight />
        </div>

        <p className="text-[11px] text-text-tertiary mb-4">Billed after session ends based on actual kWh used.</p>

        {/* Payment method */}
        <div className="flex items-center justify-between p-4 bg-surface border border-border-subtle rounded-xl mb-4">
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888790" strokeWidth="1.5">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
            <span className="text-[13px] text-text-primary">Visa •••• 4821</span>
          </div>
          <span className="text-[11px] text-brand">Change</span>
        </div>

        {/* No account note */}
        <p className="text-[11px] text-text-tertiary text-center mb-4">No account needed · Code sent by SMS</p>
      </div>

      {/* Warning banner */}
      {showWarning && (
        <div className="px-4 pt-2 animate-slide-up">
          <div className="p-3 bg-warning-tint border border-warning rounded-xl mb-2">
            <p className="text-[12px] text-warning font-medium">Less than 1 minute to confirm</p>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="px-4 pb-6 pt-2 bg-bg-base border-t border-border-subtle">
        <button
          onClick={() => navigate('/app/payment')}
          className="w-full py-3 bg-brand text-brand-on rounded-lg text-[13px] font-medium hover:bg-brand-hover transition-colors"
        >
          Confirm & pay
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value, mono = false, highlight = false }: { label: string; value: string; mono?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-[13px] text-text-secondary">{label}</span>
      <span className={`text-[13px] font-medium ${highlight ? 'text-brand' : 'text-text-primary'} ${mono ? 'font-mono tracking-wide' : ''}`}>
        {value}
      </span>
    </div>
  );
}
