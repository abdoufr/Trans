import React, { useState, useEffect } from 'react';
import { RouteResult, Station, TransportType } from '../types';
import { Language, TRANSLATIONS } from '../translations';
import { Navigation, ChevronRight, ChevronLeft, X, MapPin, Clock, CreditCard, CheckCircle2, Compass, AlertCircle, Volume2, VolumeX } from 'lucide-react';

interface LiveNavigationOverlayProps {
  route: RouteResult;
  stations: Station[];
  lang: Language;
  onStepChange: (stepIndex: number, stationId: string) => void;
  onClose: () => void;
}

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

export default function LiveNavigationOverlay({
  route,
  stations,
  lang,
  onStepChange,
  onClose,
}: LiveNavigationOverlayProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userDistToStep, setUserDistToStep] = useState<number | null>(null);
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;

  const currentStep = route.steps[currentStepIndex];
  const targetStation = stations.find((s) => s.id === currentStep?.stationId);
  const isArrived = currentStepIndex >= route.steps.length - 1;

  // Sync step change to parent map & speak turn-by-turn instruction
  useEffect(() => {
    if (currentStep) {
      onStepChange(currentStepIndex, currentStep.stationId);

      // Voice guidance alert
      if (!isVoiceMuted && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const textToSpeak = `${currentStep.instruction}`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = lang === 'ar' || lang === 'dz' ? 'ar-SA' : 'fr-FR';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [currentStepIndex, currentStep, isVoiceMuted, lang]);

  // GPS Watch Position for Turn-by-Turn auto-advancing
  useEffect(() => {
    if (!navigator.geolocation || isArrived) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setIsGpsActive(true);
        if (targetStation) {
          const dist = calculateDistanceKm(
            pos.coords.latitude,
            pos.coords.longitude,
            targetStation.lat,
            targetStation.lng
          );
          const distRounded = Math.round(dist * 10) / 10;
          setUserDistToStep(distRounded);

          // Auto-advance if within 150m of target station
          if (dist < 0.15 && currentStepIndex < route.steps.length - 1) {
            setCurrentStepIndex((prev) => prev + 1);
          }
        }
      },
      (err) => {
        console.warn('GPS navigation watch error:', err);
        setIsGpsActive(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 2000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [targetStation, currentStepIndex, isArrived, route.steps.length]);

  const handleNext = () => {
    if (currentStepIndex < route.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const stepColor =
    currentStep?.type === 'metro'
      ? 'bg-rose-600 border-rose-500'
      : currentStep?.type === 'tram'
      ? 'bg-blue-600 border-blue-500'
      : currentStep?.type === 'train'
      ? 'bg-emerald-600 border-emerald-500'
      : currentStep?.type === 'bus'
      ? 'bg-amber-500 border-amber-500'
      : currentStep?.type === 'bus_priv'
      ? 'bg-cyan-600 border-cyan-500'
      : currentStep?.type === 'telepherique'
      ? 'bg-purple-600 border-purple-500'
      : 'bg-slate-700 border-slate-600';

  return (
    <div className="fixed inset-x-0 bottom-0 z-[3000] p-4 pointer-events-auto font-sans animate-slide-up max-w-3xl mx-auto">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-3xl p-5 shadow-2xl border border-white/10 space-y-4">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-rose-600 p-2 rounded-xl text-white shadow-md animate-pulse">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                {t.navActiveTitle}
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {isGpsActive ? 'GPS Actif' : 'GPS Simulation'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Étape {currentStepIndex + 1} sur {route.steps.length} • Durée totale : {route.totalDuration} min
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextMuted = !isVoiceMuted;
                setIsVoiceMuted(nextMuted);
                if (nextMuted && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className={`p-2 rounded-full transition ${
                isVoiceMuted 
                  ? 'bg-slate-800 text-slate-500 hover:text-slate-300' 
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
              title={isVoiceMuted ? 'Activer le guidage vocal' : 'Désactiver le guidage vocal'}
            >
              {isVoiceMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-pulse" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-slate-300 hover:text-white transition"
              title={t.exitNavBtn}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Destination Arrival Card */}
        {isArrived ? (
          <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-2xl p-4 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="font-extrabold text-lg text-white">{t.arrivedDest}</h4>
            <p className="text-xs text-slate-300">
              {currentStep.instruction}
            </p>
          </div>
        ) : (
          /* Active Turn-by-Turn Card */
          <div className="flex items-start gap-4">
            {/* Mode Badge */}
            <div className={`p-4 rounded-2xl text-white shadow-lg flex-shrink-0 ${stepColor}`}>
              <Compass className="w-7 h-7 animate-spin-slow" />
            </div>

            {/* Instruction Detail */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-white/10 text-slate-200">
                  {currentStep.type.toUpperCase()}
                </span>
                {currentStep.lineName && (
                  <span className="text-[11px] font-bold text-rose-400 truncate">
                    {currentStep.lineName}
                  </span>
                )}
              </div>

              <h4 className="font-extrabold text-base text-white leading-snug">
                {currentStep.instruction}
              </h4>

              {/* Sub Info Pill */}
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-300 flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  {currentStep.duration} min
                </span>
                {userDistToStep !== null && (
                  <span className="flex items-center gap-1 font-mono font-bold text-emerald-400">
                    <MapPin className="w-3.5 h-3.5" />
                    ~{userDistToStep} km
                  </span>
                )}
                <span className="text-slate-400">
                  Station : <strong>{targetStation?.name || currentStep.stationName}</strong>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 gap-2">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="flex-1 py-2.5 px-3 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            {t.prevStepBtn}
          </button>

          <button
            onClick={handleNext}
            disabled={isArrived}
            className="flex-1 py-2.5 px-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1 shadow-md shadow-rose-900/50"
          >
            {t.nextStepBtn}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
