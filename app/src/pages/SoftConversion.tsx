import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoltaLogo } from '@/components/VoltaLogo';

export default function SoftConversion() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);

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

        {/* Signup options */}
        <div className="space-y-3 mb-6">
          <button className="w-full py-3 bg-white text-black rounded-lg text-[13px] font-medium flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.72 9.73c-.04-1.54.63-2.71 2.01-3.57-.77-1.1-1.93-1.7-3.45-1.8-1.44-.1-3.05.85-3.64.85-.63 0-2.05-.81-3.18-.81C6.43 4.43 3.5 6.9 3.5 10.38c0 1.06.19 2.15.57 3.27.51 1.51 2.35 5.21 4.28 5.15 1.02-.02 1.75-.74 3.08-.74 1.29 0 1.97.74 3.18.72 1.31-.03 2.2-1.2 3.02-2.41.95-1.39 1.34-2.74 1.37-2.81-.03-.01-2.64-1.02-2.68-3.83zM14.94 3.5c.72-.88 1.21-2.1 1.07-3.32-1.04.04-2.29.69-3.03 1.57-.67.78-1.25 2.03-1.09 3.24 1.15.09 2.33-.66 3.05-1.49z"/>
            </svg>
            Continue with Apple
          </button>
          <button className="w-full py-3 bg-surface border border-border-subtle text-text-primary rounded-lg text-[13px] font-medium flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          <button className="w-full py-3 bg-surface border border-border-subtle text-text-primary rounded-lg text-[13px] font-medium">
            Set a password
          </button>
        </div>

        {/* Book again */}
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
          onClick={() => navigate('/app/map')}
          className="w-full py-2 text-[13px] text-text-tertiary hover:text-text-secondary transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
