import { useMemo } from 'react';

interface VoltaArcProps {
  size?: number;
  progress?: number;
  animated?: boolean;
  rotating?: boolean;
  className?: string;
}

export function VoltaArc({
  size = 180,
  progress = 0,
  animated = false,
  rotating = false,
  className = '',
}: VoltaArcProps) {
  const strokeWidth = useMemo(() => Math.max(3, size / 60), [size]);
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (216 / 360) * circumference;
  const dashOffset = useMemo(() => {
    if (animated || rotating) return 0;
    return circumference - (progress / 100) * arcLength;
  }, [animated, rotating, progress, circumference, arcLength]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={`${rotating ? 'animate-spin-slow' : ''} ${className}`}
    >
      {/* Ghost ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#2A2A30"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#00E56B"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={animated ? `${arcLength} ${circumference}` : `${arcLength} ${circumference}`}
        strokeDashoffset={dashOffset}
        transform={`rotate(162 ${size / 2} ${size / 2})`}
        style={{
          transition: 'stroke-dashoffset 0.5s ease-out',
        }}
      />
      {/* Center dot */}
      <circle cx={size / 2} cy={size / 2} r={strokeWidth} fill="#00E56B" />
    </svg>
  );
}
