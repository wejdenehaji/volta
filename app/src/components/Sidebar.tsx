import { NavLink, useLocation } from 'react-router-dom';
import {
  MapPin, Zap, Clock, Receipt, Settings, ChevronRight,
  Circle, LayoutDashboard
} from 'lucide-react';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const primaryNav: NavItem[] = [
  { to: '/app/map', icon: <MapPin size={16} />, label: 'Find a station' },
  { to: '/app/charging', icon: <Zap size={16} />, label: 'Active session' },
  { to: '/app/history', icon: <Clock size={16} />, label: 'History' },
  { to: '/app/receipts', icon: <Receipt size={16} />, label: 'Receipts' },
];

function VoltaLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '24px 20px 20px' }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        border: '2px solid var(--green)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--green)',
        }} />
      </div>
      <div>
        <div style={{
          fontFamily: 'Fraunces, Georgia, serif',
          fontWeight: 300,
          fontSize: 16,
          letterSpacing: '0.12em',
          color: 'var(--text-primary)',
          lineHeight: 1,
        }}>VOLTA</div>
        <div style={{
          fontSize: 9,
          letterSpacing: '0.2em',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          fontWeight: 500,
          marginTop: 2,
        }}>CHARGE</div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar" style={{ padding: '0 12px 24px' }}>
      <VoltaLogo />

      <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0 4px 16px' }} />

      <div className="section-label" style={{ marginBottom: 8 }}>Navigation</div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {primaryNav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span style={{ flex: 1 }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      <div style={{ height: 1, background: 'var(--border-subtle)', margin: '16px 4px' }} />

      {/* Status indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px',
        background: 'var(--green-muted)',
        border: '1px solid #00c85325',
        borderRadius: 10,
        marginBottom: 12,
      }}>
        <Circle size={8} fill="var(--green)" color="var(--green)" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--green)' }}>Network online</div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>47 stations · 99.1% uptime</div>
        </div>
      </div>

      <NavLink
        to="/settings"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <Settings size={16} />
        Settings
      </NavLink>
    </aside>
  );
}