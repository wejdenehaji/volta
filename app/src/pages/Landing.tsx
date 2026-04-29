import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoltaLogo } from '@/components/VoltaLogo';
import { stations } from '@/lib/api';

function Hero() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      if (heroRef.current) {
        heroRef.current.style.setProperty('--scroll-opacity', String(Math.min(y / 400, 1)));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100dvh] flex flex-col overflow-hidden"
      style={{ '--scroll-opacity': '0' } as React.CSSProperties}
    >
      {/* Video placeholder / dark overlay */}
      <div className="absolute inset-0 bg-bg-base">
        <div
          className="absolute inset-0 bg-bg-base transition-opacity duration-700"
          style={{ opacity: `calc(0.6 + var(--scroll-opacity) * 0.4)` }}
        />
        {/* Animated gradient overlay for visual interest */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-tint/20 via-transparent to-transparent" />
        </div>
      </div>

      {/* Nav */}
      <nav className={`relative z-10 flex items-center justify-between px-6 py-5 transition-all duration-300 ${scrolled ? 'bg-bg-base/80 backdrop-blur-md' : ''}`}>
        <VoltaLogo size={28} />
        <button
          onClick={() => navigate('/app/map')}
          className="px-5 py-2.5 bg-surface border border-border-subtle rounded-lg text-[13px] font-medium text-text-secondary hover:bg-surface-hover transition-colors"
        >
          Find a station
        </button>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center" style={{ opacity: `calc(1 - var(--scroll-opacity))` }}>
        <h1
          className="font-serif text-text-primary leading-tight mb-4"
          style={{
            fontSize: 'clamp(40px, 5vw, 64px)',
            fontFamily: 'Georgia, serif',
            letterSpacing: '-0.3px',
          }}
        >
          Reserve. Plug. Go.
        </h1>
        <p className="text-[18px] text-text-secondary font-normal mb-8 max-w-md">
          Electric charging, on your schedule.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => navigate('/app/map')}
            className="px-5 py-2.5 bg-brand text-brand-on rounded-lg text-[13px] font-medium hover:bg-brand-hover transition-colors"
          >
            Find a station near me
          </button>
          <a
            href="#how-it-works"
            className="text-[13px] text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
          >
            How it works ↓
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex flex-col items-center pb-8 animate-scroll-bounce" style={{ opacity: `calc(1 - var(--scroll-opacity))` }}>
        <div className="w-5 h-8 border-2 border-brand/40 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-brand rounded-full" />
        </div>
      </div>
    </section>
  );
}

