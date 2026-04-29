import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoltaLogo } from '@/components/VoltaLogo';
import { stations as allStations } from '@/lib/api';
import type { Station } from '@/types';

export default function MapDiscovery() {
  const navigate = useNavigate();
  const [stations] = useState<Station[]>(allStations);
  const [searchQuery, setSearchQuery] = useState('');
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return stations;
    return stations.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [stations, searchQuery]);

  const availableCount = stations.filter(s => s.status === 'available').length;

  return (
    <div className="w-full max-w-[390px] mx-auto bg-bg-base min-h-[100dvh] relative overflow-hidden">
      {/* Map area */}
      <div className="absolute inset-0 bg-[#111115]">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute border-border-subtle/30" style={{ left: `${i * 5}%`, top: 0, bottom: 0, borderLeft: '1px solid' }} />
          ))}
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="absolute border-border-subtle/30" style={{ top: `${i * 6.25}%`, left: 0, right: 0, borderTop: '1px solid' }} />
          ))}
        </div>

        {/* Station pins */}
        {stations.map((station, i) => {
          const left = 20 + (i * 15) % 70;
          const top = 25 + (i * 23) % 55;
          const color = station.status === 'available' ? '#00E56B' : station.status === 'busy' ? '#EF9F27' : '#3A3A42';
          const fill = station.status === 'available' ? '#0A3D2C' : station.status === 'busy' ? '#3D2400' : '#151519';
          const isSelected = selectedStation?.id === station.id;
          return (
            <button
              key={station.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ${isSelected ? 'scale-125' : ''} ${station.status === 'available' ? 'animate-pin-pulse' : ''}`}
              style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${i * 40}ms` }}
              onClick={() => setSelectedStation(station)}
            >
              <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
                <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z" fill={fill} stroke={color} strokeWidth="1.5" />
                <circle cx="14" cy="14" r="5" fill={color} />
              </svg>
            </button>
          );
        })}
      </div>

      {/* Top nav overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4 pb-2">
        <VoltaLogo size={24} />
        <button className="w-8 h-8 rounded-full bg-surface border border-border-subtle flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888790" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        </button>
      </div>

      {/* Bottom sheet */}
      <div
        ref={sheetRef}
        className={`absolute left-0 right-0 z-30 bg-surface rounded-t-[20px] border-t border-border-subtle transition-transform duration-300 ease-out ${
          sheetExpanded ? 'top-[15%]' : 'top-[60%]'
        }`}
        style={{ transform: 'translateZ(0)' }}
      >
        {/* Handle bar */}
        <button
          className="w-full flex justify-center pt-3 pb-2"
          onClick={() => setSheetExpanded(!sheetExpanded)}
        >
          <div className="w-9 h-1 bg-border-subtle rounded-full" />
        </button>

        <div className="px-4 pb-6">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2.5 bg-bg-base border border-border-subtle rounded-lg mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555560" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search stations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-[13px] text-text-primary placeholder:text-text-tertiary outline-none"
            />
          </div>

          {/* Available pill */}
          <div className="mb-3">
            <span className="inline-flex items-center px-3 py-1 bg-brand-tint border border-brand rounded-full text-[11px] font-medium text-brand">
              {availableCount} stations available near you
            </span>
          </div>

          {/* Station list */}
          <div className="space-y-2 max-h-[50vh] overflow-y-auto no-scrollbar">
            {filtered.map((station, i) => (
              <button
                key={station.id}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                  selectedStation?.id === station.id
                    ? 'bg-brand-tint border-brand'
                    : 'bg-bg-base border-border-subtle hover:border-border-strong'
                }`}
                onClick={() => {
                  setSelectedStation(station);
                  // Navigate to time slot after brief delay
                  setTimeout(() => navigate('/app/time-slot'), 200);
                }}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex-shrink-0">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      station.status === 'available'
                        ? 'bg-brand'
                        : station.status === 'busy'
                        ? 'bg-warning'
                        : 'bg-border-strong'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-text-primary truncate">{station.name}</div>
                  <div className="text-[10px] text-text-secondary">
                    {station.connectors} connectors · {station.distance}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {station.status === 'available' ? (
                    <span className="text-[11px] text-brand">Now +8 min</span>
                  ) : station.status === 'offline' ? (
                    <span className="text-[11px] text-text-tertiary">Offline</span>
                  ) : (
                    <span className="text-[11px] text-warning">Now +8 min</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
