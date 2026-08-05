import React, { useState, useRef, useEffect } from 'react';
import { Station } from '../types';
import { Language, TRANSLATIONS } from '../translations';
import { getStationName, getTransportModeName } from '../utils/language';
import { MapPin, Search, X, Check, Navigation } from 'lucide-react';

interface StationSearchInputProps {
  label: string;
  placeholder: string;
  selectedStationId: string;
  stations: Station[];
  lang: Language;
  accentColor: 'emerald' | 'rose';
  onSelectStation: (stationId: string) => void;
  onUseCurrentLocation?: () => void;
  isLocating?: boolean;
}

export default function StationSearchInput({
  label,
  placeholder,
  selectedStationId,
  stations,
  lang,
  accentColor,
  onSelectStation,
  onUseCurrentLocation,
  isLocating,
}: StationSearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;

  const selectedStation = stations.find((s) => s.id === selectedStationId);

  // Sync display text when selectedStationId changes externally
  useEffect(() => {
    if (selectedStation) {
      setSearchQuery(getStationName(selectedStation, lang));
    } else {
      setSearchQuery('');
    }
  }, [selectedStationId, lang]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter stations using multi-attribute search (French name, Arabic name, ID, type)
  const filteredStations = stations.filter((s) => {
    if (!searchQuery || selectedStation && searchQuery === getStationName(selectedStation, lang)) {
      return true;
    }
    const q = searchQuery.toLowerCase().trim();
    const matchFr = s.name.toLowerCase().includes(q);
    const matchAr = s.nameAr ? s.nameAr.includes(q) : false;
    const matchId = s.id.toLowerCase().includes(q);
    const matchType = s.type.toLowerCase().includes(q);

    return matchFr || matchAr || matchId || matchType;
  });

  const handleSelect = (s: Station) => {
    onSelectStation(s.id);
    setSearchQuery(getStationName(s, lang));
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectStation('');
    setSearchQuery('');
    setIsOpen(true);
  };

  const ringClass = accentColor === 'emerald' 
    ? 'focus-within:border-emerald-500 focus-within:ring-emerald-500' 
    : 'focus-within:border-rose-500 focus-within:ring-rose-500';

  const iconColor = accentColor === 'emerald' ? 'text-emerald-500' : 'text-rose-500';

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block mb-1">
        {label}
      </label>

      <div className={`relative flex items-center bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs ${ringClass}`}>
        <MapPin className={`w-4 h-4 ${iconColor} absolute left-3 pointer-events-none`} />

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent py-3 pl-9 pr-16 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-slate-200/60 rounded-full text-slate-400 hover:text-slate-600 transition"
              title="Effacer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {onUseCurrentLocation && (
            <button
              type="button"
              onClick={onUseCurrentLocation}
              disabled={isLocating}
              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition border border-emerald-200/80 flex items-center gap-1 text-[10px] font-bold"
              title={t.nearestGpsBtn}
            >
              <Navigation className={`w-3.5 h-3.5 text-emerald-600 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">GPS</span>
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete Results Dropdown Drawer */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-64 overflow-y-auto p-1.5 animate-fade-in space-y-1">
          {filteredStations.length === 0 ? (
            <div className="p-3 text-center text-xs text-slate-400 font-medium">
              Aucune station trouvée pour "{searchQuery}"
            </div>
          ) : (
            filteredStations.map((s) => {
              const isSelected = s.id === selectedStationId;
              const modeBadgeColor =
                s.type === 'metro'
                  ? 'bg-rose-100 text-rose-700'
                  : s.type === 'tram'
                  ? 'bg-blue-100 text-blue-700'
                  : s.type === 'train'
                  ? 'bg-emerald-100 text-emerald-700'
                  : s.type === 'bus'
                  ? 'bg-amber-100 text-amber-800'
                  : s.type === 'bus_priv'
                  ? 'bg-cyan-100 text-cyan-800'
                  : 'bg-purple-100 text-purple-700';

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelect(s)}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between text-xs group ${
                    isSelected
                      ? 'bg-rose-50 border border-rose-200 text-rose-900 font-bold'
                      : 'hover:bg-slate-50 text-slate-700 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-extrabold text-slate-800 group-hover:text-rose-600 transition truncate">
                      {getStationName(s, lang)}
                    </span>
                    {lang !== 'fr' && s.name && (
                      <span className="text-[10px] text-slate-400 truncate hidden sm:inline">
                        ({s.name})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] uppercase font-black tracking-wide ${modeBadgeColor}`}>
                      {getTransportModeName(s.type, lang)}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-rose-600" />}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
