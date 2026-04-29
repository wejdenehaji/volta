import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoltaArc } from '@/components/VoltaArc';

export default function Handshake() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'timeout'>('connecting');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) {
          clearInterval(interval);
          // Simulate connection success
          setTimeout(() => {
            setProgress(100);
            setStatus('connected');
            setTimeout(() => navigate('/app/charging'), 800);
          }, 500);
          return 90;
        }
        return p + 0.9; // 0->90% over 10s
      });
    }, 100);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="w-full max-w-[390px] mx-auto bg-bg-base min-h-[100dvh] flex flex-col items-center justify-center px-6">
      {status === 'timeout' ? (
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-error-tint border border-error flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E24B4A" strokeWidth="1.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-[17px] font-medium text-text-primary mb-2">Connection timed out</h2>
          <p className="text-[14px] text-text-secondary mb-6">Please check the connector and try again.</p>
          <div className="flex gap-3">
            <button
              onClick={() => { setStatus('connecting'); setProgress(0); }}
              className="px-5 py-2.5 bg-brand text-brand-on rounded-lg text-[13px] font-medium"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/app/map')}
              className="px-5 py-2.5 bg-surface border border-border-subtle text-text-secondary rounded-lg text-[13px] font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {/* Rotating arc */}
          <div className="mb-8">
            <VoltaArc size={120} rotating />
          </div>

          <h2 className="text-[17px] font-medium text-text-primary mb-2">Connecting to station...</h2>
          <p className="text-[13px] text-text-secondary mb-6">Lac 1 — Zone A · Connector 3</p>

          {/* Progress bar */}
          <div className="w-64 h-[3px] bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-2 font-mono text-[12px] text-text-tertiary">
            {Math.round(progress)}%
          </div>
        </div>
      )}
    </div>
  );
}
