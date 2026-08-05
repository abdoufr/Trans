import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Station, LineData, TransportType, RouteResult } from '../types';

interface InteractiveMapProps {
  stations: Station[];
  lines: LineData[];
  selectedStation: Station | null;
  selectedLine: LineData | null;
  onSelectStation: (station: Station) => void;
  onSelectLine: (line: LineData | null) => void;
  activeFilters: Record<TransportType, boolean>;
  highlightedSteps: string[]; // List of station IDs in the current route
  activeRoute?: RouteResult | null;
}

export default function InteractiveMap({
  stations,
  lines,
  selectedStation,
  selectedLine,
  onSelectStation,
  onSelectLine,
  activeFilters,
  highlightedSteps,
  activeRoute,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const polylinesRef = useRef<Record<string, L.Polyline>>({});
  const routePolylinesRef = useRef<L.Polyline[]>([]);
  const startEndMarkersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userLineRef = useRef<L.Polyline | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const handleLocateUser = () => {
    const map = mapRef.current;
    if (!map) return;

    setIsLocating(true);

    const onCoordsFound = (lat: number, lng: number) => {
      if (userMarkerRef.current) userMarkerRef.current.remove();
      if (userLineRef.current) userLineRef.current.remove();

      const userIcon = L.divIcon({
        html: `<div class="relative flex items-center justify-center">
                 <div class="absolute w-8 h-8 bg-blue-500/40 rounded-full animate-ping"></div>
                 <div class="w-5 h-5 bg-blue-600 border-2 border-white rounded-full shadow-lg"></div>
               </div>`,
        className: 'user-gps-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
      userMarker.bindPopup('<div class="p-1 font-sans text-xs font-bold text-slate-800">📍 Votre Position GPS</div>');
      userMarkerRef.current = userMarker;

      let closest: Station | null = null;
      let minDist = Infinity;

      stations.forEach((s) => {
        const d = Math.hypot(s.lat - lat, s.lng - lng);
        if (d < minDist) {
          minDist = d;
          closest = s;
        }
      });

      if (closest) {
        const st = closest as Station;
        const line = L.polyline([[lat, lng], [st.lat, st.lng]], {
          color: '#2563EB',
          dashArray: '5, 8',
          weight: 3,
          opacity: 0.8,
        }).addTo(map);
        userLineRef.current = line;

        const bounds = L.latLngBounds([[lat, lng], [st.lat, st.lng]]);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });

        onSelectStation(st);
      } else {
        map.setView([lat, lng], 14);
      }
      setIsLocating(false);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => onCoordsFound(pos.coords.latitude, pos.coords.longitude),
        () => onCoordsFound(36.7702, 3.0583),
        { enableHighAccuracy: true, timeout: 7000 }
      );
    } else {
      onCoordsFound(36.7702, 3.0583);
    }
  };

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Algiers central coordinates
    const algerCenter: [number, number] = [36.753, 3.058];
    const map = L.map(mapContainerRef.current, {
      center: algerCenter,
      zoom: 12,
      zoomControl: true,
      attributionControl: true,
    });

    // Use OpenStreetMap tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync Markers and Lines
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    for (const key in markersRef.current) {
      if (markersRef.current[key]) {
        markersRef.current[key].remove();
      }
    }
    markersRef.current = {};

    // Clear existing polylines
    for (const key in polylinesRef.current) {
      if (polylinesRef.current[key]) {
        polylinesRef.current[key].remove();
      }
    }
    polylinesRef.current = {};

    // 1. Draw Network Lines
    lines.forEach((line) => {
      // Skip if this transport type is disabled
      if (!activeFilters[line.type]) return;

      const coordinates: [number, number][] = line.stations
        .map((sId) => {
          const station = stations.find((s) => s.id === sId);
          return station ? [station.lat, station.lng] as [number, number] : null;
        })
        .filter((coord): coord is [number, number] => coord !== null);

      if (coordinates.length > 0) {
        const isSelected = selectedLine?.id === line.id;
        const polyline = L.polyline(coordinates, {
          color: line.color,
          weight: isSelected ? 6 : 3.5,
          opacity: isSelected ? 0.95 : 0.65,
          dashArray: line.type === 'bus' ? '6, 8' : line.type === 'bus_priv' ? '2, 6' : line.type === 'train' ? '12, 6' : line.type === 'telepherique' ? '4, 4' : undefined,
        }).addTo(map);

        // Hover events for line
        polyline.on('mouseover', () => {
          polyline.setStyle({ weight: isSelected ? 7 : 5, opacity: 0.9 });
        });
        polyline.on('mouseout', () => {
          polyline.setStyle({ weight: isSelected ? 6 : 3.5, opacity: isSelected ? 0.95 : 0.65 });
        });
        polyline.on('click', () => {
          onSelectLine(line);
        });

        polylinesRef.current[line.id] = polyline;
      }
    });

    // 2. Draw Station Markers
    stations.forEach((station) => {
      // Check if transport filter is active
      if (!activeFilters[station.type]) return;

      const isSelected = selectedStation?.id === station.id;
      const isInCurrentRoute = highlightedSteps.includes(station.id);

      // Create Custom SVG Icon based on type
      const markerColor =
        station.type === 'metro'
          ? '#EF4444' // red
          : station.type === 'tram'
          ? '#3B82F6' // blue
          : station.type === 'train'
          ? '#10B981' // green
          : station.type === 'bus_priv'
          ? '#06B6D4' // cyan
          : station.type === 'telepherique'
          ? '#A855F7' // purple
          : '#F59E0B'; // amber

      const size = isSelected ? 38 : isInCurrentRoute ? 32 : 24;
      const borderClass = isSelected 
        ? 'border-4 border-slate-900 scale-110 z-[1000]' 
        : isInCurrentRoute 
        ? 'border-3 border-emerald-500 scale-105 animate-pulse z-[900]' 
        : 'border-2 border-white';

      const customIcon = L.divIcon({
        html: `<div class="flex items-center justify-center rounded-full text-white shadow-md transition-all duration-300 ${borderClass}" 
                    style="background-color: ${markerColor}; width: ${size}px; height: ${size}px;">
                 <svg width="${size * 0.5}" height="${size * 0.5}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                   ${
                     station.type === 'metro'
                       ? '<path d="M4 6h16M4 18h16M4 12h16" />'
                       : station.type === 'tram'
                       ? '<path d="M6 3h12v15H6zm0 15h12v2H6zM9 8h6M9 13h6" />'
                       : station.type === 'train'
                       ? '<path d="M4 3h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM4 13h16" />'
                       : station.type === 'telepherique'
                       ? '<path d="M10 3h4M12 3v5M6 8h12l2 11H4z" />'
                       : '<path d="M4 6h16v10H4zm2 13a2 2 0 1 0 4 0a2 2 0 1 0-4 0zm10 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0z" />'
                   }
                 </svg>
               </div>`,
        className: 'custom-leaflet-marker',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([station.lat, station.lng], {
        icon: customIcon,
        title: station.name,
      }).addTo(map);

      // Popup binding with French detail
      const popupContent = `
        <div class="p-2 font-sans" style="min-width: 160px;">
          <h4 class="font-semibold text-slate-800 text-sm leading-tight">${station.name}</h4>
          <h5 class="text-slate-400 text-xs text-right mt-0.5 font-medium dir-rtl">${station.nameAr}</h5>
          <div class="flex items-center gap-1.5 mt-2">
            <span class="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold text-white" style="background-color: ${markerColor}">
              ${station.type}
            </span>
            <span class="text-xs text-slate-500 font-medium">${station.lines.join(', ')}</span>
          </div>
          <p class="text-xs text-slate-600 mt-2 font-semibold">📍 Attente live : <span class="text-emerald-600">${station.liveWaitTime ?? station.schedule.frequencyPeak} min</span></p>
        </div>
      `;
      marker.bindPopup(popupContent, { closeButton: false });

      // Click handler
      marker.on('click', () => {
        onSelectStation(station);
      });

      markersRef.current[station.id] = marker;
    });

  }, [stations, lines, selectedStation, selectedLine, activeFilters, highlightedSteps]);

  // 3. Draw Active Google Maps Style Route Path on Map
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous route polylines
    routePolylinesRef.current.forEach((pl) => pl.remove());
    routePolylinesRef.current = [];

    // Clear previous start/end markers
    startEndMarkersRef.current.forEach((m) => m.remove());
    startEndMarkersRef.current = [];

    if (!activeRoute || !activeRoute.steps || activeRoute.steps.length === 0) return;

    const routeCoords: [number, number][] = [];

    // Draw route segment by segment
    for (let i = 0; i < activeRoute.steps.length - 1; i++) {
      const stepA = activeRoute.steps[i];
      const stepB = activeRoute.steps[i + 1];

      const stA = stations.find((s) => s.id === stepA.stationId);
      const stB = stations.find((s) => s.id === stepB.stationId);

      if (stA && stB) {
        routeCoords.push([stA.lat, stA.lng]);
        routeCoords.push([stB.lat, stB.lng]);

        const isWalk = stepB.type === 'walk';
        const color =
          stepB.type === 'metro'
            ? '#EF4444'
            : stepB.type === 'tram'
            ? '#2563EB'
            : stepB.type === 'train'
            ? '#059669'
            : stepB.type === 'bus_priv'
            ? '#0891B2'
            : stepB.type === 'telepherique'
            ? '#9333EA'
            : stepB.type === 'bus'
            ? '#D97706'
            : '#2563EB';

        // Outer glow polyline (Google Maps style)
        const outerGlow = L.polyline([[stA.lat, stA.lng], [stB.lat, stB.lng]], {
          color: isWalk ? '#3B82F6' : '#1E293B',
          weight: isWalk ? 7 : 10,
          opacity: 0.35,
          dashArray: isWalk ? '6, 8' : undefined,
        }).addTo(map);

        // Core polyline
        const corePoly = L.polyline([[stA.lat, stA.lng], [stB.lat, stB.lng]], {
          color,
          weight: isWalk ? 4.5 : 6.5,
          opacity: 0.95,
          dashArray: isWalk ? '5, 8' : undefined,
        }).addTo(map);

        routePolylinesRef.current.push(outerGlow);
        routePolylinesRef.current.push(corePoly);
      }
    }

    // Add Departure Marker (A - Green Pin)
    const firstStep = activeRoute.steps[0];
    const firstSt = stations.find((s) => s.id === firstStep?.stationId);
    if (firstSt) {
      const startIcon = L.divIcon({
        html: `<div class="flex items-center justify-center bg-emerald-600 border-3 border-white rounded-full text-white font-black shadow-xl animate-bounce" style="width: 36px; height: 36px;">
                 <span style="font-size: 14px;">📍</span>
               </div>`,
        className: 'start-marker-icon',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
      const startMarker = L.marker([firstSt.lat, firstSt.lng], { icon: startIcon, zIndexOffset: 2000 }).addTo(map);
      startMarker.bindPopup(`<div class="p-1.5 font-bold text-xs text-emerald-800">🟢 Point de Départ : ${firstSt.name}</div>`);
      startEndMarkersRef.current.push(startMarker);
    }

    // Add Destination Marker (B - Red Flag)
    const lastStep = activeRoute.steps[activeRoute.steps.length - 1];
    const lastSt = stations.find((s) => s.id === lastStep?.stationId);
    if (lastSt) {
      const endIcon = L.divIcon({
        html: `<div class="flex items-center justify-center bg-rose-600 border-3 border-white rounded-full text-white font-black shadow-xl" style="width: 36px; height: 36px;">
                 <span style="font-size: 14px;">🏁</span>
               </div>`,
        className: 'end-marker-icon',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
      const endMarker = L.marker([lastSt.lat, lastSt.lng], { icon: endIcon, zIndexOffset: 2000 }).addTo(map);
      endMarker.bindPopup(`<div class="p-1.5 font-bold text-xs text-rose-800">🔴 Destination Arrivée : ${lastSt.name}</div>`);
      startEndMarkersRef.current.push(endMarker);
    }

    // Fit map bounds to show complete route
    if (routeCoords.length > 0) {
      const bounds = L.latLngBounds(routeCoords);
      map.fitBounds(bounds, { padding: [55, 55], maxZoom: 15 });
    }
  }, [activeRoute, stations]);

  // Handle selectedStation zoom/center pan
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedStation) return;

    map.setView([selectedStation.lat, selectedStation.lng], 14.5, {
      animate: true,
      duration: 0.75,
    });

    const marker = markersRef.current[selectedStation.id];
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 300);
    }
  }, [selectedStation]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-100 shadow-sm" id="leaflet-map-wrapper">
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '400px' }} />

      {/* Floating GPS Button Overlay */}
      <button
        onClick={handleLocateUser}
        disabled={isLocating}
        className="absolute top-3 right-3 z-[1000] bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl shadow-md border border-slate-200/80 flex items-center gap-1.5 transition active:scale-95"
        title="Centrer sur ma position GPS et trouver la station la plus proche"
      >
        {isLocating ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
            <span>GPS...</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>📍 Me Géolocaliser</span>
          </>
        )}
      </button>

      {/* Offline Alert Overlay */}
      {isOffline && (
        <div className="absolute top-4 left-4 right-4 bg-amber-500 text-white text-xs px-4 py-3 rounded-xl shadow-lg flex items-center justify-between z-[2000] animate-bounce">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <div>
              <span className="font-bold">Mode Hors-ligne Activé : </span>
              Les horaires, fiches de lignes et calculs d'itinéraires restent accessibles ! La carte visuelle se rechargera avec internet.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
