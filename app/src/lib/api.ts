import type { Station } from '@/types';
import type { SendOTPPayload, SendOTPResult, VerifyOTPPayload, VerifyOTPResult } from '@/types/autho';

// ── Stations ───────────────────────────────────────────────────────────────
export const stations: Station[] = [
  {
    id: 'lac1-a',
    name: 'Lac 1 — Zone A',
    connectors: 4,
    status: 'available',
    distance: '0.4 km',
    lat: 36.8313,
    lng: 10.2284,
    address: 'Lac 1, Tunis',
  },
  {
    id: 'jardins',
    name: 'Jardins de Carthage',
    connectors: 2,
    status: 'busy',
    distance: '1.2 km',
    lat: 36.8528,
    lng: 10.3232,
    address: 'Jardins de Carthage, Tunis',
  },
  {
    id: 'berges',
    name: 'Berges du Lac East',
    connectors: 4,
    status: 'available',
    distance: '2.6 km',
    lat: 36.8350,
    lng: 10.2750,
    address: 'Berges du Lac, Tunis',
  },
  {
    id: 'marsa',
    name: 'La Marsa — Hub 2',
    connectors: 2,
    status: 'available',
    distance: '3.0 km',
    lat: 36.8763,
    lng: 10.3240,
    address: 'La Marsa, Tunis',
  },
  {
    id: 'downtown',
    name: 'Downtown — Connector Bay',
    connectors: 3,
    status: 'offline',
    distance: '5.0 km',
    lat: 36.8008,
    lng: 10.1802,
    address: 'Downtown Tunis',
  },
];

export function getStations(): Promise<Station[]> {
  return new Promise(resolve => {
    setTimeout(() => resolve([...stations]), 300);
  });
}

// ── OTP ────────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { ...data, _status: res.status } as T;
}

export async function sendOTP(payload: SendOTPPayload): Promise<SendOTPResult> {
  return post<SendOTPResult>('/api/auth/send-otp', payload);
}

export async function verifyOTP(payload: VerifyOTPPayload): Promise<VerifyOTPResult> {
  return post<VerifyOTPResult>('/api/auth/verify-otp', payload);
}