import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

export interface ReservationData {
  station: {
    id: string;
    name: string;
    address: string;
    connectors: number;
    status: string;
  } | null;
  date: string;
  timeSlot: string;
  duration: string;
  estimatedKwh: string;
  estimatedCost: string;
  connectorType: string;
  vehiclePlate: string;
  vehicleBrand: string;
  userEmail: string;
  userPhone: string;
  paymentMethod: string;
}

const defaultReservation: ReservationData = {
  station: null,
  date: '',
  timeSlot: '',
  duration: '1h',
  estimatedKwh: '',
  estimatedCost: '',
  connectorType: 'Type 2',
  vehiclePlate: '',
  vehicleBrand: '',
  userEmail: '',
  userPhone: '',
  paymentMethod: 'Visa •••• 4821',
};

interface ReservationContextType {
  reservation: ReservationData;
  update: (partial: Partial<ReservationData>) => void;
  reset: () => void;
}

const ReservationContext = createContext<ReservationContextType>({
  reservation: defaultReservation,
  update: () => {},
  reset: () => {},
});

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [reservation, setReservation] = useState<ReservationData>(() => {
    try {
      const saved = sessionStorage.getItem('volta-reservation');
      return saved ? { ...defaultReservation, ...JSON.parse(saved) } : defaultReservation;
    } catch {
      return defaultReservation;
    }
  });

  const update = useCallback((partial: Partial<ReservationData>) => {
    setReservation(prev => {
      const next = { ...prev, ...partial };
      try { sessionStorage.setItem('volta-reservation', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setReservation(defaultReservation);
    try { sessionStorage.removeItem('volta-reservation'); } catch {}
  }, []);

  return (
    <ReservationContext.Provider value={{ reservation, update, reset }}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservation() {
  return useContext(ReservationContext);
}