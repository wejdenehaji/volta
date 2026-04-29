interface StatusBadgeProps {
  status: 'available' | 'busy' | 'offline' | 'maintenance';
  className?: string;
}

const styles = {
  available: 'bg-brand-tint border-brand text-brand',
  busy: 'bg-warning-tint border-warning text-warning',
  offline: 'bg-error-tint border-error text-error',
  maintenance: 'bg-surface-hover border-border-strong text-text-tertiary',
};

const labels = {
  available: 'Available',
  busy: 'Busy',
  offline: 'Offline',
  maintenance: 'Maintenance',
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium border ${styles[status]} ${className}`}
    >
      {labels[status]}
    </span>
  );
}
