import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoltaLogo } from '@/components/VoltaLogo';

export default function QRConfirmation() {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(1238); // 20:38 in seconds
  const [expired, setExpired] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setQrVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          setExpired(true);
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <div className={`w-full max-w-[390px] mx-auto min-h-[100dvh] flex flex-col transition-colors duration-500 ${expired ? 'bg-brand/5' : 'bg-bg-base'}`}>
      {/* Header - no back arrow */}
      <div className="flex items-center justify-center px-4 pt-4 pb-3">
        <VoltaLogo size={24} />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4">
        {/* Active session badge */}
        <div className="flex justify-center mb-4">
          <span className="px-3 py-1 bg-brand-tint border border-brand rounded-full text-[11px] font-medium text-brand">
            Active session
          </span>
        </div>

        {/* Station label */}
        <div className="text-center mb-6">
          <h1 className="text-[13px] font-medium text-text-tertiary uppercase tracking-[0.15em] mb-1">
            Lac 1 · Zone A · Connector 3
          </h1>
          <p className="text-[12px] text-text-secondary">Show this code at the station</p>
        </div>

        {/* QR code block */}
        <div className={`flex justify-center mb-6 transition-all duration-500 ${qrVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="bg-[#F2F2F2] rounded-2xl p-5">
            <div className="w-[200px] h-[200px] relative">
              {/* QR pattern simulation */}
              <svg viewBox="0 0 200 200" width="200" height="200">
                {Array.from({ length: 25 }).map((_, row) =>
                  Array.from({ length: 25 }).map((_, col) => {
                    const isCorner = (row < 7 && col < 7) || (row < 7 && col > 17) || (row > 17 && col < 7);
                    const isCenter = row >= 9 && row <= 15 && col >= 9 && col <= 15;
                    const isRandom = Math.random() > 0.5;
                    if (isCorner || (!isCenter && isRandom)) {
                      return (
                        <rect
                          key={`${row}-${col}`}
                          x={col * 8}
                          y={row * 8}
                          width="7"
                          height="7"
                          rx="1"
                          fill="#0B0B0F"
                        />
                      );
                    }
                    return null;
                  })
                )}
                {/* Corner markers */}
                <rect x="4" y="4" width="49" height="49" fill="none" stroke="#0B0B0F" strokeWidth="4" />
                <rect x="12" y="12" width="33" height="33" fill="#0B0B0F" />
                <rect x="147" y="4" width="49" height="49" fill="none" stroke="#0B0B0F" strokeWidth="4" />
                <rect x="155" y="12" width="33" height="33" fill="#0B0B0F" />
                <rect x="4" y="147" width="49" height="49" fill="none" stroke="#0B0B0F" strokeWidth="4" />
                <rect x="12" y="155" width="33" height="33" fill="#0B0B0F" />
                {/* Center logo area */}
                <circle cx="100" cy="100" r="20" fill="#F2F2F2" />
              </svg>
              {/* Center mark */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-[#F2F2F2] rounded-full flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="8" stroke="#0B0B0F" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="8" stroke="#0B0B0F" strokeWidth="1.5" strokeDasharray="12 38" strokeLinecap="round" transform="rotate(120 12 12)" />
                    <circle cx="12" cy="12" r="2" fill="#0B0B0F" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Session code */}
        <div className="text-center mb-6">
          <span className="font-mono text-[15px] font-medium text-text-primary tracking-[0.15em]">
            V3 · LAC1 · 2026 · 7F4A
          </span>
        </div>

        {/* Details rows */}
        <div className="bg-surface border border-border-subtle rounded-xl mb-6 overflow-hidden">
          <DetailRow label="Station" value="Lac 1 · A-03" />
          <div className="h-px bg-border-subtle mx-4" />
          <DetailRow label="Slot" value="14:30 – 15:30" />
          <div className="h-px bg-border-subtle mx-4" />
          <DetailRow label="Vehicle" value="183 · TN · 24" />
        </div>

        {/* Countdown or Go plug in */}
        <div className="text-center py-4">
          {expired ? (
            <button
              onClick={() => navigate('/app/handshake')}
              className="text-[18px] font-medium text-brand hover:text-brand-hover transition-colors animate-fade-in"
            >
              Go plug in →
            </button>
          ) : (
            <>
              <div className="text-[11px] text-text-tertiary uppercase tracking-wide mb-2">Slot begins in</div>
              <div className="font-mono text-[22px] font-medium text-brand animate-timer-pulse">
                {String(Math.floor(minutes / 60)).padStart(2, '0')}:{String(minutes % 60).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-4 pb-6 pt-2 bg-bg-base border-t border-border-subtle">
        <div className="flex gap-3 mb-3">
          <button className="flex-1 py-2.5 bg-surface border border-border-subtle rounded-lg text-[13px] text-text-secondary hover:bg-surface-hover transition-colors">
            Apple Wallet
          </button>
          <button className="flex-1 py-2.5 bg-surface border border-border-subtle rounded-lg text-[13px] text-text-secondary hover:bg-surface-hover transition-colors">
            Google Wallet
          </button>
        </div>
        <button className="w-full py-2 text-[12px] text-text-tertiary hover:text-text-secondary transition-colors">
          Create an account →
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-[13px] text-text-secondary">{label}</span>
      <span className="text-[13px] font-medium text-text-primary font-mono tracking-wide">{value}</span>
    </div>
  );
}
