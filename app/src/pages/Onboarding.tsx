import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoltaLogo } from '@/components/VoltaLogo';

function OnboardingScreen({
  step,
  totalSteps,
  icon,
  headline,
  description,
  onNext,
  onSkip,
  primaryAction,
  primaryLabel,
  secondaryAction,
  secondaryLabel,
}: {
  step: number;
  totalSteps: number;
  icon: React.ReactNode;
  headline: string;
  description: string;
  onNext?: () => void;
  onSkip?: () => void;
  primaryAction?: () => void;
  primaryLabel: string;
  secondaryAction?: () => void;
  secondaryLabel?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`min-h-[100dvh] bg-bg-base flex flex-col px-6 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <div className="flex items-center justify-between pt-6 pb-4">
        <VoltaLogo size={24} />
        {onSkip && (
          <button onClick={onSkip} className="text-[13px] text-text-tertiary hover:text-text-secondary transition-colors">
            Skip
          </button>
        )}
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-2 mb-12">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === step
                ? 'w-[18px] h-[6px] rounded-[3px] bg-brand'
                : 'w-[6px] h-[6px] bg-border-subtle'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center text-center">
        <div
          className="w-16 h-16 flex items-center justify-center rounded-xl border border-brand bg-brand-tint mb-8 animate-slide-up"
          style={{ animationDelay: '100ms', animationFillMode: 'both' }}
        >
          {icon}
        </div>

        <h1
          className="text-[22px] font-medium text-text-primary tracking-tight mb-4 max-w-[280px] animate-slide-up"
          style={{ animationDelay: '150ms', animationFillMode: 'both' }}
        >
          {headline}
        </h1>

        <p
          className="text-[14px] text-text-secondary leading-relaxed max-w-[300px] animate-slide-up"
          style={{ animationDelay: '200ms', animationFillMode: 'both' }}
        >
          {description}
        </p>
      </div>

      {/* Actions */}
      <div className="pb-10 flex flex-col gap-3 animate-slide-up" style={{ animationDelay: '250ms', animationFillMode: 'both' }}>
        <button
          onClick={primaryAction || onNext}
          className="w-full py-3 bg-brand text-brand-on rounded-lg text-[13px] font-medium hover:bg-brand-hover transition-colors"
        >
          {primaryLabel}
        </button>
        {secondaryAction && secondaryLabel && (
          <button
            onClick={secondaryAction}
            className="w-full py-3 bg-surface border border-border-subtle rounded-lg text-[13px] font-medium text-text-secondary hover:bg-surface-hover transition-colors"
          >
            {secondaryLabel}
          </button>
        )}
        {onSkip && (
          <button
            onClick={onSkip}
            className="w-full py-2 text-[13px] text-text-tertiary hover:text-text-secondary transition-colors"
          >
            Skip onboarding
          </button>
        )}
      </div>
    </div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState(0);

  const finishOnboarding = () => {
    localStorage.setItem('volta-charge-state', JSON.stringify({ onboardingComplete: true, screen: 'map' }));
    navigate('/app/map');
  };

  const skip = () => finishOnboarding();

  const screens = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00E56B" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v3m0 15v-3m9-9h-3M3 12h3" />
        </svg>
      ),
      headline: 'Reserve your slot. In 60 seconds.',
      description: 'Find available charging stations near you and lock in your time before you arrive.',
      primaryLabel: 'Next',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="7" width="18" height="12" rx="2" stroke="#00E56B" strokeWidth="1.5" />
          <rect x="6" y="10" width="4" height="6" rx="1" fill="#00E56B" opacity="1" />
          <rect x="11" y="10" width="4" height="6" rx="1" fill="#00E56B" opacity="0.5" />
          <rect x="16" y="10" width="2" height="6" rx="1" fill="#00E56B" opacity="0.2" />
        </svg>
      ),
      headline: 'No account needed to charge.',
      description: 'We identify your vehicle from its plate number. Just confirm your phone and you\'re set.',
      primaryLabel: 'Next',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#0A3D2C" stroke="#00E56B" strokeWidth="1.5" />
          <circle cx="12" cy="9" r="2.5" fill="#00E56B" />
        </svg>
      ),
      headline: 'Find stations near you.',
      description: 'We need your location to show nearby stations. We don\'t track you when you\'re not using the app.',
      primaryLabel: 'Allow location access',
      secondaryLabel: 'Maybe later',
    },
  ];

  const current = screens[screen];

  return (
    <div className="w-full max-w-[390px] mx-auto bg-bg-base">
      <OnboardingScreen
        step={screen}
        totalSteps={3}
        icon={current.icon}
        headline={current.headline}
        description={current.description}
        primaryLabel={current.primaryLabel}
        secondaryLabel={current.secondaryLabel}
        onNext={() => {
          if (screen < 2) setScreen(screen + 1);
          else finishOnboarding();
        }}
        primaryAction={() => {
          if (screen === 2) {
            // Simulate location permission
            finishOnboarding();
          } else {
            setScreen(screen + 1);
          }
        }}
        secondaryAction={screen === 2 ? () => finishOnboarding() : undefined}
        onSkip={skip}
      />
    </div>
  );
}
