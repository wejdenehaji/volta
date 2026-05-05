import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Check, AlertCircle, Car, ChevronRight, Camera,Loader2 } from 'lucide-react';
import { useReservation } from '../context/ReservationContext';
import BookingStepper from '../components/BookingStepper';

const plateTabs = ['TUN', 'RS', 'PE', 'DIP'];


export default function VehicleID() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
const [isScanning, setIsScanning] = useState(false); // New: to show loading
  const { reservation, update } = useReservation();
  const [activeTab, setActiveTab] = useState('TUN');
  const [plateNumber, setPlateNumber] = useState(reservation.vehiclePlate || '');
  const [chassis, setChassis] = useState('');
  const [vehicleConfirmed, setVehicleConfirmed] = useState(false);
  const [plateError, setPlateError] = useState('');
  const [timer, setTimer] = useState(201);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!reservation.station) navigate('/app/map');
  }, [reservation.station, navigate]);

  useEffect(() => {
    const iv = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (plateNumber.length >= 5) {
      const t = setTimeout(() => {
        setVehicleConfirmed(true);
        setPlateError('');
      }, 600);
      return () => clearTimeout(t);
    } else {
      setVehicleConfirmed(false);
    }
  }, [plateNumber]);

  const handlePlateChange = (val: string) => {
    const cleaned = val.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
    setPlateNumber(cleaned);
    setPlateError('');
  };
