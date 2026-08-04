import React, { useState } from 'react';
import { Station, LineData, TransportType } from '../types';
import { Language, TRANSLATIONS } from '../translations';
import { exportExcelCSV } from '../algiers_transit_excel';
import { getStationName, getTransportModeName } from '../utils/language';
import { Search, MapPin, ArrowRight, Route, Bus, Train, Compass, CheckCircle, ChevronDown, ChevronUp, Download } from 'lucide-react';

interface DirectLinesTableProps {
  lines: LineData[];
  stations: Station[];
  lang: Language;
  onSelectLine: (line: LineData) => void;
  onSelectStation: (station: Station) => void;
}

export default function DirectLinesTable({
  lines,
  stations,
  lang,
  onSelectLine,
  onSelectStation,
}: DirectLinesTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<TransportType | 'all'>('all');
  const [expandedLineId, setExpandedLineId] = useState<string | null>(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;

  const handleDownloadExcel = () => {
    const csvContent = exportExcelCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Tableau_Lignes_Transports_Alger.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter lines based on mode and search term
  const filteredLines = lines.filter((line) => {
    const matchesFilter = selectedFilter === 'all' || line.type === selectedFilter;

    const startSt = stations.find((s) => s.id === line.stations[0]);
    const endSt = stations.find((s) => s.id === line.stations[line.stations.length - 1]);

    const lineNameMatch = line.name.toLowerCase().includes(searchQuery.toLowerCase());
    const startMatch = startSt?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const endMatch = endSt?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const intermediateMatch = line.stations.some((stId) => {
      const st = stations.find((s) => s.id === stId);
      return st?.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return matchesFilter && (lineNameMatch || startMatch || endMatch || intermediateMatch);
  });

  const toggleExpand = (lineId: string) => {
    setExpandedLineId(expandedLineId === lineId ? null : lineId);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-5">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
            <Route className="w-5 h-5 text-rose-600" />
            <span>Tableau Excel des Lignes Directes d'Alger</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Gare de Départ ➔ Arrêts Intermédiaires ➔ Gare d'Arrivée
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadExcel}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger Tableau Excel (.CSV)</span>
          </button>
          <span className="text-xs font-bold bg-rose-50 text-rose-700 px-3 py-1.5 rounded-xl border border-rose-100">
            {filteredLines.length} Lignes
          </span>
        </div>
      </div>

      {/* Search & Mode Filters */}
      <div className="space-y-3">
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une ligne ou un arrêt (ex: Boumerdès, Baraki, Tram T1, 1er Mai...)..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl py-3 pl-10 pr-4 text-xs font-medium focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
        </div>

        {/* Transport Type Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'metro', label: t.filterMetro },
            { id: 'tram', label: t.filterTram },
            { id: 'train', label: t.filterTrain },
            { id: 'bus', label: t.filterBus },
            { id: 'bus_priv', label: t.filterBusPriv },
            { id: 'telepherique', label: t.filterTelepherique },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setSelectedFilter(chip.id as any)}
              className={`px-3 py-1.5 rounded-xl font-extrabold whitespace-nowrap transition border ${
                selectedFilter === chip.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Direct Lines Table / Cards List */}
      <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
        {filteredLines.map((line) => {
          const startStation = stations.find((s) => s.id === line.stations[0]);
          const endStation = stations.find((s) => s.id === line.stations[line.stations.length - 1]);
          const isExpanded = expandedLineId === line.id;

          const lineStationsList = line.stations
            .map((stId) => stations.find((s) => s.id === stId))
            .filter(Boolean) as Station[];

          return (
            <div
              key={line.id}
              className="border border-slate-200/80 hover:border-rose-300 rounded-2xl p-4 transition-all bg-white hover:shadow-md space-y-3"
            >
              {/* Card Main Info Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Line Badge & Title */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-10 rounded-lg flex-shrink-0 shadow-xs"
                    style={{ backgroundColor: line.color }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-800">
                        {line.name}
                      </h4>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md text-white shadow-2xs" style={{ backgroundColor: line.color }}>
                        {line.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                      Total : {line.stations.length} arrêt(s)
                    </p>
                  </div>
                </div>

                {/* Terminus Departure ➔ Arrival */}
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 text-xs font-bold text-slate-700">
                  <span className="text-emerald-600 font-extrabold truncate max-w-[140px]">
                    📍 {getStationName(startStation, lang) || 'Départ'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="text-rose-600 font-extrabold truncate max-w-[140px]">
                    🏁 {getStationName(endStation, lang) || 'Arrivée'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button
                    onClick={() => onSelectLine(line)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition flex items-center gap-1"
                  >
                    <span>Carte 🗺️</span>
                  </button>

                  <button
                    onClick={() => toggleExpand(line.id)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-xl transition flex items-center gap-1 border border-rose-100"
                  >
                    <span>{isExpanded ? 'Masquer' : 'Tous les arrêts'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Expandable Stations Sequence Table */}
              {isExpanded && (
                <div className="pt-3 border-t border-slate-100 animate-fade-in bg-slate-50/70 p-3 rounded-xl space-y-2">
                  <h5 className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                    SÉQUENCE COMPLÈTE DES STATIONS ({lineStationsList.length}) :
                  </h5>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {lineStationsList.map((st, idx) => {
                      const isTerminusA = idx === 0;
                      const isTerminusB = idx === lineStationsList.length - 1;

                      return (
                        <React.Fragment key={st.id}>
                          <button
                            onClick={() => onSelectStation(st)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-2xs ${
                              isTerminusA
                                ? 'bg-emerald-600 text-white'
                                : isTerminusB
                                ? 'bg-rose-600 text-white'
                                : 'bg-white text-slate-700 border border-slate-200 hover:border-rose-300'
                            }`}
                          >
                            <span>{getStationName(st, lang)}</span>
                          </button>

                          {idx < lineStationsList.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
