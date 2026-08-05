import { Station, LineData } from './types';

export interface WilayaConfig {
  code: number;
  name: string;
  nameAr: string;
  lat: number;
  lng: number;
  zoom: number;
}

export const ALGERIA_WILAYAS: WilayaConfig[] = [
  { code: 16, name: 'Alger', nameAr: 'الجزائر (العاصمة)', lat: 36.7538, lng: 3.0588, zoom: 12 },
  { code: 31, name: 'Oran', nameAr: 'وهران', lat: 35.6976, lng: -0.6337, zoom: 13 },
  { code: 25, name: 'Constantine', nameAr: 'قسنطينة', lat: 36.3650, lng: 6.6147, zoom: 13 },
  { code: 23, name: 'Annaba', nameAr: 'عنابة', lat: 36.9000, lng: 7.7667, zoom: 13 },
  { code: 19, name: 'Sétif', nameAr: 'سطيف', lat: 36.1911, lng: 5.4081, zoom: 13 },
  { code: 22, name: 'Sidi Bel Abbès', nameAr: 'سيدي بلعباس', lat: 35.1899, lng: -0.6308, zoom: 13 },
  { code: 27, name: 'Mostaganem', nameAr: 'مستغانم', lat: 35.9333, lng: 0.0900, zoom: 13 },
  { code: 30, name: 'Ouargla', nameAr: 'ورقلة', lat: 31.9500, lng: 5.3167, zoom: 13 },
  { code: 9, name: 'Blida', nameAr: 'البليدة', lat: 36.4700, lng: 2.8300, zoom: 13 },
  { code: 35, name: 'Boumerdès', nameAr: 'بومرداس', lat: 36.7667, lng: 3.4667, zoom: 13 },
  { code: 13, name: 'Tlemcen', nameAr: 'تلمسان', lat: 34.8783, lng: -1.3150, zoom: 13 },
];

