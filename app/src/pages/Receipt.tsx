import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoltaLogo } from '@/components/VoltaLogo';

export default function Receipt() {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowCheck(true), 300);
    const t2 = setTimeout(() => {
      const duration = 600;
      const target = 3.31;
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const p = Math.min(elapsed / duration, 1);
        setTotal(Math.round(target * p * 100) / 100);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, 500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="w-full max-w-[390px] mx-auto bg-bg-base min-h-[100dvh] flex flex-col px-4">
      {/* Header */}
      <div className="flex justify-center pt-6 pb-4">
        <VoltaLogo size={28} />
      </div>

      <div className="flex-1">
        {/* Session complete + checkmark */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            {showCheck && (
              <svg width="48" height="48" viewBox="0 0 48 48" className="animate-scale-in">
                <circle cx="24" cy="24" r="22" fill="none" stroke="#00E56B" strokeWidth="2" />
                <path
                  d="M14 24l8 8 12-16"
                  fill="none"
                  stroke="#00E56B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-trace-check"
                  style={{ strokeDasharray: 100, strokeDashoffset: 0 }}
                />
              </svg>
            )}
          </div>
          <h1 className="text-[22px] font-medium text-text-primary">Session complete</h1>
          <p className="text-[13px] text-text-secondary mt-1">Today · 14:30 – 15:28</p>
        </div>

        {/* Receipt card */}
        <div className="bg-surface border border-brand rounded-xl overflow-hidden mb-6">
          <ReceiptRow label="Station" value="Lac 1 · Zone A · C-3" />
          <div className="h-px bg-border-subtle mx-4" />
          <ReceiptRow label="Duration" value="0:58" />
          <div className="h-px bg-border-subtle mx-4" />
          <ReceiptRow label="Energy delivered" value="18.4 kWh" />
          <div className="h-px bg-border-subtle mx-4" />
          <ReceiptRow label="Rate" value="0.18 DT / kWh" />
          <div className="h-px bg-border-subtle mx-4" />
          <ReceiptRow label="Subtotal" value="3.31 DT" />
          <div className="px-4 py-3 bg-brand-tint/20">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-brand">Total charged</span>
              <span className="font-mono text-[20px] font-medium text-brand">
                {total.toFixed(2)} DT
              </span>
            </div>
          </div>
        </div>

        {/* Pre-auth released */}
        <p className="text-[12px] text-text-secondary text-center mb-8">
          2.99 DT pre-auth released to your card within 24h
        </p>

        {/* Actions */}
        <div className="flex gap-3 mb-8">
          <button className="flex-1 py-2.5 bg-surface border border-border-subtle rounded-lg text-[13px] text-text-secondary hover:bg-surface-hover transition-colors">
            Download
          </button>
          <button className="flex-1 py-2.5 bg-surface border border-border-subtle rounded-lg text-[13px] text-text-secondary hover:bg-surface-hover transition-colors">
            Share
          </button>
        </div>
      </div>

      {/* Continue CTA */}
      <div className="pb-6">
        <button
          onClick={() => navigate('/app/convert')}
          className="w-full py-3 bg-brand text-brand-on rounded-lg text-[13px] font-medium hover:bg-brand-hover transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-[13px] text-text-secondary">{label}</span>
      <span className="text-[13px] font-medium text-text-primary">{value}</span>
    </div>
  );
}
