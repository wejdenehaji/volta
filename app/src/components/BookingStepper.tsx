import { Check } from 'lucide-react';

interface Step {
  label: string;
  path: string;
}

const STEPS: Step[] = [
  { label: 'Station', path: '/app/map' },
  { label: 'Time slot', path: '/app/time-slot' },
  { label: 'Vehicle', path: '/app/vehicle' },
  { label: 'Verify', path: '/app/otp' },
  { label: 'Review', path: '/app/summary' },
  { label: 'Payment', path: '/app/payment' },
];

interface BookingStepperProps {
  currentPath: string;
}

export default function BookingStepper({ currentPath }: BookingStepperProps) {
  const currentIdx = STEPS.findIndex(s => s.path === currentPath);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      marginBottom: 32,
    }}>
      {STEPS.map((step, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;

        return (
          <div key={step.path} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 600,
                background: done ? 'var(--green)' : active ? 'var(--green-muted)' : 'var(--surface-3)',
                border: `1px solid ${done ? 'var(--green)' : active ? 'var(--green)' : 'var(--border-default)'}`,
                color: done ? '#001a0d' : active ? 'var(--green)' : 'var(--text-tertiary)',
                transition: 'all 200ms',
              }}>
                {done ? <Check size={11} strokeWidth={3} /> : i + 1}
              </div>
              <span style={{
                fontSize: 12, fontWeight: active ? 500 : 400,
                color: done ? 'var(--text-secondary)' : active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                whiteSpace: 'nowrap',
              }}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1,
                height: 1,
                margin: '0 10px',
                background: i < currentIdx ? 'var(--green)' : 'var(--border-subtle)',
                opacity: i < currentIdx ? 0.6 : 1,
                transition: 'background 300ms',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}