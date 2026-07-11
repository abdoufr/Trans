import React, { useState, useEffect } from 'react';
import { Station } from '../types';
import { Search, Clock, ListFilter, MapPin, Radio, CalendarDays } from 'lucide-react';

interface OfflineTimetablesProps {
  stations: Station[];
  onSelectStation: (station: Station) => void;
}

export default function OfflineTimetables({ stations, onSelectStation }: OfflineTimetablesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  // Filter stations based on search query (French & Arabic match)
  const filteredStations = stations.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nameAr.includes(searchTerm)
  );

  // Real-time counter updater for the selected station countdown
  const [liveWait, setLiveWait] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedStation) {
      setLiveWait(null);
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      
      const hour = now.getHours();
      const isPeak = (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19);
      const frequency = isPeak ? selectedStation.schedule.frequencyPeak : selectedStation.schedule.frequencyOffPeak;
      
      const frequencySeconds = frequency * 60;
      const remainder = currentSeconds % frequencySeconds;
      const secondsToWait = frequencySeconds - remainder;
      setLiveWait(Math.ceil(secondsToWait / 60));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [selectedStation]);

  const handleSelect = (station: Station) => {
    setSelectedStation(station);
    onSelectStation(station);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
      <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-indigo-600" />
        Fiches Horaires & Direct
      </h3>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher une station (ex: Martyrs, Ruisseau)..."
          className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
      </div>

      {/* Split layout: station list on left, timetable on right */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 h-[340px]">
        {/* Station list (2/5 size) */}
        <div className="md:col-span-2 overflow-y-auto border border-slate-100 rounded-xl p-2 space-y-1 bg-slate-50/50">
          {filteredStations.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs font-medium">
              Aucune station trouvée.
            </div>
          ) : (
            filteredStations.map((s) => {
              const themeColor =
                s.type === 'metro'
                  ? 'border-rose-500'
                  : s.type === 'tram'
                  ? 'border-blue-500'
                  : s.type === 'train'
                  ? 'border-emerald-500'
                  : s.type === 'bus_priv'
                  ? 'border-cyan-500'
                  : 'border-amber-500';

              return (
                <button
                  key={s.id}
                  onClick={() => handleSelect(s)}
                  className={`w-full text-left p-2.5 rounded-lg border-l-3 bg-white transition hover:bg-slate-50/80 flex items-center justify-between ${
                    selectedStation?.id === s.id
                      ? 'bg-slate-900 text-white hover:bg-slate-900 border-l-slate-900 shadow-xs'
                      : `border-l-transparent hover:${themeColor}`
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-xs truncate leading-snug">
                      {s.name}
                    </div>
                    <div className={`text-[10px] mt-0.5 font-semibold ${selectedStation?.id === s.id ? 'text-slate-300' : 'text-slate-400'}`}>
                      {s.type.toUpperCase()} • {s.lines.join(', ')}
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 font-mono">
                    {s.liveWaitTime ?? s.schedule.frequencyPeak} min
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Selected Timetable Display (3/5 size) */}
        <div className="md:col-span-3 border border-slate-100 rounded-xl p-4 flex flex-col justify-between bg-white shadow-3xs">
          {selectedStation ? (
            <div className="space-y-4 h-full flex flex-col justify-between">
              {/* Station General Info */}
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 text-base leading-tight">
                      {selectedStation.name}
                    </h4>
                    <p className="text-slate-400 text-xs mt-0.5 text-left dir-rtl">
                      {selectedStation.nameAr}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase text-white ${
                      selectedStation.type === 'metro'
                        ? 'bg-rose-500'
                        : selectedStation.type === 'tram'
                        ? 'bg-blue-500'
                        : selectedStation.type === 'train'
                        ? 'bg-emerald-500'
                        : selectedStation.type === 'bus_priv'
                        ? 'bg-cyan-500'
                        : 'bg-amber-500'
                    }`}
                  >
                    {selectedStation.type === 'bus_priv' ? 'bus privé' : selectedStation.type}
                  </span>
                </div>

                {/* Lines served */}
                <div className="mt-3 bg-slate-50 px-3 py-2 rounded-xl flex items-center justify-between border border-slate-100/50">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Lignes Desservies
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {selectedStation.lines.join(' • ')}
                  </span>
                </div>
              </div>

              {/* Dynamic countdown container */}
              <div className="bg-indigo-50/60 rounded-xl border border-indigo-100/40 p-3.5 text-center flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-indigo-600 animate-pulse flex-shrink-0" />
                  <div className="text-left">
                    <h5 className="text-slate-800 text-xs font-extrabold leading-tight">Prochain passage estimé</h5>
                    <p className="text-[9px] text-slate-400">Temps d'attente calculé en direct</p>
                  </div>
                </div>
                <div className="text-indigo-600 font-black text-2xl font-mono">
                  {liveWait ?? selectedStation.schedule.frequencyPeak} <span className="text-xs font-black">min</span>
                </div>
              </div>

              {/* Static Schedule grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/30">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block mb-1">
                    Premier départ
                  </span>
                  <span className="font-bold text-slate-700 font-mono text-sm">
                    {selectedStation.schedule.firstDeparture}
                  </span>
                </div>
                <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/30">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block mb-1">
                    Dernier départ
                  </span>
                  <span className="font-bold text-slate-700 font-mono text-sm">
                    {selectedStation.schedule.lastDeparture}
                  </span>
                </div>
                <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/30">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block mb-1">
                    Fréquence (Pointe)
                  </span>
                  <span className="font-bold text-slate-700 font-mono text-sm">
                    Toutes les {selectedStation.schedule.frequencyPeak} min
                  </span>
                </div>
                <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/30">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block mb-1">
                    Fréquence (Heures creuses)
                  </span>
                  <span className="font-bold text-slate-700 font-mono text-sm">
                    Toutes les {selectedStation.schedule.frequencyOffPeak} min
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
              <MapPin className="w-8 h-8 text-slate-300 animate-bounce" />
              <div>
                <h4 className="font-bold text-sm text-slate-700">Aucune station sélectionnée</h4>
                <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto mt-1">
                  Sélectionnez une station dans la liste de gauche pour afficher sa fiche horaire complète.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
