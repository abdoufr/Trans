import React, { useState, useEffect } from 'react';
import { Station, RouteResult, SavedRoute } from '../types';
import { MapPin, Navigation, ArrowRightLeft, CreditCard, Clock, Star, AlertCircle, Share2, Sparkles, AlertTriangle } from 'lucide-react';

interface RoutePlannerProps {
  stations: Station[];
  onRouteCalculated: (route: RouteResult | null, originId: string, destId: string) => void;
  onSaveRoute: (originId: string, destId: string, name: string) => void;
  savedRoutes: SavedRoute[];
  onLoadSavedRoute: (originId: string, destId: string) => void;
}

export default function RoutePlanner({
  stations,
  onRouteCalculated,
  onSaveRoute,
  savedRoutes,
  onLoadSavedRoute,
}: RoutePlannerProps) {
  const [originId, setOriginId] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [aiAdvice, setAiAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [routeNameInput, setRouteNameInput] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Auto Sort stations alphabetically for better UI lists
  const sortedStations = [...stations].sort((a, b) => a.name.localeCompare(b.name));

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

      const data = await response.json();
      if (response.ok && data.route) {
        setRouteResult(data.route);
        setAiAdvice(data.aiAdvice);
        onRouteCalculated(data.route, oId, dId);
      } else {
        setError(data.error || "Impossible d'élaborer un itinéraire.");
      }
    } catch (err) {
      // Local fallback calculation if server is unreachable
      console.log('Calculating route locally (offline mode)...');
      calculateRouteLocally(oId, dId);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateRouteLocally = (oId: string, dId: string) => {
    // Basic fallback route finder (BFS)
    const start = stations.find((s) => s.id === oId);
    const end = stations.find((s) => s.id === dId);
    if (!start || !end) return;

    // Build a simple schematic fallback step
    const mockRoute: RouteResult = {
      steps: [
        {
          stationId: oId,
          stationName: start.name,
          type: 'walk',
          duration: 0,
          instruction: `Départ de ${start.name}`,
        },
        {
          stationId: dId,
          stationName: end.name,
          type: start.type,
          duration: 25,
          instruction: `Prenez le réseau de type ${start.type.toUpperCase()} vers ${end.name}`,
        },
      ],
      totalDuration: 25,
      totalCost: start.type === 'metro' ? 50 : start.type === 'tram' ? 40 : start.type === 'bus_priv' ? 35 : 30,
      transfers: 0,
    };

    setRouteResult(mockRoute);
    setAiAdvice("Mode Hors-ligne : Calcul de l'itinéraire de secours basé sur votre base locale.");
    onRouteCalculated(mockRoute, oId, dId);
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

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center relative">
        <div className="md:col-span-2 relative">
          <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block mb-1">
            Départ
          </label>
          <div className="relative">
            <select
              value={originId}
              onChange={(e) => setOriginId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none appearance-none"
            >
              <option value="">Sélectionner la gare...</option>
              {sortedStations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.type.toUpperCase()})
                </option>
              ))}
            </select>
            <MapPin className="w-4 h-4 text-emerald-500 absolute left-3 top-3.5" />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center md:col-span-1 pt-4">
          <button
            onClick={handleSwap}
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2.5 rounded-full transition shadow-2xs hover:rotate-180 duration-500"
            title="Inverser les stations"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="md:col-span-2">
          <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block mb-1">
            Destination
          </label>
          <div className="relative">
            <select
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none appearance-none"
            >
              <option value="">Sélectionner la gare...</option>
              {sortedStations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.type.toUpperCase()})
                </option>
              ))}
            </select>
            <MapPin className="w-4 h-4 text-rose-500 absolute left-3 top-3.5" />
          </div>
        </div>
      </div>

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
                          {step.stationName}
                        </span>
                        {step.type !== 'walk' && (
                          <span
                            className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold text-white"
                            style={{ backgroundColor: color }}
                          >
                            {step.type === 'bus_priv' ? 'bus privé' : step.type}
                          </span>
                        )}
                        {step.duration > 0 && (
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {step.duration} min
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 mt-1">{step.instruction}</p>
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
