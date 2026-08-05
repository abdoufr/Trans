import { TransportType } from './types';

export interface ExcelLineRow {
  lineId: string;
  lineName: string;
  mode: TransportType;
  color: string;
  terminusA: string;
  terminusB: string;
  totalStations: number;
  stationsOrdered: string[];
  tariffDa: number;
  frequencyMin: number;
  operatingHours: string;
}

// Master Excel-Style Transit Matrix Dataset for Wilaya d'Alger
export const EXCEL_TRANSIT_DATASET: ExcelLineRow[] = [
  // --- METRO D'ALGER ---
  {
    lineId: 'metro_m1',
    lineName: 'Métro Ligne 1 (Place des Martyrs ↔ El Harrach Gare)',
    mode: 'metro',
    color: '#EF4444',
    terminusA: 'Place des Martyrs',
    terminusB: 'El Harrach Gare',
    totalStations: 15,
    stationsOrdered: [
      'Place des Martyrs', 'Ali Boumendjel', 'Tafourah - Grande Poste', 'Khelifa Boukhalfa',
      '1er Mai', 'Aïssat Idir', 'Hamma', "Jardin d'Essai", 'Les Fusillés (Ruisseau)',
      'Cité Amirouche', 'Mer et Soleil', 'Haï El Badr', 'Les Ateliers', 'El Harrach Centre', 'El Harrach Gare'
    ],
    tariffDa: 50,
    frequencyMin: 4,
    operatingHours: '05:00 - 23:00'
  },
  {
    lineId: 'metro_m1_branch',
    lineName: 'Métro Branche Aïn Naâdja (Haï El Badr ↔ Aïn Naâdja)',
    mode: 'metro',
    color: '#C2185B',
    terminusA: 'Haï El Badr',
    terminusB: 'Aïn Naâdja',
    totalStations: 3,
    stationsOrdered: ['Haï El Badr', 'Gué de Constantine', 'Aïn Naâdja'],
    tariffDa: 50,
    frequencyMin: 6,
    operatingHours: '05:00 - 23:00'
  },

  // --- TRAMWAY D'ALGER ---
  {
    lineId: 'tram_t1',
    lineName: 'Tramway T1 (Les Fusillés ↔ Dergana Centre)',
    mode: 'tram',
    color: '#1976D2',
    terminusA: 'Les Fusillés (Ruisseau)',
    terminusB: 'Dergana Centre',
    totalStations: 25,
    stationsOrdered: [
      'Les Fusillés (Ruisseau)', 'Tripoli - Maaza', 'Tripoli - Mosquée', 'Tripoli - Hamadache',
      'Tripoli - Thaalibia', 'Cité Mokhtar Zerhouni (Les Bananiers)', 'Caroubier', 'La Glacière',
      "El Harrach - Pont de l'Est", 'Belfort', 'Hassan Badi', 'Cité 5 Juillet',
      "Bab Ezzouar - Pont d'El Harrach", 'Université de Bab Ezzouar (USTHB)', 'Bab Ezzouar - Cité 8 Mai 1945',
      'Bab Ezzouar - Centre Commercial', 'Cité Universitaire CUB2', 'Smaïl Yefsah', 'Cité 206 Logements',
      'Bordj El Kiffan Centre', 'Mouhous', 'Mimouni Hamoud', "Ben M'red", 'Zerhouni Mokhtar', 'Dergana Centre'
    ],
    tariffDa: 40,
    frequencyMin: 6,
    operatingHours: '05:30 - 23:30'
  },

  // --- SNTF RER TRAINS ---
  {
    lineId: 'train_rer_est',
    lineName: 'SNTF RER Banlieue Est (Alger Gare ↔ Boumerdès ↔ Thénia)',
    mode: 'train',
    color: '#388E3C',
    terminusA: 'Alger Gare Royale / Centrale',
    terminusB: 'Thénia Terminus',
    totalStations: 16,
    stationsOrdered: [
      'Alger Gare Royale / Centrale', 'Agha Gare SNTF', "Ateliers de l'ALN", 'Hussein Dey Gare',
      'Caroubier Gare SNTF', 'El Harrach Gare SNTF', 'Oued Smar Gare SNTF', 'Bab Ezzouar Gare SNTF',
      'Dar El Beïda Gare SNTF', 'Rouïba Ville', 'Rouïba Zone Industrielle', 'Réghaïa Ville',
      'Réghaïa Zone Industrielle', 'Boudouaou Gare', 'Boumerdès Gare', 'Thénia Terminus'
    ],
    tariffDa: 45,
    frequencyMin: 15,
    operatingHours: '05:40 - 21:30'
  },
  {
    lineId: 'train_rer_aeroport',
    lineName: "Navette Express Aéroport (Alger Gare ↔ Aéroport Houari Boumediene)",
    mode: 'train',
    color: '#059669',
    terminusA: 'Alger Gare Royale / Centrale',
    terminusB: "Gare SNTF Aéroport d'Alger",
    totalStations: 5,
    stationsOrdered: ['Alger Gare Royale / Centrale', 'Agha Gare SNTF', 'El Harrach Gare SNTF', 'Bab Ezzouar Gare SNTF', "Gare SNTF Aéroport d'Alger"],
    tariffDa: 80,
    frequencyMin: 30,
    operatingHours: '05:00 - 22:30'
  },
  {
    lineId: 'train_rer_ouest',
    lineName: 'SNTF RER Banlieue Ouest (Alger Gare ↔ Zéralda)',
    mode: 'train',
    color: '#00796B',
    terminusA: 'Alger Gare Royale / Centrale',
    terminusB: 'Zéralda Gare SNTF',
    totalStations: 8,
    stationsOrdered: [
      'Alger Gare Royale / Centrale', 'Agha Gare SNTF', 'Ateliers ALN', 'Birtouta Gare',
      'Tessala El Merdja', 'Sidi Abdellah Université', 'Sidi Abdellah Zéralda', 'Zéralda Gare SNTF'
    ],
    tariffDa: 45,
    frequencyMin: 20,
    operatingHours: '05:50 - 21:00'
  },

  // --- TÉLÉPHÉRIQUES & TÉLÉCABINES ---
  {
    lineId: 'tel_memorial',
    lineName: 'Téléphérique du Mémorial (Jardin d\'Essai ↔ Maqam Echahid)',
    mode: 'telepherique',
    color: '#9333EA',
    terminusA: 'Jardin d\'Essai (Station Basse)',
    terminusB: 'Maqam Echahid (Mémorial du Martyr)',
    totalStations: 2,
    stationsOrdered: ['Jardin d\'Essai (Station Basse)', 'Maqam Echahid (Mémorial du Martyr)'],
    tariffDa: 30,
    frequencyMin: 3,
    operatingHours: '06:00 - 19:00'
  },
  {
    lineId: 'tel_palais',
    lineName: 'Téléphérique Palais du Peuple (Telemly ↔ Hamma)',
    mode: 'telepherique',
    color: '#A855F7',
    terminusA: 'Palais du Peuple (Telemly)',
    terminusB: 'Hamma Station Téléphérique',
    totalStations: 2,
    stationsOrdered: ['Palais du Peuple (Telemly)', 'Hamma Station Téléphérique'],
    tariffDa: 30,
    frequencyMin: 3,
    operatingHours: '06:00 - 19:00'
  },
  {
    lineId: 'tel_nd_afrique',
    lineName: 'Téléphérique Notre Dame d\'Afrique (Bolo ↔ Basilique)',
    mode: 'telepherique',
    color: '#7E22CE',
    terminusA: 'Bologhine Station Basse',
    terminusB: 'Basilique Notre Dame d\'Afrique',
    totalStations: 2,
    stationsOrdered: ['Bologhine Station Basse', 'Basilique Notre Dame d\'Afrique'],
    tariffDa: 30,
    frequencyMin: 3,
    operatingHours: '06:00 - 19:00'
  },
  {
    lineId: 'tel_bouzareah',
    lineName: 'Télécabine Oued Koriche (Triolet ↔ Bouzaréah)',
    mode: 'telepherique',
    color: '#6B21A8',
    terminusA: 'Triolet Bab El Oued',
    terminusB: 'Bouzaréah Faculté',
    totalStations: 3,
    stationsOrdered: ['Triolet Bab El Oued', 'Frais Vallon', 'Bouzaréah Faculté'],
    tariffDa: 30,
    frequencyMin: 3,
    operatingHours: '06:00 - 19:00'
  },

  // --- BUS ETUSA MAJEURS ---
  {
    lineId: 'bus_etusa_02',
    lineName: 'Ligne ETUSA 02 (Place des Martyrs ↔ Telemly ↔ 1er Mai)',
    mode: 'bus',
    color: '#F59E0B',
    terminusA: 'Place des Martyrs',
    terminusB: '1er Mai',
    totalStations: 4,
    stationsOrdered: ['Place des Martyrs', 'Maurice Audin', 'Telemly', '1er Mai'],
    tariffDa: 20,
    frequencyMin: 10,
    operatingHours: '05:30 - 22:30'
  },
  {
    lineId: 'bus_etusa_11',
    lineName: 'Ligne ETUSA 11 (1er Mai ↔ El Biar ↔ Ben Aknoun ↔ Chéraga)',
    mode: 'bus',
    color: '#D97706',
    terminusA: '1er Mai',
    terminusB: 'Chéraga Centre',
    totalStations: 5,
    stationsOrdered: ['1er Mai', 'El Biar Place', 'Ben Aknoun Gare', 'Dely Ibrahim', 'Chéraga Centre'],
    tariffDa: 30,
    frequencyMin: 10,
    operatingHours: '05:30 - 22:30'
  },
  {
    lineId: 'bus_etusa_65',
    lineName: 'Ligne ETUSA 65 (Tafourah ↔ Hydra ↔ Birmandreis)',
    mode: 'bus',
    color: '#B45309',
    terminusA: 'Tafourah Grande Poste',
    terminusB: 'Bir Mourad Raïs (Birmandreis)',
    totalStations: 4,
    stationsOrdered: ['Tafourah Grande Poste', 'Maurice Audin', 'Hydra Place', 'Bir Mourad Raïs (Birmandreis)'],
    tariffDa: 25,
    frequencyMin: 12,
    operatingHours: '05:30 - 22:30'
  },

  // --- PRIVATE BUS LINES ("Bus Privés") ---
  {
    lineId: 'bus_priv_p5',
    lineName: 'Bus Privé P5 (Baraki ↔ Gué de Constantine ↔ El Harrach)',
    mode: 'bus_priv',
    color: '#00ACC1',
    terminusA: 'Baraki Centre (Privé)',
    terminusB: 'El Harrach Centre (Privé)',
    totalStations: 3,
    stationsOrdered: ['Baraki Centre (Privé)', 'Gué de Constantine (Métro)', 'El Harrach Centre (Privé)'],
    tariffDa: 35,
    frequencyMin: 8,
    operatingHours: '06:00 - 20:30'
  },
  {
    lineId: 'bus_priv_p9',
    lineName: 'Bus Privé P9 (Birtouta ↔ Saoula ↔ Birkhadem ↔ 1er Mai)',
    mode: 'bus_priv',
    color: '#00838F',
    terminusA: 'Birtouta Centre',
    terminusB: '1er Mai Station (Privé)',
    totalStations: 4,
    stationsOrdered: ['Birtouta Centre', 'Saoula Centre', 'Birkhadem Centre', '1er Mai Station (Privé)'],
    tariffDa: 35,
    frequencyMin: 10,
    operatingHours: '06:00 - 20:30'
  },
  {
    lineId: 'bus_etusa_107',
    lineName: 'Ligne ETUSA 107 (1er Mai ↔ Birkhadem ↔ Saoula ↔ Birtouta)',
    mode: 'bus',
    color: '#B45309',
    terminusA: '1er Mai',
    terminusB: 'Birtouta Centre',
    totalStations: 4,
    stationsOrdered: ['1er Mai', 'Birkhadem', 'Saoula', 'Birtouta Centre'],
    tariffDa: 30,
    frequencyMin: 12,
    operatingHours: '05:30 - 21:30'
  },
  {
    lineId: 'bus_etusa_72',
    lineName: 'Ligne ETUSA 72 (Ben Aknoun ↔ Dely Ibrahim ↔ Chéraga ↔ Staouéli)',
    mode: 'bus',
    color: '#EA580C',
    terminusA: 'Ben Aknoun Gare',
    terminusB: 'Staouéli Centre',
    totalStations: 4,
    stationsOrdered: ['Ben Aknoun Gare', 'Dely Ibrahim', 'Chéraga Centre', 'Staouéli Centre'],
    tariffDa: 30,
    frequencyMin: 10,
    operatingHours: '05:30 - 21:30'
  },
  {
    lineId: 'bus_etusa_101',
    lineName: 'Ligne ETUSA 101 (Place des Martyrs ↔ Aïn Benian ↔ Staouéli ↔ Zéralda)',
    mode: 'bus',
    color: '#F59E0B',
    terminusA: 'Place des Martyrs',
    terminusB: 'Zéralda Ville',
    totalStations: 4,
    stationsOrdered: ['Place des Martyrs', 'Aïn Benian', 'Staouéli Centre', 'Zéralda Ville'],
    tariffDa: 35,
    frequencyMin: 15,
    operatingHours: '05:30 - 21:30'
  },
  {
    lineId: 'bus_priv_p18',
    lineName: 'Bus Privé P18 (Chevalley ↔ Dely Ibrahim ↔ Chéraga ↔ Aïn Benian)',
    mode: 'bus_priv',
    color: '#00B8D4',
    terminusA: 'Chevalley',
    terminusB: 'Aïn Benian',
    totalStations: 4,
    stationsOrdered: ['Chevalley', 'Dely Ibrahim', 'Chéraga Centre', 'Aïn Benian'],
    tariffDa: 35,
    frequencyMin: 10,
    operatingHours: '06:00 - 20:30'
  },
  {
    lineId: 'bus_priv_p19',
    lineName: 'Bus Privé P19 (Ben Aknoun ↔ Birmandreis ↔ Kouba ↔ Ruisseau)',
    mode: 'bus_priv',
    color: '#0097A7',
    terminusA: 'Ben Aknoun Gare',
    terminusB: 'Ruisseau Interchange',
    totalStations: 4,
    stationsOrdered: ['Ben Aknoun Gare', 'Birmandreis', 'Kouba La Croix', 'Ruisseau Interchange'],
    tariffDa: 35,
    frequencyMin: 10,
    operatingHours: '06:00 - 20:30'
  }
];

// Helper function to export Excel-formatted CSV string
export function exportExcelCSV(): string {
  const headers = ['ID Ligne', 'Nom Ligne', 'Mode Transport', 'Terminus A (Départ)', 'Terminus B (Arrivée)', 'Nb Arrêts', 'Arrêts Traversés', 'Tarif (DA)', 'Fréquence (min)', 'Horaires'];
  const rows = EXCEL_TRANSIT_DATASET.map(row => [
    `"${row.lineId}"`,
    `"${row.lineName}"`,
    `"${row.mode.toUpperCase()}"`,
    `"${row.terminusA}"`,
    `"${row.terminusB}"`,
    row.totalStations,
    `"${row.stationsOrdered.join(' -> ')}"`,
    row.tariffDa,
    row.frequencyMin,
    `"${row.operatingHours}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
