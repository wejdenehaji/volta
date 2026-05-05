import { useEffect } from 'react';
import { ArrowLeft, Loader2, Zap, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Navigate } from 'react-router-dom';

export default function SignIn() {
  const navigate = useNavigate();
  const { authenticated, loading, login } = useAuth();

  // If already authenticated, redirect immediately
  // Show nothing while Keycloak is checking
if (loading) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-base)',
    }}>
      <p style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>Loading...</p>
    </div>
  );
}

// Already logged in — go to map
if (authenticated) {
  return <Navigate to="/app/map" replace />;
}

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate(-1)}
          style={{ gap: 6, marginBottom: 40 }}
        >
          <ArrowLeft size={15} /> Back
        </button>

        <div style={{ marginBottom: 32 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'var(--green-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <Zap size={20} color="var(--green)" fill="var(--green)" />
          </div>
          <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 600 }}>
            Secure Sign In
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--text-tertiary)' }}>
            We use Keycloak to keep your EV journey secure.
          </p>
        </div>

        <div className="card-elevated" style={{ padding: '32px', textAlign: 'center' }}>
          <ShieldCheck
            size={48}
            color="var(--green)"
            style={{ margin: '0 auto 20px', opacity: 0.8 }}
          />

          <p style={{ fontSize: 14, marginBottom: 24, color: 'var(--text-secondary)' }}>
            Click below to sign in via our secure authentication portal.
          </p>

          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            onClick={login}
            disabled={loading}
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Connecting...</>
            ) : (
              'Sign in with Keycloak'
            )}
          </button>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: 24,
          fontSize: 12,
          color: 'var(--text-tertiary)',
        }}>
          <button
  className="btn btn-ghost btn-sm"
  onClick={() => {
    sessionStorage.setItem('guest', 'true');
    navigate('/app/map');
  }}
>
  continue without account →
</button>
        </div>

      </div>
    </div>
  );
}