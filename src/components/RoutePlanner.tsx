import React, { useState, useEffect } from 'react';
import { Station, LineData, RouteResult, SavedRoute } from '../types';
import { LINES } from '../data';
import { computeRoute } from '../routeEngine';
import { getStationName, getTransportModeName, formatStepInstruction, getLocalizedStopName } from '../utils/language';
import { MapPin, Navigation, ArrowRightLeft, CreditCard, Clock, Star, AlertCircle, Share2, Sparkles, AlertTriangle, Compass, Target } from 'lucide-react';
import StationSearchInput from './StationSearchInput';

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

import { Language, TRANSLATIONS } from '../translations';

interface RoutePlannerProps {
  stations: Station[];
  lines?: LineData[];
  lang: Language;
  onRouteCalculated: (route: RouteResult | null, originId: string, destId: string) => void;
  onSaveRoute: (originId: string, destId: string, name: string) => void;
  savedRoutes: SavedRoute[];
  onLoadSavedRoute: (originId: string, destId: string) => void;
  onStartNavigation: (route: RouteResult) => void;
}

export default function RoutePlanner({
  stations,
  lines,
  lang,
  onRouteCalculated,
  onSaveRoute,
  savedRoutes,
  onLoadSavedRoute,
  onStartNavigation,
}: RoutePlannerProps) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;
  const [originId, setOriginId] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [aiAdvice, setAiAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [nearestInfo, setNearestInfo] = useState<{ name: string; distKm: number } | null>(null);
  const [error, setError] = useState('');
  const [routeNameInput, setRouteNameInput] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});

  // Auto Sort stations alphabetically for better UI lists
  const sortedStations = [...stations].sort((a, b) => a.name.localeCompare(b.name));

  const handleFindNearestStation = () => {
    setIsLocating(true);
    setError('');

    const findClosestFromCoords = (lat: number, lng: number, isFallback = false) => {
      let closest: Station | null = null;
      let minDist = Infinity;

      stations.forEach((s) => {
        const d = calculateDistanceKm(lat, lng, s.lat, s.lng);
        if (d < minDist) {
          minDist = d;
          closest = s;
        }
      });

      if (closest) {
        const st = closest as Station;
        setOriginId(st.id);
        const dist = Math.round(minDist * 10) / 10;
        setNearestInfo({ name: st.name, distKm: dist });
        if (isFallback) {
          setError(`Position GPS non disponible. Station la plus proche calculée depuis le centre d'Alger : ${st.name} (${dist} km)`);
        }
      }
      setIsLocating(false);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          findClosestFromCoords(pos.coords.latitude, pos.coords.longitude, false);
        },
        () => {
          // Default to Central Algiers (36.7702, 3.0583)
          findClosestFromCoords(36.7702, 3.0583, true);
        },
        { enableHighAccuracy: true, timeout: 7000 }
      );
    } else {
      findClosestFromCoords(36.7702, 3.0583, true);
    }
  };

  const handleCalculate = async (oId = originId, dId = destinationId) => {
    if (!oId || !dId) {
      setError('Veuillez sélectionner un départ et une destination.');
      return;
    }
    if (oId === dId) {
      setError('Le départ et la destination doivent être différents.');
      return;
    }

    setError('');
    setIsLoading(true);
    setRouteResult(null);
    setAiAdvice('');

    try {
      const response = await fetch('/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originId: oId, destinationId: dId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.route) {
          setRouteResult(data.route);
          setAiAdvice(data.aiAdvice);
          onRouteCalculated(data.route, oId, dId);
          return;
        }
      }
      // If server route is missing or non-200, use local real Dijkstra engine
      calculateRouteLocally(oId, dId);
    } catch (err) {
      console.log('Calculating route locally using client-side Dijkstra engine...');
      calculateRouteLocally(oId, dId);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateRouteLocally = (oId: string, dId: string) => {
    const activeLines = lines && lines.length > 0 ? lines : LINES;
    const computed = computeRoute(stations, activeLines, oId, dId);

    if (computed) {
      setRouteResult(computed);
      setAiAdvice("Calcul de l'itinéraire basé sur le réseau complet d'Alger.");
      onRouteCalculated(computed, oId, dId);
    } else {
      setError("Aucun itinéraire trouvé entre ces deux stations.");
    }
  };

  const handleSwap = () => {
    const temp = originId;
    setOriginId(destinationId);
    setDestinationId(temp);
    if (destinationId && temp) {
      handleCalculate(destinationId, temp);
    }
  };

  const handleSaveClick = () => {
    const originName = stations.find((s) => s.id === originId)?.name || '';
    const destName = stations.find((s) => s.id === destinationId)?.name || '';
    setRouteNameInput(`${originName} vers ${destName}`);
    setShowSaveModal(true);
  };

  const confirmSave = () => {
    if (!routeNameInput.trim()) return;
    onSaveRoute(originId, destinationId, routeNameInput);
    setShowSaveModal(false);
  };

  const handleLoadSaved = (route: SavedRoute) => {
    setOriginId(route.originId);
    setDestinationId(route.destinationId);
    handleCalculate(route.originId, route.destinationId);
    onLoadSavedRoute(route.originId, route.destinationId);
  };

  const clearRoute = () => {
    setOriginId('');
    setDestinationId('');
    setRouteResult(null);
    setAiAdvice('');
    setError('');
    onRouteCalculated(null, '', '');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <Navigation className="w-5 h-5 text-rose-600" />
          Calcul d'itinéraire
        </h3>
        {(originId || destinationId) && (
          <button
            onClick={clearRoute}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/60 px-3 py-1.5 rounded-lg transition"
          >
            Réinitialiser
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-5 gap-3 items-center">
        <div className="md:col-span-2">
          <StationSearchInput
            label={t.originLabel}
            placeholder={t.selectStation}
            selectedStationId={originId}
            stations={sortedStations}
            lang={lang}
            accentColor="emerald"
            onSelectStation={(id) => {
              setOriginId(id);
              setNearestInfo(null);
            }}
            onUseCurrentLocation={handleFindNearestStation}
            isLocating={isLocating}
          />
        </div>

        {/* Swap Button */}
        <div className="flex justify-center md:col-span-1 pt-4">
          <button
            onClick={handleSwap}
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2.5 rounded-full transition shadow-2xs hover:rotate-180 duration-500"
            title={t.swapBtn}
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="md:col-span-2">
          <StationSearchInput
            label={t.destLabel}
            placeholder={t.selectStation}
            selectedStationId={destinationId}
            stations={sortedStations}
            lang={lang}
            accentColor="rose"
            onSelectStation={(id) => setDestinationId(id)}
          />
        </div>
      </div>

      {nearestInfo && (
        <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-xl border border-emerald-200/80 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-600 animate-pulse flex-shrink-0" />
            <span>
              Station la plus proche détectée : <strong>{nearestInfo.name}</strong> à environ <strong>{nearestInfo.distKm} km</strong> de vous.
            </span>
          </div>
          <button
            onClick={() => setNearestInfo(null)}
            className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 underline ml-2"
          >
            Masquer
          </button>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 text-rose-600 text-xs p-3.5 rounded-xl border border-rose-100 flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 text-rose-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Action CTA */}
      <button
        onClick={() => handleCalculate()}
        disabled={isLoading || !originId || !destinationId}
        className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Optimisation du trajet...
          </>
        ) : (
          <>
            <Navigation className="w-4 h-4" />
            Trouver le meilleur itinéraire
          </>
        )}
      </button>

      {/* Saved / Favorited shortcuts */}
      {savedRoutes.length > 0 && !routeResult && (
        <div className="pt-2 border-t border-slate-100/50">
          <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-2.5">
            Vos trajets favoris enregistrés :
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {savedRoutes.map((route) => (
              <button
                key={route.id}
                onClick={() => handleLoadSaved(route)}
                className="flex items-center justify-between text-left p-3 rounded-xl border border-slate-100 hover:border-rose-200 hover:bg-rose-50/40 transition group"
              >
                <div>
                  <div className="font-bold text-slate-700 text-xs group-hover:text-rose-700 truncate">
                    {route.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {route.originName} ➔ {route.destinationName}
                  </div>
                </div>
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 opacity-85" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results details */}
      {routeResult && (
        <div className="pt-4 border-t border-slate-100 space-y-4 animate-fade-in">
          {/* Summary Panel */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Clock className="w-4 h-4 text-rose-600 mx-auto mb-1.5" />
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Durée Totale
              </div>
              <div className="font-black text-slate-800 text-sm mt-0.5">
                {routeResult.totalDuration} min
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <ArrowRightLeft className="w-4 h-4 text-indigo-600 mx-auto mb-1.5" />
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Changements
              </div>
              <div className="font-black text-slate-800 text-sm mt-0.5">
                {routeResult.transfers}
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CreditCard className="w-4 h-4 text-emerald-600 mx-auto mb-1.5" />
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Coût Estimé
              </div>
              <div className="font-black text-emerald-600 text-sm mt-0.5">
                {routeResult.totalCost} DA
              </div>
            </div>
          </div>

          {/* Google Maps Style Route Segment Visual Bar */}
          <div className="bg-slate-100 p-3 rounded-2xl border border-slate-200/70 space-y-2">
            <div className="text-[10px] uppercase font-black tracking-wider text-slate-400 flex items-center justify-between">
              <span>Aperçu de la traversée Google Maps :</span>
              <span className="text-slate-700 font-bold">{routeResult.totalDuration} min au total</span>
            </div>
            <div className="h-3.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-0.5 p-0.5 shadow-inner">
              {routeResult.steps.map((step, idx) => {
                if (step.duration === 0 && idx !== 0) return null;
                const weight = Math.max(step.duration || 1, 2);
                const modeBg =
                  step.type === 'metro'
                    ? 'bg-rose-500'
                    : step.type === 'tram'
                    ? 'bg-blue-500'
                    : step.type === 'train'
                    ? 'bg-emerald-500'
                    : step.type === 'bus'
                    ? 'bg-amber-500'
                    : step.type === 'bus_priv'
                    ? 'bg-cyan-500'
                    : step.type === 'telepherique'
                    ? 'bg-purple-500'
                    : 'bg-slate-400';

                return (
                  <div
                    key={idx}
                    style={{ flexGrow: weight }}
                    className={`${modeBg} h-full first:rounded-l-full last:rounded-r-full transition-all hover:brightness-110 cursor-pointer`}
                    title={`${step.lineName || step.type}: ${step.duration} min`}
                  />
                );
              })}
            </div>
          </div>

          {/* Start Live Turn-by-Turn Navigation Button */}
          <button
            type="button"
            onClick={() => routeResult && onStartNavigation(routeResult)}
            className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] active:scale-[0.99] border border-slate-700"
          >
            <Navigation className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
            <span>{t.startNavBtn}</span>
          </button>

          {/* Gemini AI Advice Card */}
          {aiAdvice && (
            <div className="bg-rose-50/50 rounded-xl border border-rose-100/60 p-4 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-10">
                <Sparkles className="w-20 h-20 text-rose-600" />
              </div>
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4.5 h-4.5 text-rose-600 mt-0.5 flex-shrink-0 animate-pulse" />
                <div>
                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    Conseil de Bahdja Guide
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {aiAdvice}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step Timeline */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400">
              Feuille de Route :
            </h4>
            <div className="relative border-l-2 border-slate-200 ml-3.5 pl-5 space-y-4">
              {routeResult.steps.map((step, idx) => {
                const color =
                  step.type === 'metro'
                    ? '#EF4444'
                    : step.type === 'tram'
                    ? '#3B82F6'
                    : step.type === 'train'
                    ? '#10B981'
                    : step.type === 'bus'
                    ? '#F59E0B'
                    : step.type === 'bus_priv'
                    ? '#06B6D4'
                    : step.type === 'telepherique'
                    ? '#A855F7'
                    : '#94A3B8';

                return (
                  <div key={idx} className="relative group">
                    {/* Ring indicator */}
                    <div
                      className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs transition duration-300"
                      style={{ backgroundColor: color }}
                    />
                    <div className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">
                          {getStationName(stations.find((st) => st.id === step.stationId || st.name === step.stationName), lang) || step.stationName}
                        </span>
                        {step.type !== 'walk' && (
                          <span
                            className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold text-white"
                            style={{ backgroundColor: color }}
                          >
                            {getTransportModeName(step.type, lang)}
                          </span>
                        )}
                        {step.duration > 0 && (
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {step.duration} min
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 mt-1 font-medium">
                        {formatStepInstruction(step, lang, stations)}
                      </p>

                      {/* Intermediate Stops Expandable Drawer */}
                      {step.intermediateStops && step.intermediateStops.length > 0 && (
                        <div className="mt-2">
                          <button
                            type="button"
                            onClick={() => setExpandedSteps(prev => ({ ...prev, [idx]: !prev[idx] }))}
                            className="text-[11px] font-extrabold text-rose-600 hover:text-rose-700 flex items-center gap-1 bg-rose-50 hover:bg-rose-100/70 px-2.5 py-1 rounded-lg transition"
                          >
                            <span>
                              {expandedSteps[idx] 
                                ? (lang === 'ar' || lang === 'dz' ? '▼ إخفاء تفاصيل المحطات' : lang === 'en' ? '▼ Hide station details' : '▼ Masquer le détail des stations') 
                                : (lang === 'ar' || lang === 'dz' 
                                    ? `▶ عرض ${step.intermediateStops.length} محطات حافلة/قطار في الطريق` 
                                    : lang === 'en' 
                                    ? `▶ View ${step.intermediateStops.length} stop(s) passed` 
                                    : `▶ Voir les ${step.intermediateStops.length} arrêt(s) traversé(s)`)}
                            </span>
                          </button>

                          {expandedSteps[idx] && (
                            <div className="mt-2 pl-3 border-l-2 border-dashed border-rose-300 space-y-1.5 py-1 text-slate-600 text-xs animate-fade-in bg-slate-50/60 rounded-r-xl p-2">
                              {step.intermediateStops.map((stopName, stopIdx) => (
                                <div key={stopIdx} className="flex items-center gap-2 font-medium text-[11px] text-slate-700">
                                  <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                                  <span>{getLocalizedStopName(stopName, lang, stations)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Save Route Action */}
          <div className="pt-2 flex gap-2">
            <button
              onClick={handleSaveClick}
              className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5"
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              Ajouter aux favoris
            </button>
          </div>
        </div>
      )}

      {/* Save Route Prompt Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[2500]">
          <div className="bg-white p-5 rounded-2xl max-w-sm w-full mx-4 shadow-2xl border border-slate-100">
            <h3 className="font-bold text-slate-800 text-base mb-1">
              Nommer ce trajet favori
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Donnez un nom explicite à cet itinéraire récurrent pour le retrouver facilement.
            </p>
            <input
              type="text"
              value={routeNameInput}
              onChange={(e) => setRouteNameInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl px-3 py-2.5 text-sm font-semibold mb-4 focus:outline-none"
              placeholder="Ex: Aller à la Fac (USTHB)"
            />
            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition"
              >
                Annuler
              </button>
              <button
                onClick={confirmSave}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition shadow-md"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
