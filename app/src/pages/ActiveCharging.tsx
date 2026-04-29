import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoltaArc } from '@/components/VoltaArc';

export default function ActiveCharging() {
  const navigate = useNavigate();
  const [chargePercent, setChargePercent] = useState(72);
  const [kwh, setKwh] = useState(14.3);
  const [elapsed, setElapsed] = useState(34);
  const [cost, setCost] = useState(2.57);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setChargePercent(p => Math.min(100, p + 0.2));
      setKwh(k => Math.round((k + 0.1) * 10) / 10);
      setElapsed(e => e + 1);
      setCost(c => Math.round((c + 0.02) * 100) / 100);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-[390px] mx-auto bg-bg-base min-h-[100dvh] flex flex-col">
      <div className="flex-1 px-4 pt-6 pb-4">
        {/* Charging label */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-brand animate-pulse-dot" />
          <span className="text-[13px] font-medium text-brand uppercase tracking-wide">Charging</span>
        </div>

        {/* Large arc progress */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <VoltaArc size={180} progress={chargePercent} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-[36px] font-medium text-brand">{Math.round(chargePercent)}%</span>
              <span className="text-[12px] text-text-secondary mt-1">~28 min left</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between mb-8 px-2">
          <StatItem value={String(kwh)} label="kWh" />
          <div className="w-px h-10 bg-border-subtle" />
          <StatItem value={`${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`} label="Elapsed" />
          <div className="w-px h-10 bg-border-subtle" />
          <StatItem value={String(cost)} label="DT so far" />
        </div>

        {/* Session details */}
        <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden mb-6">
          <DetailRow label="Station" value="Lac 1 · Zone A" />
          <div className="h-px bg-border-subtle mx-4" />
          <DetailRow label="Connector" value="Connector 3" />
          <div className="h-px bg-border-subtle mx-4" />
          <DetailRow label="Slot ends at" value="15:30" />
          <div className="h-px bg-border-subtle mx-4" />
          <DetailRow label="Vehicle" value="183 · TN · 24" />
        </div>

        {/* End session button */}
        <button
          onClick={() => setShowEndConfirm(true)}
          className="w-full py-3 bg-surface border border-error text-error rounded-lg text-[13px] font-medium hover:bg-error-tint transition-colors"
        >
          End session
        </button>
      </div>

      {/* End confirmation bottom sheet */}
      {showEndConfirm && (
        <div className="absolute inset-0 z-50 flex items-end bg-black/40">
          <div className="w-full max-w-[390px] mx-auto bg-surface rounded-t-[20px] border-t border-border-subtle p-6 animate-slide-up">
            <div className="flex justify-center mb-4">
              <div className="w-9 h-1 bg-border-subtle rounded-full" />
            </div>
            <h3 className="text-[17px] font-medium text-text-primary mb-2">End session?</h3>
            <p className="text-[14px] text-text-secondary mb-6">
              You'll be billed for the energy used so far. The remaining time slot will be released.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 py-3 bg-surface border border-border-subtle text-text-secondary rounded-lg text-[13px] font-medium"
              >
                Keep charging
              </button>
              <button
                onClick={() => navigate('/app/receipt')}
                className="flex-1 py-3 bg-error-tint border border-error text-error rounded-lg text-[13px] font-medium"
              >
                End session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-mono text-[20px] font-medium text-text-primary">{value}</span>
      <span className="text-[11px] text-text-tertiary uppercase tracking-wide mt-1">{label}</span>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-[13px] text-text-secondary">{label}</span>
      <span className="text-[13px] font-medium text-text-primary">{value}</span>
    </div>
  );
}