const handleOCR = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  setIsScanning(true);
  setPlateError('Scanning document...');

  const formData = new FormData();
  formData.append('document', file);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ocr/scan-carte-grise`, {
      method: 'POST',
      body: formData,
      // Note: Don't set Content-Type header when sending FormData; 
      // the browser will set it automatically with the boundary.
    });
    
    const data = await response.json();
    
    if (data.success) {
      setPlateNumber(data.plate || '');
      setChassis(data.chassis || '');
      setPlateError('');
    } else {
      setPlateError('Could not read document. Please enter manually.');
    }
  } catch (err) {
    setPlateError('OCR Service unavailable.');
  } finally {
    setIsScanning(false);
  }
};
  const handleContinue = () => {
    if (plateNumber.length < 4) {
      setPlateError('Please enter a valid plate number (at least 4 characters)');
      inputRef.current?.focus();
      return;
    }
    update({ vehiclePlate: plateNumber, vehicleBrand: vehicleConfirmed ? 'Tesla Model 3' : '' });
    navigate('/app/otp');
  };

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const timerCritical = timer < 30;

  return (
    <div className="page-container" style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/time-slot')} style={{ gap: 6 }}>
          <ArrowLeft size={15} />
          Back
        </button>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 14px',
          background: timerCritical ? 'var(--error-tint)' : 'var(--surface-2)',
          border: `1px solid ${timerCritical ? 'var(--error)' : 'var(--border-default)'}`,
          borderRadius: 100,
        }}>
          <Clock size={13} color={timerCritical ? 'var(--error)' : 'var(--text-tertiary)'} />
          <span style={{
            fontFamily: 'DM Mono, monospace', fontSize: 13, fontWeight: 500,
            color: timerCritical ? 'var(--error)' : 'var(--text-secondary)',
          }}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      <BookingStepper currentPath="/app/vehicle" />

      <div className="page-header">
        <h1>Identify your vehicle</h1>
        <p>Enter your plate number so we can verify your vehicle</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>
        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Plate type tabs */}
          <div>
            <label className="field-label">Plate type</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {plateTabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 20px', borderRadius: 8,
                    fontSize: 13, fontWeight: 500,
                    border: `1px solid ${activeTab === tab ? 'var(--green)' : 'var(--border-default)'}`,
                    background: activeTab === tab ? 'var(--green-muted)' : 'var(--surface-2)',
                    color: activeTab === tab ? 'var(--green)' : 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'all 120ms',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Plate input */}
          <div>
            <label className="field-label">Plate number</label>
            <div style={{ position: 'relative' }}>
              <div style={{
                display: 'flex', alignItems: 'center',
                padding: '12px 16px',
                background: 'var(--surface-2)',
                border: `1px solid ${plateError ? 'var(--error)' : vehicleConfirmed ? 'var(--green)' : 'var(--border-default)'}`,
                borderRadius: 10,
                gap: 12,
                transition: 'border-color 150ms',
                boxShadow: vehicleConfirmed ? '0 0 0 3px var(--green-tint)' : plateError ? '0 0 0 3px var(--error-tint)' : 'none',
              }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={plateNumber}
                  onChange={e => handlePlateChange(e.target.value)}
                  placeholder="183 TN 24"
                  style={{
                    flex: 1, background: 'none', border: 'none', outline: 'none',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: 18, fontWeight: 500,
                    letterSpacing: '0.1em',
                    color: 'var(--text-primary)',
                  }}
                />
                
                <button 
  type="button"
  onClick={() => fileInputRef.current?.click()}
  disabled={isScanning}
  style={{
    background: 'none', border: 'none', cursor: isScanning ? 'wait' : 'pointer',
    color: isScanning ? 'var(--green)' : 'var(--text-tertiary)', 
    padding: 4, borderRadius: 6,
    display: 'flex', alignItems: 'center',
    opacity: isScanning ? 0.6 : 1
  }}
>
  {/* Show a spinner if scanning, otherwise the camera icon */}
  {isScanning ? (
    <Loader2 size={18} className="animate-spin" />
  ) : (
    <Camera size={18} />
  )}

  {/* Hidden input field */}
  <input 
    type="file" 
    ref={fileInputRef} 
    onChange={handleOCR} 
    accept="image/*" 
    hidden 
    capture="environment" 
  />
</button>
                {vehicleConfirmed && (
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'var(--green)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Check size={13} color="#001a0d" strokeWidth={3} />
                  </div>
                )}
              </div>
            </div>

            {plateError && (
              <div className="field-error">
                <AlertCircle size={12} />
                {plateError}
              </div>
            )}

            {vehicleConfirmed && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                marginTop: 10,
                padding: '10px 14px',
                background: 'var(--green-tint)',
                border: '1px solid #00c85325',
                borderRadius: 8,
              }} className="animate-fade-in">
                <Car size={15} color="var(--green)" />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--green)' }}>Vehicle confirmed</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                    {plateNumber} — Tesla Model 3 (estimated)
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chassis (optional) */}
          <div>
            <label className="field-label">
              Chassis number <span style={{ color: 'var(--text-disabled)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
            </label>
            <input
              type="text"
              className="field-input"
              value={chassis}
              onChange={e => setChassis(e.target.value.toUpperCase())}
              placeholder="VF1RFD..."
              style={{ fontFamily: 'DM Mono, monospace', letterSpacing: '0.05em', fontSize: 13 }}
            />
            <div className="field-hint">Required if plate lookup fails</div>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="divider" style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>or</span>
            <div className="divider" style={{ flex: 1 }} />
          </div>

          <button
            className="btn btn-ghost"
            style={{ justifyContent: 'flex-start', gap: 8, color: 'var(--green)', fontSize: 13 }}
            onClick={() => navigate('/app/foreign-vehicle')}
          >
            Using a foreign-registered vehicle? →
          </button>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary btn-lg" onClick={handleContinue} style={{ flex: 1 }}>
              Continue to verification
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--text-tertiary)', alignSelf: 'center' }}
            onClick={() => navigate('/app/signin')}
          >
            Already have an account? Sign in
          </button>
        </div>

        {/* Right: booking summary */}
        <div className="card-elevated" style={{ padding: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
            Your booking
          </div>
          {[
            { label: 'Station', value: reservation.station?.name || '—' },
            { label: 'Date', value: reservation.date || '—' },
            { label: 'Time', value: reservation.timeSlot || '—' },
            { label: 'Duration', value: reservation.duration || '—' },
            { label: 'Est. cost', value: reservation.estimatedCost ? `~${reservation.estimatedCost} DT` : '—' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'baseline' }}>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right', maxWidth: '55%' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}