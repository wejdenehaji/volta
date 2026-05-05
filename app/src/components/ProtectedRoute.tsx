import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { authenticated, loading } = useAuth();
  const isGuest = sessionStorage.getItem('guest') === 'true';

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
      }}>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>
          Loading...
        </p>
      </div>
    );
  }

  if (!authenticated && !isGuest) {
    return <Navigate to="/app/signin" replace />;
  }

  return <>{children}</>;
}