function ProofBar() {
  const [visible, setVisible] = useState(false);
  const [counts, setCounts] = useState({ stations: 0, uptime: 0, booking: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const duration = 1500;
    const start = performance.now();
    const targets = { stations: 47, uptime: 99.1, booking: 18 };
    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCounts({
        stations: Math.round(targets.stations * ease),
        uptime: Math.round(targets.uptime * ease * 10) / 10,
        booking: Math.round(targets.booking * ease),
      });
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible]);

  return (
    <section ref={ref} className="relative z-10 bg-bg-base border-y border-border-subtle">
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-0">
        <div className="flex-1 text-center px-4">
          <div className="font-mono text-[48px] font-medium text-brand leading-none">{counts.stations}</div>
          <div className="section-header mt-2">Active stations</div>
        </div>
        <div className="hidden sm:block w-px h-16 bg-border-subtle" />
        <div className="flex-1 text-center px-4">
          <div className="font-mono text-[48px] font-medium text-brand leading-none">{counts.uptime.toFixed(1)}%</div>
          <div className="section-header mt-2">Network uptime</div>
        </div>
        <div className="hidden sm:block w-px h-16 bg-border-subtle" />
        <div className="flex-1 text-center px-4">
          <div className="font-mono text-[48px] font-medium text-brand leading-none">{counts.booking} <span className="text-[24px]">min</span></div>
          <div className="section-header mt-2">Average booking time</div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (viewportHeight - rect.top) / (viewportHeight + rect.height)));
      const step = Math.min(2, Math.floor(progress * 3));
      setActiveStep(step);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const steps = [
    {
      num: '01',
      title: 'Find a station near you',
      body: 'See real-time availability on the map. Available stations shown in green, busy in amber. No app required to browse.',
    },
    {
      num: '02',
      title: 'Reserve in under 60 seconds',
      body: 'Enter your plate number. Pick a time slot. Confirm. No account needed — we identify your vehicle automatically.',
    },
    {
      num: '03',
      title: 'Scan the QR. Start charging',
      body: 'Arrive at the station. Scan your session code. Your charging session starts automatically. Pay only for what you use.',
    },
  ];

  return (
    <section id="how-it-works" ref={ref} className="relative z-10 bg-bg-base py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="section-header mb-12">How it works</div>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Steps */}
          <div className="flex-1 flex flex-col gap-10">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`transition-opacity duration-500 ${activeStep >= i ? 'opacity-100' : 'opacity-40'}`}
              >
                <div className="font-mono text-[40px] font-medium text-brand-tint mb-2">{step.num}</div>
                <h3 className="text-[17px] font-medium text-text-primary mb-2">{step.title}</h3>
                <p className="text-[14px] text-text-secondary leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>

          {/* Phone mockup */}
          <div className="lg:w-[390px] flex-shrink-0 flex justify-center lg:sticky lg:top-24 lg:self-start">
            <div
              className="w-[280px] sm:w-[320px] lg:w-[390px] aspect-[390/844] rounded-[26px] border-[1.5px] border-border-subtle bg-surface overflow-hidden relative"
            >
              <div className="absolute inset-0 flex items-center justify-center p-6 transition-opacity duration-500">
                <div className="text-center">
                  <div className="font-mono text-[48px] text-brand mb-4">
                    {['🗺️', '⚡', '📱'][activeStep]}
                  </div>
                  <p className="text-[14px] text-text-secondary">
                    {steps[activeStep].title}
                  </p>
                </div>
              </div>
              {/* Screen indicator */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      activeStep === i ? 'w-4 bg-brand' : 'w-1 bg-border-subtle'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MapPreview() {
  const navigate = useNavigate();
  const availableCount = stations.filter(s => s.status === 'available').length;

  return (
    <section className="relative z-10 bg-bg-base py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="section-header mb-4">Map preview</div>
        <h2 className="text-[22px] font-medium text-text-primary tracking-tight mb-8">
          Find a station
        </h2>

        {/* Map placeholder */}
        <div className="relative w-full h-[280px] sm:h-[400px] rounded-2xl bg-surface border border-border-subtle overflow-hidden">
          <div className="absolute inset-0 bg-[#111115]">
            {/* Grid lines for map effect */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="absolute border-border-subtle/30" style={{
                  left: `${i * 5}%`,
                  top: 0,
                  bottom: 0,
                  borderLeft: '1px solid',
                }} />
              ))}
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="absolute border-border-subtle/30" style={{
                  top: `${i * 6.25}%`,
                  left: 0,
                  right: 0,
                  borderTop: '1px solid',
                }} />
              ))}
            </div>

            {/* Pins */}
            {stations.map((station, i) => {
              const left = 20 + (i * 15) % 70;
              const top = 25 + (i * 23) % 55;
              const color = station.status === 'available' ? '#00E56B' : station.status === 'busy' ? '#EF9F27' : '#3A3A42';
              const fill = station.status === 'available' ? '#0A3D2C' : station.status === 'busy' ? '#3D2400' : '#151519';
              return (
                <div
                  key={station.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${left}%`, top: `${top}%` }}
                >
                  <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
                    <path
                      d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z"
                      fill={fill}
                      stroke={color}
                      strokeWidth="1.5"
                    />
                    <circle cx="14" cy="14" r="5" fill={color} />
                  </svg>
                </div>
              );
            })}
          </div>

          {/* Bottom pill */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <button
              onClick={() => navigate('/app/map')}
              className="px-4 py-2 bg-brand-tint border border-brand rounded-full text-[13px] font-medium text-brand hover:bg-brand-hover/10 transition-colors"
            >
              {availableCount} stations available near you
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="relative z-10 bg-bg-base py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="section-header mb-4">Reliability</div>
        <h2 className="text-[22px] font-medium text-text-primary tracking-tight mb-4">
          What happens if something goes wrong?
        </h2>
        <p className="text-[14px] text-text-secondary leading-relaxed max-w-xl mb-8">
          Every Volta station is monitored in real time. If a connector fails mid-session, billing stops automatically and you aren't charged for interrupted time. Our team responds within 15 minutes during operating hours.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          {['24/7 monitoring', 'Auto billing stop on fault', '<15 min response time'].map(tag => (
            <span key={tag} className="px-3 py-1.5 bg-surface border border-border-subtle rounded text-[12px] text-text-secondary">
              {tag}
            </span>
          ))}
        </div>

        <a href="#" className="text-[13px] text-brand hover:text-brand-hover transition-colors inline-flex items-center gap-1">
          Contact support →
        </a>
      </div>
    </section>
  );
}

function CTAFooter() {
  const navigate = useNavigate();

  return (
    <section className="relative z-10 bg-surface border-t border-border-subtle">
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-[22px] font-medium text-text-primary tracking-tight mb-2">
          Ready to charge?
        </h2>
        <p className="text-[14px] text-text-secondary mb-8">
          No account required. Book under 60 seconds.
        </p>
        <button
          onClick={() => navigate('/app/map')}
          className="px-5 py-2.5 bg-brand text-brand-on rounded-lg text-[13px] font-medium hover:bg-brand-hover transition-colors mb-8"
        >
          Find a station
        </button>

        <div className="flex justify-center gap-4 mb-16">
          <div className="px-4 py-2 bg-surface-hover border border-border-subtle rounded-lg text-[12px] text-text-secondary flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm3.35-4.31c.34.27.59.69.59 1.19s-.22.9-.57 1.18l-2.29 1.32-2.5-2.5 2.5-2.5 2.27 1.31zM6.05 2.66l11.76 6.22-2.27 2.27L6.05 2.66z"/></svg>
            Google Play
          </div>
          <div className="px-4 py-2 bg-surface-hover border border-border-subtle rounded-lg text-[12px] text-text-secondary flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            App Store
          </div>
        </div>
      </div>

      <footer className="border-t border-border-subtle py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <VoltaLogo size={24} />
          <div className="flex items-center gap-6 text-[12px] text-text-tertiary">
            <a href="#" className="hover:text-text-secondary transition-colors">Terms</a>
            <a href="#" className="hover:text-text-secondary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-secondary transition-colors">Support</a>
            <span className="text-border-strong">|</span>
            <span className="cursor-pointer hover:text-text-secondary transition-colors">EN / FR / AR</span>
          </div>
        </div>
      </footer>
    </section>
  );
}

export default function Landing() {
  return (
    <div className="bg-bg-base min-h-screen">
      <Hero />
      <ProofBar />
      <HowItWorks />
      <MapPreview />
      <Trust />
      <CTAFooter />
    </div>
  );
}
