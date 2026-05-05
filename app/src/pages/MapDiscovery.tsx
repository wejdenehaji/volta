import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Filter, Zap, Clock, MapPin, ChevronRight, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { stations } from '../lib/api';
import type { Station } from '../types';
import { useReservation } from '../context/ReservationContext';

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createStationIcon(status: Station['status']) {
  const color = status === 'available' ? '#00c853' : status === 'busy' ? '#f59e0b' : '#505050';
  const svgStr = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.3 21.7 0 14 0z"
        fill="${color}" opacity="0.9"/>
      <circle cx="14" cy="14" r="6" fill="white" opacity="0.95"/>
      <circle cx="14" cy="14" r="3" fill="${color}"/>
    </svg>`;
  return L.divIcon({
    html: svgStr,
    className: '',
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -38],
  });
}

const STATUS_CONFIG = {
  available: { label: 'Available', color: 'var(--green)', badge: 'badge-green' },
  busy: { label: 'Busy', color: '#f59e0b', badge: 'badge-amber' },
  offline: { label: 'Offline', color: 'var(--text-tertiary)', badge: 'badge-gray' },
  maintenance: { label: 'Maintenance', color: '#f59e0b', badge: 'badge-amber' },
};

function StationCard({ station, onSelect, selected }: {
  station: Station;
  onSelect: (s: Station) => void;
  selected: boolean;
}) {
  const cfg = STATUS_CONFIG[station.status];
  return (
    <button
      onClick={() => onSelect(station)}
      style={{
        width: '100%',
        background: selected ? 'var(--green-muted)' : 'var(--surface-1)',
        border: `1px solid ${selected ? 'var(--green)' : 'var(--border-subtle)'}`,
        borderRadius: 12,
        padding: '14px 16px',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 140ms',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
      onMouseEnter={e => {
        if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)';
      }}
      onMouseLeave={e => {
        if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-subtle)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>
            {station.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={11} />
            {station.address || station.name} · {station.distance}
          </div>
        </div>
        <span className={`badge ${cfg.badge}`}>
          {cfg.label}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)' }}>
          <Zap size={12} color="var(--green)" />
          {station.connectors} connectors
        </div>
        {station.status === 'available' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)' }}>
            <Clock size={12} />
            Next slot: Now
          </div>
        )}
      </div>
    </button>
  );
}

function MapFlyTo({ station }: { station: Station | null }) {
  const map = useMap();
  if (station) {
    map.flyTo([station.lat, station.lng], 14, { duration: 0.8 });
  }
  return null;
}

export default function MapDiscovery() {
  const navigate = useNavigate();
  const { update } = useReservation();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'available'>('all');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const filtered = useMemo(() => {
    let list = stations;
    if (filter === 'available') list = list.filter(s => s.status === 'available');
    if (search.trim()) list = list.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.address || '').toLowerCase().includes(search.toLowerCase())
    );
    return list;
  }, [search, filter]);

  const handleSelect = (station: Station) => {
    setSelectedStation(station);
  };

  const handleBook = () => {
    if (!selectedStation) return;
    update({
      station: {
        id: selectedStation.id,
        name: selectedStation.name,
        address: selectedStation.address || selectedStation.name,
        connectors: selectedStation.connectors,
        status: selectedStation.status,
      },
    });
    navigate('/app/time-slot');
  };

  const availableCount = stations.filter(s => s.status === 'available').length;

  return (
    <div style={{ display: 'flex', height: '100%', gap: 0 }}>
      {/* Left panel */}
      <div style={{
        width: 380,
        flexShrink: 0,
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{ margin: '0 0 4px', fontSize: 20 }}>Charging stations</h2>
          <p style={{ margin: 0, fontSize: 13 }}>{availableCount} available near you</p>

          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            marginTop: 16,
            padding: '9px 14px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border-default)',
            borderRadius: 9,
          }}>
            <Search size={15} color="var(--text-tertiary)" />
            <input
              type="text"
              placeholder="Search by name or area..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                fontSize: 13, color: 'var(--text-primary)',
                fontFamily: 'DM Sans, sans-serif',
              }}
            />
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {(['all', 'available'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '5px 14px',
                  borderRadius: 100,
                  fontSize: 12, fontWeight: 500,
                  border: `1px solid ${filter === f ? 'var(--green)' : 'var(--border-default)'}`,
                  background: filter === f ? 'var(--green-muted)' : 'var(--surface-2)',
                  color: filter === f ? 'var(--green)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 120ms',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {f === 'all' ? 'All stations' : 'Available only'}
              </button>
            ))}
          </div>
        </div>

        {/* Station list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }} className="no-scrollbar">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <MapPin size={32} />
              <h3>No stations found</h3>
              <p>Try adjusting your search or filter</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map(station => (
                <StationCard
                  key={station.id}
                  station={station}
                  onSelect={handleSelect}
                  selected={selectedStation?.id === station.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        {selectedStation && (
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--surface-0)',
          }} className="animate-fade-in">
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 10 }}>
              Selected: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{selectedStation.name}</span>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={handleBook}
              disabled={selectedStation.status === 'offline'}
            >
              <ChevronRight size={16} />
              Book this station
            </button>
            {selectedStation.status === 'offline' && (
              <p style={{ fontSize: 11, color: 'var(--error)', textAlign: 'center', margin: '8px 0 0' }}>
                This station is currently offline
              </p>
            )}
          </div>
        )}
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer
          center={[36.84, 10.26]}
          zoom={11}
          style={{ width: '100%', height: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          />
          <MapFlyTo station={selectedStation} />
          {stations.map(station => (
            <Marker
              key={station.id}
              position={[station.lat, station.lng]}
              icon={createStationIcon(station.status)}
              eventHandlers={{ click: () => handleSelect(station) }}
            >
              <Popup>
                <div style={{ minWidth: 200 }}>
                  <div style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 14, fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 6,
                  }}>
                    {station.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>
                    {station.address} · {station.distance}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <span className={`badge ${STATUS_CONFIG[station.status].badge}`} style={{ fontSize: 11 }}>
                      {STATUS_CONFIG[station.status].label}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Zap size={11} color="var(--green)" />
                      {station.connectors} connectors
                    </span>
                  </div>
                  <button
                    onClick={handleBook}
                    disabled={station.status === 'offline'}
                    style={{
                      width: '100%', padding: '8px 16px',
                      background: station.status === 'offline' ? 'var(--surface-3)' : 'var(--green)',
                      color: station.status === 'offline' ? 'var(--text-tertiary)' : '#001a0d',
                      border: 'none', borderRadius: 8,
                      fontSize: 13, fontWeight: 500,
                      cursor: station.status === 'offline' ? 'not-allowed' : 'pointer',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    {station.status === 'offline' ? 'Unavailable' : 'Book this station →'}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Map legend */}
        <div style={{
          position: 'absolute', bottom: 24, right: 16, zIndex: 1000,
          background: 'rgba(15,15,15,0.92)',
          border: '1px solid var(--border-default)',
          borderRadius: 10,
          padding: '10px 14px',
          backdropFilter: 'blur(8px)',
        }}>
          {[
            { color: '#00c853', label: 'Available' },
            { color: '#f59e0b', label: 'Busy' },
            { color: '#505050', label: 'Offline' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}