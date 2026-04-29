export interface Station {
  id: string;
  name: string;
  distance?: string;
  connectors: number;
  status: 'available' | 'busy' | 'offline' | 'maintenance';
  lat: number;
  lng: number;
  address?: string;
}

export interface TimeSlot {
  time: string;
  status: 'available' | 'taken' | 'selected';
}

export interface Reservation {
  stationId: string;
  stationName: string;
  connector: string;
  date: string;
  timeSlot: string;
  duration: string;
  vehiclePlate: string;
  vehicleBrand?: string;
  otpPhone: string;
  paymentMethod: string;
  preAuthAmount: number;
  rate: number;
  estimatedKwh: string;
}

export interface Session {
  id: string;
  stationName: string;
  connector: string;
  vehiclePlate: string;
  startTime: string;
  endTime?: string;
  kwhDelivered: number;
  duration: string;
  cost: number;
  preAuthAmount: number;
}

export type AppScreen = 
  | 'landing'
  | 'onboarding-1' | 'onboarding-2' | 'onboarding-3'
  | 'map'
  | 'time-slot'
  | 'vehicle-id'
  | 'foreign-vehicle'
  | 'otp'
  | 'summary'
  | 'payment'
  | 'qr-confirmation'
  | 'handshake'
  | 'active-charging'
  | 'receipt'
  | 'soft-conversion'
  | 'profile'
  | 'signin';
