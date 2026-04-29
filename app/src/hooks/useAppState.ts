import { useState, useEffect, useCallback } from 'react';
import type { AppScreen, Reservation, Station } from '@/types';

interface AppState {
  screen: AppScreen;
  onboardingComplete: boolean;
  selectedStation: Station | null;
  reservation: Partial<Reservation> | null;
  sessionId: string | null;
  otpCode: string | null;
  otpPhone: string;
  vehiclePlate: string;
  vehicleBrand: string;
  otpSent: boolean;
  foreignVehicle: boolean;
  locationAllowed: boolean;
  timerSeconds: number;
  chargePercent: number;
  kwhDelivered: number;
  elapsedMinutes: number;
  costSoFar: number;
}

const STORAGE_KEY = 'volta-charge-state';

const defaultState: AppState = {
  screen: 'landing',
  onboardingComplete: false,
  selectedStation: null,
  reservation: null,
  sessionId: null,
  otpCode: null,
  otpPhone: '+216 •• •• •• 47',
  vehiclePlate: '',
  vehicleBrand: '',
  otpSent: false,
  foreignVehicle: false,
  locationAllowed: false,
  timerSeconds: 240,
  chargePercent: 72,
  kwhDelivered: 14.3,
  elapsedMinutes: 34,
  costSoFar: 2.57,
};

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultState, ...parsed };
    }
  } catch {}
  return { ...defaultState };
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function useAppState() {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const navigate = useCallback((screen: AppScreen) => {
    setState(prev => ({ ...prev, screen }));
  }, []);

  const setOnboardingComplete = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, onboardingComplete: value }));
  }, []);

  const selectStation = useCallback((station: Station | null) => {
    setState(prev => ({ ...prev, selectedStation: station }));
  }, []);

  const setReservation = useCallback((reservation: Partial<Reservation> | null) => {
    setState(prev => ({ ...prev, reservation }));
  }, []);

  const setVehiclePlate = useCallback((plate: string) => {
    setState(prev => ({ ...prev, vehiclePlate: plate }));
  }, []);

  const setVehicleBrand = useCallback((brand: string) => {
    setState(prev => ({ ...prev, vehicleBrand: brand }));
  }, []);

  const setOtpSent = useCallback((sent: boolean) => {
    setState(prev => ({ ...prev, otpSent: sent }));
  }, []);

  const setForeignVehicle = useCallback((foreign: boolean) => {
    setState(prev => ({ ...prev, foreignVehicle: foreign }));
  }, []);

  const setLocationAllowed = useCallback((allowed: boolean) => {
    setState(prev => ({ ...prev, locationAllowed: allowed }));
  }, []);

  const resetApp = useCallback(() => {
    setState({ ...defaultState, onboardingComplete: state.onboardingComplete });
  }, [state.onboardingComplete]);

  return {
    state,
    navigate,
    setOnboardingComplete,
    selectStation,
    setReservation,
    setVehiclePlate,
    setVehicleBrand,
    setOtpSent,
    setForeignVehicle,
    setLocationAllowed,
    resetApp,
  };
}
