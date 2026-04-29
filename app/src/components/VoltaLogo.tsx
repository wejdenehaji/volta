import { useMemo } from 'react';

interface VoltaLogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

export function VoltaLogo({ size = 24, showWordmark = true, className = '' }: VoltaLogoProps) {
  const strokeWidth = useMemo(() => Math.max(1.5, size / 16), [size]);
  const dotSize = useMemo(() => Math.max(2, size / 12), [size]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* Ghost circle */}
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="#2A2A30"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Green arc covering 3/5 circumference (216deg) clockwise from 12 o'clock, gap at bottom-left */}
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="#00E56B"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${(216 / 360) * 2 * Math.PI * 9} ${2 * Math.PI * 9}`}
          strokeDashoffset={-((144 / 360) * 2 * Math.PI * 9) / 2}
          transform="rotate(162 12 12)"
        />
        {/* Center dot */}
        <circle cx="12" cy="12" r={dotSize} fill="#00E56B" />
      </svg>
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span
            className="font-serif text-text-primary tracking-[3px]"
            style={{ fontSize: size * 0.58, fontFamily: 'Georgia, serif' }}
          >
            VOLTA
          </span>
          <span
            className="text-text-tertiary uppercase tracking-[5px]"
            style={{ fontSize: size * 0.29, fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
          >
            CHARGE
          </span>
        </div>
      )}
    </div>
  );
}
