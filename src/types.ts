export type TransportType = 'metro' | 'tram' | 'train' | 'bus' | 'bus_priv' | 'telepherique';

export interface Station {
  id: string;
  name: string;
  nameAr: string;
  type: TransportType;
  lat: number;
  lng: number;
  lines: string[];
  connections: string[]; // IDs of connected stations
  schedule: {
    firstDeparture: string;
    lastDeparture: string;
    frequencyPeak: number; // in minutes
    frequencyOffPeak: number; // in minutes
  };
  liveWaitTime?: number; // Simulated waiting countdown in minutes
  wilayaCode?: number;
  wilayaName?: string;
}

export interface LineData {
  id: string;
  name: string;
  type: TransportType;
  color: string;
  stations: string[]; // Station IDs in order
  wilayaCode?: number;
  wilayaName?: string;
}

export interface Disruption {
  id: string;
  title: string;
  description: string;
  type: TransportType | 'all';
  severity: 'info' | 'warning' | 'critical';
  lineId?: string;
  timestamp: string;
  active: boolean;
}

export interface SavedRoute {
  id: string;
  name: string;
  originId: string;
  destinationId: string;
  originName: string;
  destinationName: string;
  createdAt: string;
}

export interface RouteStep {
  stationId: string;
  stationName: string;
  type: TransportType | 'walk';
  lineName?: string;
  duration: number; // in minutes
  instruction: string;
  intermediateStops?: string[]; // Names of intermediate stations passed along this leg
}

export interface RouteResult {
  steps: RouteStep[];
  totalDuration: number; // in minutes
  totalCost: number; // in DA (Dinar Algérien)
  transfers: number;
}
