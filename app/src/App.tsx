import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAppState } from '@/hooks/useAppState';
import "leaflet/dist/leaflet.css";
import { ReservationProvider } from '@/context/ReservationContext';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
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
import SignIn from '@/pages/SignIn';

// Pages that show the sidebar
function AppLayout() {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'var(--bg-base)',
      overflow: 'hidden',
    }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}

function AppRoutes() {
  const { state } = useAppState();

  return (
    <Routes>
      {/* ── No sidebar ── */}
      <Route path="/" element={<Landing />} />
      <Route path="/app/signin" element={<SignIn />} />
      <Route
        path="/app"
        element={
          state.onboardingComplete
            ? <Navigate to="/app/map" replace />
            : <Onboarding />
        }
      />
      <Route path="/app/onboarding" element={<Onboarding />} />

      {/* ── With sidebar ── */}
      <Route element={<AppLayout />}>
        {/* Protected — requires Keycloak login */}
        <Route
          path="/app/map"
          element={
            <ProtectedRoute>
              <MapDiscovery />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/time-slot"
          element={
            <ProtectedRoute>
              <TimeSlot />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/vehicle"
          element={
            <ProtectedRoute>
              <VehicleID />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/foreign-vehicle"
          element={
            <ProtectedRoute>
              <ForeignVehicle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/otp"
          element={
            <ProtectedRoute>
              <OTP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/summary"
          element={
            <ProtectedRoute>
              <Summary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/qr"
          element={
            <ProtectedRoute>
              <QRConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/handshake"
          element={
            <ProtectedRoute>
              <Handshake />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/charging"
          element={
            <ProtectedRoute>
              <ActiveCharging />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/receipt"
          element={
            <ProtectedRoute>
              <Receipt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/convert"
          element={
            <ProtectedRoute>
              <SoftConversion />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ReservationProvider>
      <AppRoutes />
    </ReservationProvider>
  );
}