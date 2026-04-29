import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppState } from '@/hooks/useAppState';
import Landing from '@/pages/Landing';
import Onboarding from '@/pages/Onboarding';
import MapDiscovery from '@/pages/MapDiscovery';
import TimeSlot from '@/pages/TimeSlot';
import VehicleID from '@/pages/VehicleID';
import ForeignVehicle from '@/pages/ForeignVehicle';
import OTP from '@/pages/OTP';
import Summary from '@/pages/Summary';
import Payment from '@/pages/Payment';
import QRConfirmation from '@/pages/QRConfirmation';
import Handshake from '@/pages/Handshake';
import ActiveCharging from '@/pages/ActiveCharging';
import Receipt from '@/pages/Receipt';
import SoftConversion from '@/pages/SoftConversion';

function AppRoutes() {
  const { state } = useAppState();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/app"
        element={
          state.onboardingComplete ? (
            <Navigate to="/app/map" replace />
          ) : (
            <Onboarding />
          )
        }
      />
      <Route path="/app/onboarding" element={<Onboarding />} />
      <Route path="/app/map" element={<MapDiscovery />} />
      <Route path="/app/time-slot" element={<TimeSlot />} />
      <Route path="/app/vehicle" element={<VehicleID />} />
      <Route path="/app/foreign-vehicle" element={<ForeignVehicle />} />
      <Route path="/app/otp" element={<OTP />} />
      <Route path="/app/summary" element={<Summary />} />
      <Route path="/app/payment" element={<Payment />} />
      <Route path="/app/qr" element={<QRConfirmation />} />
      <Route path="/app/handshake" element={<Handshake />} />
      <Route path="/app/charging" element={<ActiveCharging />} />
      <Route path="/app/receipt" element={<Receipt />} />
      <Route path="/app/convert" element={<SoftConversion />} />
    </Routes>
  );
}

export default function App() {
  return <AppRoutes />;
}
