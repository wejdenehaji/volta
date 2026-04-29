import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForeignVehicle() {
  const navigate = useNavigate();
  const [brand, setBrand] = useState('');
  const [country, setCountry] = useState('');
  const [serial, setSerial] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [timer] = useState(194);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  const canSubmit = brand && country && phone;

  return (
    <div className="w-full max-w-[390px] mx-auto bg-bg-base min-h-[100dvh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={() => navigate('/app/vehicle')} className="p-2 -ml-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EAEAEA" strokeWidth="1.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-[17px] font-medium text-text-primary">Foreign vehicle</h1>
        <div className="font-mono text-[13px] font-medium text-warning">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4">
        {/* Warning banner */}
        <div className="p-3 bg-warning-tint border border-warning rounded-xl mb-4">
          <p className="text-[13px] text-warning leading-relaxed">
            Your vehicle isn't in our system. Fill in the details and an agent will validate your request.
          </p>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12 animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-brand-tint border border-brand flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00E56B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="text-[17px] font-medium text-text-primary mb-2">Request submitted</h2>
            <p className="text-[14px] text-text-secondary text-center">An agent will contact you within 15 minutes</p>
            <button
              onClick={() => navigate('/app/otp')}
              className="mt-6 px-5 py-2.5 bg-brand text-brand-on rounded-lg text-[13px] font-medium"
            >
              Continue to verification
            </button>
          </div>
        ) : (
          <>
            {/* Vehicle brand */}
            <div className="mb-4">
              <label className="text-[11px] text-text-tertiary uppercase tracking-wide mb-2 block">Vehicle brand</label>
              <div className="px-3 py-3 bg-surface border border-border-subtle rounded-xl">
                <input
                  type="text"
                  value={brand}
                  onChange={e => setBrand(e.target.value)}
                  placeholder="Mercedes, BMW, Audi..."
                  className="w-full bg-transparent text-[14px] text-text-primary placeholder:text-text-tertiary outline-none"
                />
              </div>
            </div>

            {/* Country */}
            <div className="mb-4">
              <label className="text-[11px] text-text-tertiary uppercase tracking-wide mb-2 block">Country of origin</label>
              <div className="px-3 py-3 bg-surface border border-border-subtle rounded-xl">
                <input
                  type="text"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder="France, Germany..."
                  className="w-full bg-transparent text-[14px] text-text-primary placeholder:text-text-tertiary outline-none"
                />
              </div>
            </div>

            {/* Serial number */}
            <div className="mb-4">
              <label className="text-[11px] text-text-tertiary uppercase tracking-wide mb-2 block">Serial number (optional)</label>
              <div className="px-3 py-3 bg-surface border border-border-subtle rounded-xl">
                <input
                  type="text"
                  value={serial}
                  onChange={e => setSerial(e.target.value)}
                  placeholder="VF1RFD..."
                  className="w-full bg-transparent text-[14px] text-text-primary placeholder:text-text-tertiary outline-none"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="mb-6">
              <label className="text-[11px] text-text-tertiary uppercase tracking-wide mb-2 block">Your phone number</label>
              <div className="px-3 py-3 bg-surface border border-border-subtle rounded-xl">
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+33 ..."
                  className="w-full bg-transparent text-[14px] text-text-primary placeholder:text-text-tertiary outline-none"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {!submitted && (
        <div className="px-4 pb-6 pt-2 bg-bg-base border-t border-border-subtle">
          <button
            disabled={!canSubmit}
            onClick={() => setSubmitted(true)}
            className={`w-full py-3 rounded-lg text-[13px] font-medium transition-colors ${
              canSubmit
                ? 'bg-brand text-brand-on hover:bg-brand-hover'
                : 'bg-surface text-text-disabled border border-border-subtle cursor-not-allowed'
            }`}
          >
            Submit for validation
          </button>
        </div>
      )}
    </div>
  );
}
