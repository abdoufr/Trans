import React, { useState, useEffect } from 'react';
import { Station, LineData, Disruption, SavedRoute, RouteResult, TransportType } from './types';
import { STATIONS, LINES, INITIAL_DISRUPTIONS } from './data';
import InteractiveMap from './components/InteractiveMap';
import BahdjaGuideChat from './components/BahdjaGuideChat';
import RoutePlanner from './components/RoutePlanner';
import DisruptionAlerts from './components/DisruptionAlerts';
import OfflineTimetables from './components/OfflineTimetables';
import LiveNavigationOverlay from './components/LiveNavigationOverlay';
import DirectLinesTable from './components/DirectLinesTable';
import { Language, TRANSLATIONS } from './translations';
import { Map, Navigation, BellRing, CalendarDays, Star, Train, Info, ShieldAlert, Sparkles, Clock, Globe, Moon, Sun, ArrowRight, Languages, Route } from 'lucide-react';

export default function App() {
  // State variables
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('kifach_lang') as Language) || 'fr';
  });
  const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;

  const [stations, setStations] = useState<Station[]>(STATIONS);
  const [lines] = useState<LineData[]>(LINES);
  const [disruptions, setDisruptions] = useState<Disruption[]>(INITIAL_DISRUPTIONS);
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedLine, setSelectedLine] = useState<LineData | null>(null);
  const [activeRoute, setActiveRoute] = useState<RouteResult | null>(null);
  const [highlightedSteps, setHighlightedSteps] = useState<string[]>([]);

  // Live Navigation Mode State
  const [isNavigating, setIsNavigating] = useState(false);
  const [navRoute, setNavRoute] = useState<RouteResult | null>(null);
  
  const [activeTab, setActiveTab] = useState<'route' | 'lines' | 'timetable' | 'alerts' | 'favorites'>('route');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [algiersTime, setAlgiersTime] = useState('');

  // Transport filter states
  const [activeFilters, setActiveFilters] = useState<Record<TransportType, boolean>>({
    metro: true,
    tram: true,
    train: true,
    bus: true,
    bus_priv: true,
    telepherique: true,
  });

  // Track online/offline status
  useEffect(() => {
    const updateOnlineStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Sync Algiers time clock (UTC+1)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Translate current time to Algiers time zone
      const algTime = now.toLocaleTimeString('fr-FR', {
        timeZone: 'Africa/Algiers',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setAlgiersTime(algTime);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial state from full-stack Express API
  const fetchLiveNetworkData = async () => {
    try {
      const stationsRes = await fetch('/api/stations');
      if (stationsRes.ok) {
        const data = await stationsRes.json();
        if (data.stations) {
          setStations(data.stations);
        }
      }

      const disruptionsRes = await fetch('/api/perturbations');
      if (disruptionsRes.ok) {
        const alertData = await disruptionsRes.json();
        setDisruptions(alertData);
      }
    } catch (err) {
      console.log('Error fetching live data, falling back to static offline database:', err);
    }
  };

  useEffect(() => {
    fetchLiveNetworkData();
    // Poll for real-time station waiting times every 30 seconds
    const interval = setInterval(fetchLiveNetworkData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Load Saved Favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('alger_transit_favorites');
    if (stored) {
      try {
        setSavedRoutes(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to parse favorites:', err);
      }
    }
  }, []);

  // Handle saving a route to favorites
  const handleSaveRoute = (originId: string, destinationId: string, customName: string) => {
    const originName = stations.find(s => s.id === originId)?.name || '';
    const destName = stations.find(s => s.id === destinationId)?.name || '';

    const newSaved: SavedRoute = {
      id: 'fav_' + Date.now(),
      name: customName,
      originId,
      destinationId,
      originName,
      destinationName: destName,
      createdAt: new Date().toISOString(),
    };

    const updated = [newSaved, ...savedRoutes];
    setSavedRoutes(updated);
    localStorage.setItem('alger_transit_favorites', JSON.stringify(updated));
  };

  // Handle removing a route from favorites
  const handleRemoveFavorite = (id: string) => {
    const updated = savedRoutes.filter(f => f.id !== id);
    setSavedRoutes(updated);
    localStorage.setItem('alger_transit_favorites', JSON.stringify(updated));
  };

  // Callback when route path is calculated or loaded
  const handleRouteCalculated = (route: RouteResult | null, originId: string, destId: string) => {
    setActiveRoute(route);
    if (route) {
      // Collect station IDs involved in steps to highlight on the map
      const steps = route.steps.map(s => s.stationId);
      setHighlightedSteps(steps);
      
      // Auto focus map to origin station
      const origin = stations.find(s => s.id === originId);
      if (origin) setSelectedStation(origin);
    } else {
      setHighlightedSteps([]);
    }
  };

  // Report a custom incident reported by client
  const handleAddDisruption = (newDisrupt: Disruption) => {
    setDisruptions(prev => [newDisrupt, ...prev]);
  };

  const handleToggleFilter = (type: TransportType) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const isRtl = lang === 'ar' || lang === 'dz';

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col font-sans relative pb-12 ${isRtl ? 'dir-rtl' : ''}`} id="app-root" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Dynamic Header */}
      <header className="bg-white border-b border-slate-100 shadow-3xs sticky top-0 z-50 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-rose-600 p-2.5 rounded-xl text-white shadow-md shadow-rose-200">
              <Train className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl text-slate-900 leading-tight tracking-tight">
                {t.appName} <span className="text-rose-600 font-bold font-arabic">كيفاش نروح</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase mt-0.5">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Real-time status bar & Language switcher */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            {/* Language Dropdown Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60 shadow-2xs">
              <Languages className="w-3.5 h-3.5 text-slate-500 mx-1.5" />
              <select
                value={lang}
                onChange={(e) => {
                  const newLang = e.target.value as Language;
                  setLang(newLang);
                  localStorage.setItem('kifach_lang', newLang);
                }}
                className="bg-transparent text-xs font-extrabold text-slate-700 py-1 pr-2 focus:outline-none cursor-pointer"
              >
                <option value="fr">🇫🇷 Français</option>
                <option value="ar">🇩🇿 العربية</option>
                <option value="dz">🇩🇿 دارجة</option>
                <option value="en">🇬🇧 English</option>
              </select>
            </div>

            {/* Live Clock */}
            <div className="bg-slate-100 px-3 py-1.5 rounded-xl flex items-center gap-2 border border-slate-200/40">
              <Clock className="w-3.5 h-3.5 text-slate-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700 font-mono">
                Alger : {algiersTime || '08:00'}
              </span>
            </div>

            {/* Offline/Online Network Indicator Badge */}
            <div className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 border text-xs font-bold transition-all ${
              isOffline 
                ? 'bg-amber-50 border-amber-200 text-amber-700' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}>
              <Globe className={`w-3.5 h-3.5 ${isOffline ? 'text-amber-500 animate-bounce' : 'text-emerald-500'}`} />
              <span>{isOffline ? t.offlineStatus : t.liveStatus}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Navigation Sidebar & Tabs Controls (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          {/* Bento Transport Quick Filters Bar */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <h3 className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 mb-3">
              {t.filterTitle}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {([
                { id: 'metro', label: t.filterMetro, color: 'border-rose-500 hover:bg-rose-50 text-rose-700', activeBg: 'bg-rose-600 text-white border-rose-600' },
                { id: 'tram', label: t.filterTram, color: 'border-blue-500 hover:bg-blue-50 text-blue-700', activeBg: 'bg-blue-600 text-white border-blue-600' },
                { id: 'train', label: t.filterTrain, color: 'border-emerald-500 hover:bg-emerald-50 text-emerald-700', activeBg: 'bg-emerald-600 text-white border-emerald-600' },
                { id: 'bus', label: t.filterBus, color: 'border-amber-500 hover:bg-amber-50 text-amber-700', activeBg: 'bg-amber-500 text-white border-amber-500' },
                { id: 'bus_priv', label: t.filterBusPriv, color: 'border-cyan-500 hover:bg-cyan-50 text-cyan-700', activeBg: 'bg-cyan-600 text-white border-cyan-600' },
                { id: 'telepherique', label: t.filterTelepherique, color: 'border-purple-500 hover:bg-purple-50 text-purple-700', activeBg: 'bg-purple-600 text-white border-purple-600' },
              ] as const).map((filter) => {
                const isActive = activeFilters[filter.id];
                return (
                  <button
                    key={filter.id}
                    onClick={() => handleToggleFilter(filter.id)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      isActive ? filter.activeBg : `bg-white border-slate-200 text-slate-500 hover:border-slate-300`
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Widget Tabs control panel */}
          <div className="flex bg-slate-200/60 p-1.5 rounded-2xl gap-1">
            {([
              { id: 'route', label: t.tabRoute, icon: Navigation },
              { id: 'lines', label: t.tabDirectLines, icon: Route },
              { id: 'timetable', label: t.tabTimetable, icon: CalendarDays },
              { id: 'alerts', label: t.tabAlerts, icon: BellRing },
              { id: 'favorites', label: t.tabFavorites, icon: Star },
            ] as const).map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3.5 px-2 rounded-xl text-xs font-bold transition-all duration-300 flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-white text-slate-800 shadow-md scale-102'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-rose-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel viewports */}
          <div className="flex-1">
            {activeTab === 'route' && (
              <RoutePlanner
                stations={stations}
                lang={lang}
                onRouteCalculated={handleRouteCalculated}
                onSaveRoute={handleSaveRoute}
                savedRoutes={savedRoutes}
                onLoadSavedRoute={(oId, dId) => {
                  const orig = stations.find(s => s.id === oId);
                  if (orig) setSelectedStation(orig);
                }}
                onStartNavigation={(route) => {
                  setNavRoute(route);
                  setIsNavigating(true);
                }}
              />
            )}

            {activeTab === 'lines' && (
              <DirectLinesTable
                lines={lines}
                stations={stations}
                lang={lang}
                onSelectLine={(line) => setSelectedLine(line)}
                onSelectStation={(station) => setSelectedStation(station)}
              />
            )}

            {activeTab === 'timetable' && (
              <OfflineTimetables
                stations={stations}
                onSelectStation={(station) => {
                  setSelectedStation(station);
                }}
              />
            )}

            {activeTab === 'alerts' && (
              <DisruptionAlerts
                disruptions={disruptions}
                onAddDisruption={handleAddDisruption}
                stations={stations}
              />
            )}

            {activeTab === 'favorites' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                  Trajets Récurrents Favoris
                </h3>
                <p className="text-xs text-slate-400">
                  Enregistrez vos trajets de navette quotidienne pour consulter instantanément les correspondances et temps d'attente en un clic.
                </p>

                {savedRoutes.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 text-xs">
                    Aucun trajet favori enregistré pour le moment.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {savedRoutes.map((route) => (
                      <div
                        key={route.id}
                        className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-rose-50/20 hover:border-rose-100 transition flex items-center justify-between"
                      >
                        <button
                          onClick={() => {
                            // Load route
                            setActiveTab('route');
                            // Trigger callback on loaded path
                            setTimeout(() => {
                              const routeSelector = document.querySelector('select');
                              if (routeSelector) {
                                // Simulate click / load inside planner
                                const plannerButton = document.querySelector('button[disabled]');
                              }
                            }, 100);
                          }}
                          className="flex-1 text-left"
                        >
                          <div className="font-bold text-slate-800 text-xs">{route.name}</div>
                          <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                            <span className="font-medium text-slate-700">{route.originName}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                            <span className="font-medium text-slate-700">{route.destinationName}</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handleRemoveFavorite(route.id)}
                          className="text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-100/50 p-2 rounded-xl transition"
                          title="Supprimer des favoris"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Map Frame (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* Active Corridor Zoom bar summary if active */}
          {selectedLine && (
            <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: selectedLine.color }}
                />
                <div>
                  <h4 className="font-bold text-xs">Fiche Ligne Activée</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{selectedLine.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLine(null)}
                className="text-[10px] font-bold bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition"
              >
                Fermer
              </button>
            </div>
          )}

          <div className="flex-1 min-h-[480px]">
            <InteractiveMap
              stations={stations}
              lines={lines}
              selectedStation={selectedStation}
              selectedLine={selectedLine}
              onSelectStation={(station) => {
                setSelectedStation(station);
                // Also load timetable tab so details are browseable!
                setSelectedStation(station);
              }}
              onSelectLine={(line) => {
                setSelectedLine(line);
              }}
              activeFilters={activeFilters}
              highlightedSteps={highlightedSteps}
            />
          </div>
        </div>
      </main>

      {/* Live Navigation Overlay Mode */}
      {isNavigating && navRoute && (
        <LiveNavigationOverlay
          route={navRoute}
          stations={stations}
          lang={lang}
          onStepChange={(stepIndex, stationId) => {
            const st = stations.find((s) => s.id === stationId);
            if (st) setSelectedStation(st);
          }}
          onClose={() => {
            setIsNavigating(false);
            setNavRoute(null);
          }}
        />
      )}

      {/* Sliding AI Assistant Drawer */}
      <BahdjaGuideChat
        onSelectStationByName={(name) => {
          const found = stations.find(s => s.name.toLowerCase().includes(name.toLowerCase()));
          if (found) setSelectedStation(found);
        }}
      />
    </div>
  );
}
