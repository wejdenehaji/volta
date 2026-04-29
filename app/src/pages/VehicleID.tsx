import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const plateTabs = ['TUN', 'RS', 'PE', 'DIP'];

export default function VehicleID() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('TUN');
  const [plateNumber, setPlateNumber] = useState('');
  const [chassis, setChassis] = useState('');
  const [vehicleConfirmed, setVehicleConfirmed] = useState(false);
  const [timer, setTimer] = useState(201);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (plateNumber.length >= 5) {
      const t = setTimeout(() => setVehicleConfirmed(true), 600);
      return () => clearTimeout(t);
    } else {
      setVehicleConfirmed(false);
    }
  }, [plateNumber]);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const timerColor = timer < 30 ? 'text-error' : 'text-warning';

  const handlePlateChange = (val: string) => {
    const cleaned = val.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
    setPlateNumber(cleaned);
  };

  return (
    <div className="w-full max-w-[390px] mx-auto bg-bg-base min-h-[100dvh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={() => navigate('/app/time-slot')} className="p-2 -ml-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EAEAEA" strokeWidth="1.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-[17px] font-medium text-text-primary">Identify your vehicle</h1>
        <div className={`font-mono text-[13px] font-medium ${timerColor}`}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4">
        {/* Plate tabs */}
        <div className="flex gap-2 mb-4">
          {plateTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-colors ${
                activeTab === tab
                  ? 'bg-brand-tint border-brand text-brand'
                  : 'bg-surface border-border-subtle text-text-secondary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Plate input */}
        <div className="mb-4">
          <label className="text-[11px] text-text-tertiary uppercase tracking-wide mb-2 block">Plate number</label>
          <div className="flex items-center gap-2 px-3 py-3 bg-surface border border-border-subtle rounded-xl">
            <input
              ref={inputRef}
              type="text"
              value={plateNumber}
              onChange={e => handlePlateChange(e.target.value)}
              placeholder="183 TN 24"
              className="flex-1 bg-transparent font-mono text-[16px] font-medium tracking-[0.08em] text-text-primary placeholder:text-text-tertiary outline-none uppercase"
              style={{ letterSpacing: '0.08em' }}
            />
            <button className="p-1.5 text-text-tertiary hover:text-text-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="7" width="18" height="12" rx="2" />
                <circle cx="12" cy="13" r="3" />
                <path d="M17 7v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Vehicle confirmed card */}
        {vehicleConfirmed && (
          <div className="p-4 bg-brand-tint border border-brand rounded-xl mb-4 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#001A0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div>
                <div className="text-[13px] font-medium text-brand">Vehicle confirmed</div>
                <div className="text-[11px] text-text-secondary">183 · TN · 24 — Tesla Model 3</div>
              </div>
            </div>
          </div>
        )}

        {/* Chassis input */}
        <div className="mb-4">
          <label className="text-[11px] text-text-tertiary uppercase tracking-wide mb-2 block">Chassis number</label>
          <div className="px-3 py-3 bg-surface border border-border-subtle rounded-xl">
            <input
              type="text"
              value={chassis}
              onChange={e => setChassis(e.target.value.toUpperCase())}
              placeholder="......"
              className="w-full bg-transparent font-mono text-[16px] font-medium tracking-[0.08em] text-text-primary placeholder:text-text-tertiary outline-none"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-border-subtle" />
          <span className="text-[11px] text-text-tertiary">or</span>
          <div className="flex-1 h-px bg-border-subtle" />
        </div>

        {/* Foreign vehicle link */}
        <button
          onClick={() => navigate('/app/foreign-vehicle')}
          className="w-full text-center text-[13px] text-brand hover:text-brand-hover transition-colors mb-6"
        >
          Using a foreign vehicle? Tap here →
        </button>
      </div>

      {/* CTA */}
      <div className="px-4 pb-6 pt-2 bg-bg-base border-t border-border-subtle">
        <button
          onClick={() => navigate('/app/otp')}
          className="w-full py-3 bg-brand text-brand-on rounded-lg text-[13px] font-medium hover:bg-brand-hover transition-colors"
        >
          Continue
        </button>
        <button
          onClick={() => navigate('/app/signin')}
          className="w-full mt-3 text-[12px] text-text-tertiary hover:text-text-secondary transition-colors"
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  );
}