export const NATIONAL_STATIONS: Station[] = [
  // --- WILAYA 31: ORAN ---
  {
    id: 'o_sidi_said',
    name: 'Sidi Saïd (Sénia Terminus Tram)',
    nameAr: 'محطة سيدي سعيد (السنية)',
    type: 'tram',
    lat: 35.6420,
    lng: -0.6210,
    lines: ['Tramway d\'Oran T1'],
    connections: ['o_senia_centre'],
    schedule: { firstDeparture: '05:30', lastDeparture: '23:00', frequencyPeak: 6, frequencyOffPeak: 12 },
    wilayaCode: 31,
    wilayaName: 'Oran'
  },
  {
    id: 'o_senia_centre',
    name: 'Es Sénia Centre',
    nameAr: 'السنية وسط',
    type: 'tram',
    lat: 35.6510,
    lng: -0.6280,
    lines: ['Tramway d\'Oran T1'],
    connections: ['o_sidi_said', 'o_usto'],
    schedule: { firstDeparture: '05:30', lastDeparture: '23:00', frequencyPeak: 6, frequencyOffPeak: 12 },
    wilayaCode: 31,
    wilayaName: 'Oran'
  },
  {
    id: 'o_usto',
    name: 'Université USTO Mohamed Boudiaf',
    nameAr: 'جامعة إيسطو محمد بوضياف',
    type: 'tram',
    lat: 35.6880,
    lng: -0.5980,
    lines: ['Tramway d\'Oran T1'],
    connections: ['o_senia_centre', 'o_gare_sntf'],
    schedule: { firstDeparture: '05:30', lastDeparture: '23:00', frequencyPeak: 6, frequencyOffPeak: 12 },
    wilayaCode: 31,
    wilayaName: 'Oran'
  },
  {
    id: 'o_gare_sntf',
    name: 'Gare SNTF Oran Ville',
    nameAr: 'محطة القطار وهران',
    type: 'train',
    lat: 35.6980,
    lng: -0.6380,
    lines: ['Tramway d\'Oran T1', 'SNTF RER Oran - Arzew'],
    connections: ['o_usto', 'o_place_armes'],
    schedule: { firstDeparture: '05:30', lastDeparture: '23:00', frequencyPeak: 6, frequencyOffPeak: 12 },
    wilayaCode: 31,
    wilayaName: 'Oran'
  },
  {
    id: 'o_place_armes',
    name: 'Place d\'Armes (Hôtel de Ville Oran)',
    nameAr: 'ساحة أول نوفمبر (وهران)',
    type: 'tram',
    lat: 35.7030,
    lng: -0.6480,
    lines: ['Tramway d\'Oran T1'],
    connections: ['o_gare_sntf', 'o_tel_base'],
    schedule: { firstDeparture: '05:30', lastDeparture: '23:00', frequencyPeak: 6, frequencyOffPeak: 12 },
    wilayaCode: 31,
    wilayaName: 'Oran'
  },
  {
    id: 'o_tel_base',
    name: 'Téléphérique Oran (Station Planteurs)',
    nameAr: 'تلفريك وهران (محطة الصنوبر)',
    type: 'telepherique',
    lat: 35.7040,
    lng: -0.6620,
    lines: ['Téléphérique de Murdjajo'],
    connections: ['o_place_armes', 'o_tel_murdjajo'],
    schedule: { firstDeparture: '07:30', lastDeparture: '19:30', frequencyPeak: 4, frequencyOffPeak: 8 },
    wilayaCode: 31,
    wilayaName: 'Oran'
  },
  {
    id: 'o_tel_murdjajo',
    name: 'Téléphérique Sommet Murdjajo (Santa Cruz)',
    nameAr: 'تلفريك جبل مرجاجو سانتا كروز',
    type: 'telepherique',
    lat: 35.7090,
    lng: -0.6660,
    lines: ['Téléphérique de Murdjajo'],
    connections: ['o_tel_base'],
    schedule: { firstDeparture: '07:30', lastDeparture: '19:30', frequencyPeak: 4, frequencyOffPeak: 8 },
    wilayaCode: 31,
    wilayaName: 'Oran'
  },

  // --- WILAYA 25: CONSTANTINE ---
  {
    id: 'c_ramdane',
    name: 'Station Gare SNTF Ramdane Djamel',
    nameAr: 'محطة رمضان جمال قسنطينة',
    type: 'tram',
    lat: 36.3680,
    lng: 6.6120,
    lines: ['Tramway de Constantine T1'],
    connections: ['c_zouaghi'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:30', frequencyPeak: 5, frequencyOffPeak: 10 },
    wilayaCode: 25,
    wilayaName: 'Constantine'
  },
  {
    id: 'c_zouaghi',
    name: 'Station Interchange Zouaghi Slimane',
    nameAr: 'محطة زواغي سليمان',
    type: 'tram',
    lat: 36.3350,
    lng: 6.6250,
    lines: ['Tramway de Constantine T1'],
    connections: ['c_ramdane', 'c_ali_mendjeli'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:30', frequencyPeak: 5, frequencyOffPeak: 10 },
    wilayaCode: 25,
    wilayaName: 'Constantine'
  },
  {
    id: 'c_ali_mendjeli',
    name: 'Nouvelle Ville Ali Mendjeli (Univ 2)',
    nameAr: 'المدينة الجديدة علي منجلي',
    type: 'tram',
    lat: 36.2550,
    lng: 6.5780,
    lines: ['Tramway de Constantine T1'],
    connections: ['c_zouaghi'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:30', frequencyPeak: 5, frequencyOffPeak: 10 },
    wilayaCode: 25,
    wilayaName: 'Constantine'
  },
  {
    id: 'c_tel_khemisti',
    name: 'Téléphérique Constantine (Tatache Khemisti)',
    nameAr: 'تلفريك قسنطينة خميستي',
    type: 'telepherique',
    lat: 36.3670,
    lng: 6.6180,
    lines: ['Téléphérique de Constantine'],
    connections: ['c_tel_chu'],
    schedule: { firstDeparture: '07:00', lastDeparture: '19:00', frequencyPeak: 3, frequencyOffPeak: 6 },
    wilayaCode: 25,
    wilayaName: 'Constantine'
  },
  {
    id: 'c_tel_chu',
    name: 'Téléphérique CHU Ben Badis Constantine',
    nameAr: 'تلفريك المستشفى الجامعي ابن باديس',
    type: 'telepherique',
    lat: 36.3710,
    lng: 6.6210,
    lines: ['Téléphérique de Constantine'],
    connections: ['c_tel_khemisti'],
    schedule: { firstDeparture: '07:00', lastDeparture: '19:00', frequencyPeak: 3, frequencyOffPeak: 6 },
    wilayaCode: 25,
    wilayaName: 'Constantine'
  },

  // --- WILAYA 19: SÉTIF ---
  {
    id: 's_chouli',
    name: 'Station Oued Chouli Sétif',
    nameAr: 'محطة واد شولي سطيف',
    type: 'tram',
    lat: 36.1950,
    lng: 5.4120,
    lines: ['Tramway de Sétif Ligne 1'],
    connections: ['s_univ_ferhat'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:30', frequencyPeak: 6, frequencyOffPeak: 12 },
    wilayaCode: 19,
    wilayaName: 'Sétif'
  },
  {
    id: 's_univ_ferhat',
    name: 'Université Ferhat Abbas (El Maabouda)',
    nameAr: 'جامعة فرحات عباس سطيف',
    type: 'tram',
    lat: 36.1910,
    lng: 5.4050,
    lines: ['Tramway de Sétif Ligne 1'],
    connections: ['s_chouli', 's_11_decembre'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:30', frequencyPeak: 6, frequencyOffPeak: 12 },
    wilayaCode: 19,
    wilayaName: 'Sétif'
  },
  {
    id: 's_11_decembre',
    name: 'Terminus Cité 11 Décembre Sétif',
    nameAr: 'محطة 11 ديسمبر سطيف',
    type: 'tram',
    lat: 36.1850,
    lng: 5.3950,
    lines: ['Tramway de Sétif Ligne 1'],
    connections: ['s_univ_ferhat'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:30', frequencyPeak: 6, frequencyOffPeak: 12 },
    wilayaCode: 19,
    wilayaName: 'Sétif'
  },

  // --- WILAYA 22: SIDI BEL ABBÈS ---
  {
    id: 'sba_gare_sud',
    name: 'Gare Routière Sud Sidi Bel Abbès',
    nameAr: 'المحطة البرية جنوب سيدي بلعباس',
    type: 'tram',
    lat: 35.1850,
    lng: -0.6350,
    lines: ['Tramway de Sidi Bel Abbès'],
    connections: ['sba_mairie'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:30', frequencyPeak: 7, frequencyOffPeak: 14 },
    wilayaCode: 22,
    wilayaName: 'Sidi Bel Abbès'
  },
  {
    id: 'sba_mairie',
    name: 'Place de la Mairie Sidi Bel Abbès',
    nameAr: 'ساحة البلدية سيدي بلعباس',
    type: 'tram',
    lat: 35.1910,
    lng: -0.6300,
    lines: ['Tramway de Sidi Bel Abbès'],
    connections: ['sba_gare_sud', 'sba_univ'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:30', frequencyPeak: 7, frequencyOffPeak: 14 },
    wilayaCode: 22,
    wilayaName: 'Sidi Bel Abbès'
  },
  {
    id: 'sba_univ',
    name: 'Université Djillali Liabès',
    nameAr: 'جامعة جيلالي ليابس',
    type: 'tram',
    lat: 35.1980,
    lng: -0.6210,
    lines: ['Tramway de Sidi Bel Abbès'],
    connections: ['sba_mairie'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:30', frequencyPeak: 7, frequencyOffPeak: 14 },
    wilayaCode: 22,
    wilayaName: 'Sidi Bel Abbès'
  },

  // --- WILAYA 27: MOSTAGANEM ---
  {
    id: 'm_salamandre',
    name: 'Station Salamandre Mostaganem',
    nameAr: 'محطة صلاماندر مستغانم',
    type: 'tram',
    lat: 35.9220,
    lng: 0.0820,
    lines: ['Tramway de Mostaganem L1'],
    connections: ['m_gare_sntf_m'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:30', frequencyPeak: 8, frequencyOffPeak: 15 },
    wilayaCode: 27,
    wilayaName: 'Mostaganem'
  },
  {
    id: 'm_gare_sntf_m',
    name: 'Gare SNTF Mostaganem Centre',
    nameAr: 'محطة القطار مستغانم',
    type: 'tram',
    lat: 35.9340,
    lng: 0.0910,
    lines: ['Tramway de Mostaganem L1'],
    connections: ['m_salamandre', 'm_kharouba'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:30', frequencyPeak: 8, frequencyOffPeak: 15 },
    wilayaCode: 27,
    wilayaName: 'Mostaganem'
  },
  {
    id: 'm_kharouba',
    name: 'Université Kharouba Mostaganem',
    nameAr: 'جامعة خروبة مستغانم',
    type: 'tram',
    lat: 35.9450,
    lng: 0.1050,
    lines: ['Tramway de Mostaganem L1'],
    connections: ['m_gare_sntf_m'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:30', frequencyPeak: 8, frequencyOffPeak: 15 },
    wilayaCode: 27,
    wilayaName: 'Mostaganem'
  },

  // --- WILAYA 30: OUARGLA ---
  {
    id: 'w_27_fevrier',
    name: 'Cité 27 Février Ouargla',
    nameAr: 'حي 27 فبراير ورقلة',
    type: 'tram',
    lat: 31.9420,
    lng: 5.3050,
    lines: ['Tramway de Ouargla'],
    connections: ['w_ksar'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:00', frequencyPeak: 8, frequencyOffPeak: 16 },
    wilayaCode: 30,
    wilayaName: 'Ouargla'
  },
  {
    id: 'w_ksar',
    name: 'Ksar Ouargla Centre',
    nameAr: 'قصر ورقلة المركز',
    type: 'tram',
    lat: 31.9530,
    lng: 5.3210,
    lines: ['Tramway de Ouargla'],
    connections: ['w_27_fevrier', 'w_univ_kasdi'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:00', frequencyPeak: 8, frequencyOffPeak: 16 },
    wilayaCode: 30,
    wilayaName: 'Ouargla'
  },
  {
    id: 'w_univ_kasdi',
    name: 'Université Kasdi Merbah Ouargla',
    nameAr: 'جامعة قاصدي مرباح ورقلة',
    type: 'tram',
    lat: 31.9650,
    lng: 5.3350,
    lines: ['Tramway de Ouargla'],
    connections: ['w_ksar'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:00', frequencyPeak: 8, frequencyOffPeak: 16 },
    wilayaCode: 30,
    wilayaName: 'Ouargla'
  },

  // --- WILAYA 23: ANNABA ---
  {
    id: 'an_tel_base',
    name: 'Téléphérique Annaba Base',
    nameAr: 'تلفريك عنابة المحطة السفلى',
    type: 'telepherique',
    lat: 36.8980,
    lng: 7.7550,
    lines: ['Téléphérique de Seraïdi'],
    connections: ['an_tel_seraidi'],
    schedule: { firstDeparture: '07:30', lastDeparture: '19:00', frequencyPeak: 5, frequencyOffPeak: 10 },
    wilayaCode: 23,
    wilayaName: 'Annaba'
  },
  {
    id: 'an_tel_seraidi',
    name: 'Sommet Seraïdi Annaba',
    nameAr: 'سرايدي أعالي عنابة',
    type: 'telepherique',
    lat: 36.9150,
    lng: 7.6680,
    lines: ['Téléphérique de Seraïdi'],
    connections: ['an_tel_base'],
    schedule: { firstDeparture: '07:30', lastDeparture: '19:00', frequencyPeak: 5, frequencyOffPeak: 10 },
    wilayaCode: 23,
    wilayaName: 'Annaba'
  },

  // --- WILAYA 09: BLIDA ---
  {
    id: 'bl_gare_sntf',
    name: 'Gare SNTF Blida Centre',
    nameAr: 'محطة القطار البليدة',
    type: 'train',
    lat: 36.4720,
    lng: 2.8310,
    lines: ['SNTF RER Banlieue Ouest'],
    connections: ['bl_chrea_base'],
    schedule: { firstDeparture: '05:30', lastDeparture: '21:30', frequencyPeak: 15, frequencyOffPeak: 30 },
    wilayaCode: 9,
    wilayaName: 'Blida'
  },
  {
    id: 'bl_chrea_base',
    name: 'Téléphérique Blida Station Basse',
    nameAr: 'تلفريك الشريعة المحطة السفلى',
    type: 'telepherique',
    lat: 36.4650,
    lng: 2.8250,
    lines: ['Téléphérique de Chréa'],
    connections: ['bl_gare_sntf', 'bl_chrea_sommet'],
    schedule: { firstDeparture: '08:00', lastDeparture: '18:00', frequencyPeak: 10, frequencyOffPeak: 20 },
    wilayaCode: 9,
    wilayaName: 'Blida'
  },
  {
    id: 'bl_chrea_sommet',
    name: 'Station Téléphérique Sommet Chréa',
    nameAr: 'محطة حديقة الشريعة الوطنية',
    type: 'telepherique',
    lat: 36.4250,
    lng: 2.8750,
    lines: ['Téléphérique de Chréa'],
    connections: ['bl_chrea_base'],
    schedule: { firstDeparture: '08:00', lastDeparture: '18:00', frequencyPeak: 10, frequencyOffPeak: 20 },
    wilayaCode: 9,
    wilayaName: 'Blida'
  },

  // --- WILAYA 13: TLEMCEN ---
  {
    id: 'tl_tel_base',
    name: 'Téléphérique Tlemcen Ville',
    nameAr: 'تلفريك تلمسان المدينة',
    type: 'telepherique',
    lat: 34.8820,
    lng: -1.3120,
    lines: ['Téléphérique Lalla Setti'],
    connections: ['tl_lalla_setti'],
    schedule: { firstDeparture: '07:30', lastDeparture: '19:30', frequencyPeak: 4, frequencyOffPeak: 8 },
    wilayaCode: 13,
    wilayaName: 'Tlemcen'
  },
  {
    id: 'tl_lalla_setti',
    name: 'Plateau Lalla Setti Tlemcen',
    nameAr: 'هضبة لالة ستي تلمسان',
    type: 'telepherique',
    lat: 34.8680,
    lng: -1.3190,
    lines: ['Téléphérique Lalla Setti'],
    connections: ['tl_tel_base'],
    schedule: { firstDeparture: '07:30', lastDeparture: '19:30', frequencyPeak: 4, frequencyOffPeak: 8 },
    wilayaCode: 13,
    wilayaName: 'Tlemcen'
  }
];

export const NATIONAL_LINES: LineData[] = [
  // --- ORAN ---
  {
    id: 'tram_oran_t1',
    name: 'Tramway d\'Oran T1 (Sidi Saïd ↔ Es Sénia ↔ USTO ↔ Place d\'Armes)',
    type: 'tram',
    color: '#D97706',
    stations: ['o_sidi_said', 'o_senia_centre', 'o_usto', 'o_gare_sntf', 'o_place_armes'],
    wilayaCode: 31,
    wilayaName: 'Oran'
  },
  {
    id: 'tel_oran_murdjajo',
    name: 'Téléphérique de Murdjajo (Planteurs ↔ Sommet Santa Cruz)',
    type: 'telepherique',
    color: '#9333EA',
    stations: ['o_tel_base', 'o_tel_murdjajo'],
    wilayaCode: 31,
    wilayaName: 'Oran'
  },

  // --- CONSTANTINE ---
  {
    id: 'tram_constantine_t1',
    name: 'Tramway de Constantine T1 (Ramdane Djamel ↔ Zouaghi ↔ Ali Mendjeli)',
    type: 'tram',
    color: '#2563EB',
    stations: ['c_ramdane', 'c_zouaghi', 'c_ali_mendjeli'],
    wilayaCode: 25,
    wilayaName: 'Constantine'
  },
  {
    id: 'tel_constantine',
    name: 'Téléphérique de Constantine (Tatache Khemisti ↔ CHU Ben Badis)',
    type: 'telepherique',
    color: '#9333EA',
    stations: ['c_tel_khemisti', 'c_tel_chu'],
    wilayaCode: 25,
    wilayaName: 'Constantine'
  },

  // --- SÉTIF ---
  {
    id: 'tram_setif_t1',
    name: 'Tramway de Sétif T1 (Oued Chouli ↔ Univ Ferhat Abbas ↔ 11 Décembre)',
    type: 'tram',
    color: '#059669',
    stations: ['s_chouli', 's_univ_ferhat', 's_11_decembre'],
    wilayaCode: 19,
    wilayaName: 'Sétif'
  },

  // --- SIDI BEL ABBÈS ---
  {
    id: 'tram_sba_t1',
    name: 'Tramway de Sidi Bel Abbès (Gare Sud ↔ Mairie ↔ Univ Djillali Liabès)',
    type: 'tram',
    color: '#0284C7',
    stations: ['sba_gare_sud', 'sba_mairie', 'sba_univ'],
    wilayaCode: 22,
    wilayaName: 'Sidi Bel Abbès'
  },

  // --- MOSTAGANEM ---
  {
    id: 'tram_mosta_t1',
    name: 'Tramway de Mostaganem T1 (Salamandre ↔ Gare SNTF ↔ Univ Kharouba)',
    type: 'tram',
    color: '#0D9488',
    stations: ['m_salamandre', 'm_gare_sntf_m', 'm_kharouba'],
    wilayaCode: 27,
    wilayaName: 'Mostaganem'
  },

  // --- OUARGLA ---
  {
    id: 'tram_ouargla_t1',
    name: 'Tramway de Ouargla T1 (Cité 27 Février ↔ Ksar ↔ Univ Kasdi Merbah)',
    type: 'tram',
    color: '#D97706',
    stations: ['w_27_fevrier', 'w_ksar', 'w_univ_kasdi'],
    wilayaCode: 30,
    wilayaName: 'Ouargla'
  },

  // --- ANNABA ---
  {
    id: 'tel_annaba_seraidi',
    name: 'Téléphérique de Seraïdi (Annaba Base ↔ Sommet Seraïdi)',
    type: 'telepherique',
    color: '#9333EA',
    stations: ['an_tel_base', 'an_tel_seraidi'],
    wilayaCode: 23,
    wilayaName: 'Annaba'
  },

  // --- BLIDA ---
  {
    id: 'tel_blida_chrea',
    name: 'Téléphérique de Chréa (Blida Base ↔ Sommet Parc Chréa)',
    type: 'telepherique',
    color: '#9333EA',
    stations: ['bl_chrea_base', 'bl_chrea_sommet'],
    wilayaCode: 9,
    wilayaName: 'Blida'
  },

  // --- TLEMCEN ---
  {
    id: 'tel_tlemcen_lalla',
    name: 'Téléphérique Lalla Setti (Tlemcen Ville ↔ Plateau Lalla Setti)',
    type: 'telepherique',
    color: '#9333EA',
    stations: ['tl_tel_base', 'tl_lalla_setti'],
    wilayaCode: 13,
    wilayaName: 'Tlemcen'
  }
];
