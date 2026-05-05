import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Zap } from 'lucide-react';
import { VoltaLogo } from '@/components/VoltaLogo';
import { useAuth } from '@/hooks/useAuth';

export default function SoftConversion() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const { login } = useAuth();

  const handleGuest = () => {
    sessionStorage.setItem('guest', 'true');
    navigate('/app/map');
  };

  return (
    <div className="w-full max-w-[390px] mx-auto bg-bg-base min-h-[100dvh] flex flex-col px-4">
      {/* Header */}
      <div className="flex justify-center pt-6 pb-6">
        <VoltaLogo size={48} showWordmark={false} />
      </div>

      <div className="flex-1">
        <h1 className="text-[22px] font-medium text-text-primary text-center mb-2">
          Book faster next time.
        </h1>
        <p className="text-[14px] text-text-secondary text-center mb-8 max-w-[300px] mx-auto">
          Save your vehicle and payment method. Skip identification next time.
        </p>

        {/* Pre-filled card */}
        <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden mb-6">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-[13px] text-text-secondary">Vehicle</span>
            <span className="text-[13px] font-medium text-text-primary font-mono tracking-wide">183 · TN · 24</span>
          </div>
          <div className="h-px bg-border-subtle mx-4" />
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-[13px] text-text-secondary">Phone</span>
            <span className="text-[13px] font-medium text-text-primary font-mono tracking-wide">+216 •• •• •• 47</span>
          </div>
        </div>

        {/* Keycloak sign-in */}
        <div className="bg-surface border border-border-subtle rounded-xl p-5 mb-6 text-center">
          <ShieldCheck size={36} className="mx-auto mb-3" style={{ color: 'var(--green)', opacity: 0.85 }} />
          <p className="text-[13px] text-text-secondary mb-4">
            Sign in securely to save your details and book faster.
          </p>
          <button
            onClick={login}
            className="w-full py-3 rounded-lg text-[13px] font-medium flex items-center justify-center gap-2"
            style={{ background: 'var(--green)', color: '#000' }}
          >
            <Zap size={15} fill="currentColor" />
            Sign in with Keycloak
          </button>
        </div>

        {/* Book again (guest) */}
        <button
          onClick={() => navigate('/app/map')}
          className="w-full py-3 bg-surface border border-border-subtle text-text-secondary rounded-lg text-[13px] font-medium hover:bg-surface-hover transition-colors mb-6"
        >
          Book this station again →
        </button>

        {/* Rating */}
        <div className="text-center mb-6">
          <p className="text-[13px] text-text-secondary mb-2">Rate this session:</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-[24px] transition-colors ${star <= rating ? 'text-warning' : 'text-border-subtle'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Skip */}
      <div className="pb-6">
        <button
          onClick={handleGuest}
          className="w-full py-2 text-[13px] text-text-tertiary hover:text-text-secondary transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}