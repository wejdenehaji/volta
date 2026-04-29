import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoltaArc } from '@/components/VoltaArc';

export default function Payment() {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(131);
  const [processing, setProcessing] = useState(false);
  const [arcProgress, setArcProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePay = () => {
    setProcessing(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setArcProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setArcProgress(60); // bounce back to 3/5
          setTimeout(() => navigate('/app/qr'), 600);
        }, 400);
      }
    }, 50);
  };

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <div className="w-full max-w-[390px] mx-auto bg-bg-base min-h-[100dvh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={() => navigate('/app/summary')} className="p-2 -ml-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EAEAEA" strokeWidth="1.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-[17px] font-medium text-text-primary">Payment</h1>
        <div className="font-mono text-[13px] font-medium text-warning">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="flex-1 px-4 pb-4">
        {processing ? (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <VoltaArc size={120} progress={arcProgress} animated />
            <p className="mt-6 text-[14px] text-text-secondary">Processing payment...</p>
          </div>
        ) : (
          <>
            {/* Pre-auth amount */}
            <div className="text-center py-8 mb-6">
              <div className="text-[11px] text-text-tertiary uppercase tracking-wide mb-2">Pre-authorization amount</div>
              <div className="font-mono text-[36px] font-medium text-text-primary">6.30 DT</div>
              <div className="text-[12px] text-text-secondary mt-1">Only charged based on actual kWh used</div>
            </div>

            {/* Apple Pay */}
            <button className="w-full py-3 bg-white text-black rounded-lg text-[13px] font-medium mb-3 flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.72 9.73c-.04-1.54.63-2.71 2.01-3.57-.77-1.1-1.93-1.7-3.45-1.8-1.44-.1-3.05.85-3.64.85-.63 0-2.05-.81-3.18-.81C6.43 4.43 3.5 6.9 3.5 10.38c0 1.06.19 2.15.57 3.27.51 1.51 2.35 5.21 4.28 5.15 1.02-.02 1.75-.74 3.08-.74 1.29 0 1.97.74 3.18.72 1.31-.03 2.2-1.2 3.02-2.41.95-1.39 1.34-2.74 1.37-2.81-.03-.01-2.64-1.02-2.68-3.83zM14.94 3.5c.72-.88 1.21-2.1 1.07-3.32-1.04.04-2.29.69-3.03 1.57-.67.78-1.25 2.03-1.09 3.24 1.15.09 2.33-.66 3.05-1.49z"/>
              </svg>
              Pay with Apple Pay
            </button>

            {/* Google Pay */}
            <button className="w-full py-3 bg-surface border border-border-subtle text-text-primary rounded-lg text-[13px] font-medium mb-3 flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Pay with Google Pay
            </button>

            {/* Saved card */}
            <div className="flex items-center justify-between p-4 bg-surface border border-border-subtle rounded-xl mb-3">
              <div className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888790" strokeWidth="1.5">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 10h20" />
                </svg>
                <span className="text-[13px] text-text-primary">Visa •••• 4821</span>
              </div>
              <span className="text-[11px] text-brand">Change</span>
            </div>

            {/* Add card */}
            <button className="w-full py-3 text-[13px] text-brand hover:text-brand-hover transition-colors mb-6">
              + Add new card
            </button>
          </>
        )}
      </div>

      {!processing && (
        <div className="px-4 pb-6 pt-2 bg-bg-base border-t border-border-subtle">
          <button
            onClick={handlePay}
            className="w-full py-3 bg-brand text-brand-on rounded-lg text-[13px] font-medium hover:bg-brand-hover transition-colors"
          >
            Pay and confirm reservation
          </button>
        </div>
      )}
    </div>
  );
}
