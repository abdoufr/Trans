import { Station, LineData, Disruption } from './types';

export const STATIONS: Station[] = [
  // --- METRO LINE 1 & BRANCHES ---
  {
    id: 'm_martyrs',
    name: 'Place des Martyrs',
    nameAr: 'ساحة الشهداء',
    type: 'metro',
    lat: 36.7801,
    lng: 3.0601,
    lines: ['M1'],
    connections: ['m_boumendjel', 'b_martyrs', 'bp_martyrs', 'b_bab_el_oued'],
    schedule: { firstDeparture: '05:00', lastDeparture: '23:00', frequencyPeak: 4, frequencyOffPeak: 8 }
  },
  {
    id: 'm_boumendjel',
    name: 'Ali Boumendjel',
    nameAr: 'علي بومنجل',
    type: 'metro',
    lat: 36.7758,
    lng: 3.0612,
    lines: ['M1'],
    connections: ['m_martyrs', 'm_tafourah'],
    schedule: { firstDeparture: '05:02', lastDeparture: '23:02', frequencyPeak: 4, frequencyOffPeak: 8 }
  },
  {
    id: 'm_tafourah',
    name: 'Tafourah - Grande Poste',
    nameAr: 'تافورة - البريد المركزي',
    type: 'metro',
    lat: 36.7702,
    lng: 3.0583,
    lines: ['M1'],
    connections: ['m_boumendjel', 'm_boukhalfa', 'b_tafourah', 't_agha', 't_alger'],
    schedule: { firstDeparture: '05:05', lastDeparture: '23:05', frequencyPeak: 4, frequencyOffPeak: 8 }
  },
  {
    id: 'm_boukhalfa',
    name: 'Khelifa Boukhalfa',
    nameAr: 'خليفة بوخالفة',
    type: 'metro',
    lat: 36.7645,
    lng: 3.0556,
    lines: ['M1'],
    connections: ['m_tafourah', 'm_mai', 't_agha'],
    schedule: { firstDeparture: '05:07', lastDeparture: '23:07', frequencyPeak: 4, frequencyOffPeak: 8 }
  },
  {
    id: 'm_mai',
    name: '1er Mai',
    nameAr: 'أول ماي',
    type: 'metro',
    lat: 36.7592,
    lng: 3.0520,
    lines: ['M1'],
    connections: ['m_boukhalfa', 'm_idir', 'b_mai', 'bp_mai', 'tel_mai'],
    schedule: { firstDeparture: '05:09', lastDeparture: '23:09', frequencyPeak: 4, frequencyOffPeak: 8 }
  },
  {
    id: 'm_idir',
    name: 'Aïssat Idir',
    nameAr: 'عيسات إيدير',
    type: 'metro',
    lat: 36.7562,
    lng: 3.0501,
    lines: ['M1'],
    connections: ['m_mai', 'm_hamma'],
    schedule: { firstDeparture: '05:11', lastDeparture: '23:11', frequencyPeak: 4, frequencyOffPeak: 8 }
  },
  {
    id: 'm_hamma',
    name: 'Hamma',
    nameAr: 'الحامة',
    type: 'metro',
    lat: 36.7490,
    lng: 3.0605,
    lines: ['M1'],
    connections: ['m_idir', 'm_jardin'],
    schedule: { firstDeparture: '05:13', lastDeparture: '23:13', frequencyPeak: 4, frequencyOffPeak: 8 }
  },
  {
    id: 'm_jardin',
    name: "Jardin d'Essai",
    nameAr: 'حديقة التجارب',
    type: 'metro',
    lat: 36.7461,
    lng: 3.0725,
    lines: ['M1'],
    connections: ['m_hamma', 'm_ruisseau', 'tel_jardin'],
    schedule: { firstDeparture: '05:15', lastDeparture: '23:15', frequencyPeak: 4, frequencyOffPeak: 8 }
  },
  {
    id: 'm_ruisseau',
    name: 'Les Fusillés (Ruisseau - Métro)',
    nameAr: 'العناصر - الرويسو (مترو)',
    type: 'metro',
    lat: 36.7425,
    lng: 3.0825,
    lines: ['M1'],
    connections: ['m_jardin', 'm_amirouche', 'tr_fusilles', 'bp_ruisseau'],
    schedule: { firstDeparture: '05:18', lastDeparture: '23:18', frequencyPeak: 4, frequencyOffPeak: 8 }
  },
  {
    id: 'm_amirouche',
    name: 'Cité Amirouche',
    nameAr: 'حي عميروش',
    type: 'metro',
    lat: 36.7350,
    lng: 3.0970,
    lines: ['M1'],
    connections: ['m_ruisseau', 'm_soleil'],
    schedule: { firstDeparture: '05:21', lastDeparture: '23:21', frequencyPeak: 4, frequencyOffPeak: 8 }
  },
  {
    id: 'm_soleil',
    name: 'Mer et Soleil',
    nameAr: 'البحر والشمس',
    type: 'metro',
    lat: 36.7320,
    lng: 3.1040,
    lines: ['M1'],
    connections: ['m_amirouche', 'm_badr'],
    schedule: { firstDeparture: '05:23', lastDeparture: '23:23', frequencyPeak: 4, frequencyOffPeak: 8 }
  },
  {
    id: 'm_badr',
    name: 'Haï El Badr',
    nameAr: 'حي البدر',
    type: 'metro',
    lat: 36.7245,
    lng: 3.1115,
    lines: ['M1', 'M1-Branche Aïn Naâdja'],
    connections: ['m_soleil', 'm_ateliers', 'm_constantine'],
    schedule: { firstDeparture: '05:26', lastDeparture: '23:26', frequencyPeak: 4, frequencyOffPeak: 8 }
  },
  {
    id: 'm_ateliers',
    name: 'Les Ateliers',
    nameAr: 'الورشات',
    type: 'metro',
    lat: 36.7210,
    lng: 3.1250,
    lines: ['M1'],
    connections: ['m_badr', 'm_harrach_centre'],
    schedule: { firstDeparture: '05:28', lastDeparture: '23:28', frequencyPeak: 5, frequencyOffPeak: 10 }
  },
  {
    id: 'm_harrach_centre',
    name: 'El Harrach Centre',
    nameAr: 'الحراش وسط',
    type: 'metro',
    lat: 36.7280,
    lng: 3.1360,
    lines: ['M1'],
    connections: ['m_ateliers', 'm_harrach_gare', 'bp_harrach_centre', 'b_harrach'],
    schedule: { firstDeparture: '05:31', lastDeparture: '23:31', frequencyPeak: 5, frequencyOffPeak: 10 }
  },
  {
    id: 'm_harrach_gare',
    name: 'El Harrach Gare (Métro)',
    nameAr: 'الحراش محطة القطار (مترو)',
    type: 'metro',
    lat: 36.7225,
    lng: 3.1415,
    lines: ['M1'],
    connections: ['m_harrach_centre', 't_harrach'],
    schedule: { firstDeparture: '05:34', lastDeparture: '23:34', frequencyPeak: 5, frequencyOffPeak: 10 }
  },
  {
    id: 'm_constantine',
    name: 'Gué de Constantine (Métro)',
    nameAr: 'جسر قسنطينة (مترو)',
    type: 'metro',
    lat: 36.7080,
    lng: 3.1280,
    lines: ['M1-Branche Aïn Naâdja'],
    connections: ['m_badr', 'm_nadja', 't_gue_de_constantine', 'bp_baraki'],
    schedule: { firstDeparture: '05:29', lastDeparture: '23:29', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'm_nadja',
    name: 'Aïn Naâdja (Métro)',
    nameAr: 'عين النعجة (مترو)',
    type: 'metro',
    lat: 36.7020,
    lng: 3.1180,
    lines: ['M1-Branche Aïn Naâdja'],
    connections: ['m_constantine', 't_ain_nadja_train'],
    schedule: { firstDeparture: '05:32', lastDeparture: '23:32', frequencyPeak: 6, frequencyOffPeak: 12 }
  },

  // --- TRAMWAY LINES (T1 - COMPLETE 27 STATIONS) ---
  {
    id: 'tr_fusilles',
    name: 'Les Fusillés - Ruisseau (Tramway)',
    nameAr: 'العناصر - الرويسو (ترامواي)',
    type: 'tram',
    lat: 36.7425,
    lng: 3.0825,
    lines: ['Tram T1'],
    connections: ['m_ruisseau', 'tr_maaza', 'bp_ruisseau'],
    schedule: { firstDeparture: '05:30', lastDeparture: '23:15', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_maaza',
    name: 'Tripoli - Maaza',
    nameAr: 'طرابلس - معزة',
    type: 'tram',
    lat: 36.7410,
    lng: 3.0900,
    lines: ['Tram T1'],
    connections: ['tr_fusilles', 'tr_mosquee'],
    schedule: { firstDeparture: '05:34', lastDeparture: '23:19', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_mosquee',
    name: 'Tripoli - Mosquée',
    nameAr: 'طرابلس - المسجد',
    type: 'tram',
    lat: 36.7400,
    lng: 3.0980,
    lines: ['Tram T1'],
    connections: ['tr_maaza', 'tr_hamadache'],
    schedule: { firstDeparture: '05:37', lastDeparture: '23:22', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_hamadache',
    name: 'Tripoli - Hamadache',
    nameAr: 'طرابلس - حماداش',
    type: 'tram',
    lat: 36.7390,
    lng: 3.1050,
    lines: ['Tram T1'],
    connections: ['tr_mosquee', 'tr_thaalibia'],
    schedule: { firstDeparture: '05:40', lastDeparture: '23:25', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_thaalibia',
    name: 'Tripoli - Thaalibia',
    nameAr: 'طرابلس - الثعالبية',
    type: 'tram',
    lat: 36.7380,
    lng: 3.1120,
    lines: ['Tram T1'],
    connections: ['tr_hamadache', 'tr_bananiers'],
    schedule: { firstDeparture: '05:43', lastDeparture: '23:28', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_bananiers',
    name: 'Cité Mokhtar Zerhouni (Les Bananiers)',
    nameAr: 'حي مختار زرهوني (الموز)',
    type: 'tram',
    lat: 36.7370,
    lng: 3.1200,
    lines: ['Tram T1'],
    connections: ['tr_thaalibia', 'tr_caroubier'],
    schedule: { firstDeparture: '05:45', lastDeparture: '23:30', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_caroubier',
    name: 'Caroubier (Tramway)',
    nameAr: 'الخروبة (ترامواي)',
    type: 'tram',
    lat: 36.7360,
    lng: 3.1280,
    lines: ['Tram T1'],
    connections: ['tr_bananiers', 'tr_glaciere', 't_caroubier'],
    schedule: { firstDeparture: '05:48', lastDeparture: '23:33', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_glaciere',
    name: 'La Glacière',
    nameAr: 'المثلجة',
    type: 'tram',
    lat: 36.7340,
    lng: 3.1380,
    lines: ['Tram T1'],
    connections: ['tr_caroubier', 'tr_pont_est'],
    schedule: { firstDeparture: '05:51', lastDeparture: '23:36', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_pont_est',
    name: "El Harrach - Pont de l'Est",
    nameAr: 'الحراش - جسر الشرق',
    type: 'tram',
    lat: 36.7310,
    lng: 3.1480,
    lines: ['Tram T1'],
    connections: ['tr_glaciere', 'tr_belfort'],
    schedule: { firstDeparture: '05:54', lastDeparture: '23:39', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_belfort',
    name: 'Belfort',
    nameAr: 'بلفور',
    type: 'tram',
    lat: 36.7290,
    lng: 3.1550,
    lines: ['Tram T1'],
    connections: ['tr_pont_est', 'tr_badi', 'bp_belfort'],
    schedule: { firstDeparture: '05:56', lastDeparture: '23:41', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_badi',
    name: 'Hassan Badi',
    nameAr: 'حسن بادي',
    type: 'tram',
    lat: 36.7280,
    lng: 3.1610,
    lines: ['Tram T1'],
    connections: ['tr_belfort', 'tr_juillet'],
    schedule: { firstDeparture: '05:58', lastDeparture: '23:43', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_juillet',
    name: '5 Juillet',
    nameAr: '5 جويلية',
    type: 'tram',
    lat: 36.7270,
    lng: 3.1680,
    lines: ['Tram T1'],
    connections: ['tr_badi', 'tr_bab_ezzouar_pont'],
    schedule: { firstDeparture: '06:00', lastDeparture: '23:45', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_bab_ezzouar_pont',
    name: "Bab Ezzouar - Pont d'El Harrach",
    nameAr: 'باب الزوار - جسر الحراش',
    type: 'tram',
    lat: 36.7260,
    lng: 3.1750,
    lines: ['Tram T1'],
    connections: ['tr_juillet', 'tr_usthb'],
    schedule: { firstDeparture: '06:02', lastDeparture: '23:47', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_usthb',
    name: 'Université de Bab Ezzouar (USTHB)',
    nameAr: 'جامعة باب الزوار (USTHB)',
    type: 'tram',
    lat: 36.7190,
    lng: 3.1810,
    lines: ['Tram T1'],
    connections: ['tr_bab_ezzouar_pont', 'tr_cite_8mai', 'bp_bab_ezzouar_fac'],
    schedule: { firstDeparture: '06:06', lastDeparture: '23:51', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_cite_8mai',
    name: 'Cité 8 Mai 1945',
    nameAr: 'حي 8 ماي 1945',
    type: 'tram',
    lat: 36.7140,
    lng: 3.1870,
    lines: ['Tram T1'],
    connections: ['tr_usthb', 'tr_centre_commercial'],
    schedule: { firstDeparture: '06:08', lastDeparture: '23:53', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_centre_commercial',
    name: 'Bab Ezzouar - Centre Commercial',
    nameAr: 'باب الزوار - المركز التجاري',
    type: 'tram',
    lat: 36.7120,
    lng: 3.1950,
    lines: ['Tram T1'],
    connections: ['tr_cite_8mai', 'tr_cite_u', 'bp_bab_ezzouar_centre'],
    schedule: { firstDeparture: '06:10', lastDeparture: '23:55', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_cite_u',
    name: 'Cité Universitaire CUB2',
    nameAr: 'الحي الجامعي CUB2',
    type: 'tram',
    lat: 36.7150,
    lng: 3.2050,
    lines: ['Tram T1'],
    connections: ['tr_centre_commercial', 'tr_smail_yefsah'],
    schedule: { firstDeparture: '06:13', lastDeparture: '23:58', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_smail_yefsah',
    name: 'Smaïl Yefsah',
    nameAr: 'إسماعيل يفصح',
    type: 'tram',
    lat: 36.7180,
    lng: 3.2150,
    lines: ['Tram T1'],
    connections: ['tr_cite_u', 'tr_cite_206'],
    schedule: { firstDeparture: '06:16', lastDeparture: '00:01', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_cite_206',
    name: 'Cité 206 Logements',
    nameAr: 'حي 206 مسكن',
    type: 'tram',
    lat: 36.7280,
    lng: 3.2250,
    lines: ['Tram T1'],
    connections: ['tr_smail_yefsah', 'tr_bordj_kiffan'],
    schedule: { firstDeparture: '06:19', lastDeparture: '00:04', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_bordj_kiffan',
    name: 'Bordj El Kiffan Centre',
    nameAr: 'برج الكيفان وسط',
    type: 'tram',
    lat: 36.7490,
    lng: 3.2350,
    lines: ['Tram T1'],
    connections: ['tr_cite_206', 'tr_mouhous'],
    schedule: { firstDeparture: '06:22', lastDeparture: '00:07', frequencyPeak: 8, frequencyOffPeak: 15 }
  },
  {
    id: 'tr_mouhous',
    name: 'Mouhous',
    nameAr: 'موهوس',
    type: 'tram',
    lat: 36.7520,
    lng: 3.2420,
    lines: ['Tram T1'],
    connections: ['tr_bordj_kiffan', 'tr_mimouni'],
    schedule: { firstDeparture: '06:24', lastDeparture: '00:09', frequencyPeak: 8, frequencyOffPeak: 15 }
  },
  {
    id: 'tr_mimouni',
    name: 'Mimouni Hamoud',
    nameAr: 'ميموني حمود',
    type: 'tram',
    lat: 36.7550,
    lng: 3.2480,
    lines: ['Tram T1'],
    connections: ['tr_mouhous', 'tr_ben_mred'],
    schedule: { firstDeparture: '06:26', lastDeparture: '00:11', frequencyPeak: 8, frequencyOffPeak: 15 }
  },
  {
    id: 'tr_ben_mred',
    name: "Ben M'red",
    nameAr: "بن مراد",
    type: 'tram',
    lat: 36.7580,
    lng: 3.2550,
    lines: ['Tram T1'],
    connections: ['tr_mimouni', 'tr_zerhouni'],
    schedule: { firstDeparture: '06:28', lastDeparture: '00:13', frequencyPeak: 8, frequencyOffPeak: 15 }
  },
  {
    id: 'tr_zerhouni',
    name: 'Zerhouni Mokhtar',
    nameAr: 'زرهوني مختار',
    type: 'tram',
    lat: 36.7650,
    lng: 3.2650,
    lines: ['Tram T1'],
    connections: ['tr_ben_mred', 'tr_dergana'],
    schedule: { firstDeparture: '06:30', lastDeparture: '00:15', frequencyPeak: 8, frequencyOffPeak: 15 }
  },
  {
    id: 'tr_dergana',
    name: 'Dergana Centre',
    nameAr: 'درقانة وسط',
    type: 'tram',
    lat: 36.7720,
    lng: 3.2750,
    lines: ['Tram T1'],
    connections: ['tr_zerhouni'],
    schedule: { firstDeparture: '06:33', lastDeparture: '00:18', frequencyPeak: 8, frequencyOffPeak: 15 }
  },

  // --- SNTF TRAINS ---
  {
    id: 't_alger',
    name: 'Alger Gare Centrale (SNTF)',
    nameAr: 'محطة قطار الجزائر',
    type: 'train',
    lat: 36.7710,
    lng: 3.0645,
    lines: ['RER Est', 'RER Ouest', 'Navette Aéroport'],
    connections: ['t_agha', 'm_tafourah'],
    schedule: { firstDeparture: '05:40', lastDeparture: '21:30', frequencyPeak: 15, frequencyOffPeak: 30 }
  },
  {
    id: 't_agha',
    name: 'Agha (Gare SNTF)',
    nameAr: 'محطة أودان آغا',
    type: 'train',
    lat: 36.7640,
    lng: 3.0595,
    lines: ['RER Est', 'RER Ouest', 'Navette Aéroport'],
    connections: ['t_alger', 't_al_aln', 'm_tafourah', 'm_boukhalfa'],
    schedule: { firstDeparture: '05:43', lastDeparture: '21:33', frequencyPeak: 15, frequencyOffPeak: 30 }
  },
  {
    id: 't_al_aln',
    name: "Ateliers de l'ALN",
    nameAr: "ورشات جيش التحرير الوطني",
    type: 'train',
    lat: 36.7510,
    lng: 3.0810,
    lines: ['RER Est'],
    connections: ['t_agha', 't_hussein_dey'],
    schedule: { firstDeparture: '05:46', lastDeparture: '21:36', frequencyPeak: 15, frequencyOffPeak: 30 }
  },
  {
    id: 't_hussein_dey',
    name: 'Hussein Dey (Gare SNTF)',
    nameAr: 'حسين داي (محطة القطار)',
    type: 'train',
    lat: 36.7430,
    lng: 3.1020,
    lines: ['RER Est'],
    connections: ['t_al_aln', 't_caroubier'],
    schedule: { firstDeparture: '05:49', lastDeparture: '21:39', frequencyPeak: 15, frequencyOffPeak: 30 }
  },
  {
    id: 't_caroubier',
    name: 'Caroubier (Gare SNTF)',
    nameAr: 'الخروبة (محطة القطار)',
    type: 'train',
    lat: 36.7380,
    lng: 3.1250,
    lines: ['RER Est'],
    connections: ['t_hussein_dey', 't_harrach', 'tr_caroubier'],
    schedule: { firstDeparture: '05:53', lastDeparture: '21:43', frequencyPeak: 15, frequencyOffPeak: 30 }
  },
  {
    id: 't_harrach',
    name: 'El Harrach Gare (SNTF)',
    nameAr: 'الحراش محطة القطار',
    type: 'train',
    lat: 36.7225,
    lng: 3.1415,
    lines: ['RER Est', 'Navette Aéroport'],
    connections: ['t_caroubier', 't_oued_smar', 'm_harrach_gare'],
    schedule: { firstDeparture: '05:58', lastDeparture: '21:48', frequencyPeak: 15, frequencyOffPeak: 30 }
  },
  {
    id: 't_oued_smar',
    name: 'Oued Smar (Gare SNTF)',
    nameAr: 'واد السمار',
    type: 'train',
    lat: 36.7175,
    lng: 3.1650,
    lines: ['RER Est'],
    connections: ['t_harrach', 't_bab_ezzouar'],
    schedule: { firstDeparture: '06:01', lastDeparture: '21:51', frequencyPeak: 20, frequencyOffPeak: 40 }
  },
  {
    id: 't_bab_ezzouar',
    name: 'Bab Ezzouar (Gare SNTF)',
    nameAr: 'باب الزوار (محطة القطار)',
    type: 'train',
    lat: 36.7160,
    lng: 3.1900,
    lines: ['RER Est', 'Navette Aéroport'],
    connections: ['t_oued_smar', 't_dar_el_beida', 't_aeroport'],
    schedule: { firstDeparture: '06:03', lastDeparture: '21:53', frequencyPeak: 20, frequencyOffPeak: 40 }
  },
  {
    id: 't_aeroport',
    name: "Gare SNTF Aéroport d'Alger",
    nameAr: 'محطة قطار مطار الجزائر هواري بومدين',
    type: 'train',
    lat: 36.6950,
    lng: 3.2150,
    lines: ['Navette Aéroport'],
    connections: ['t_bab_ezzouar', 'b_aeroport'],
    schedule: { firstDeparture: '05:00', lastDeparture: '22:30', frequencyPeak: 30, frequencyOffPeak: 60 }
  },
  {
    id: 't_dar_el_beida',
    name: 'Dar El Beïda (Gare SNTF)',
    nameAr: 'الدار البيضاء',
    type: 'train',
    lat: 36.7020,
    lng: 3.2180,
    lines: ['RER Est'],
    connections: ['t_bab_ezzouar', 't_rouiba'],
    schedule: { firstDeparture: '06:08', lastDeparture: '21:58', frequencyPeak: 20, frequencyOffPeak: 40 }
  },
  {
    id: 't_rouiba',
    name: 'Rouïba Ville',
    nameAr: 'رويبة',
    type: 'train',
    lat: 36.7210,
    lng: 3.2850,
    lines: ['RER Est'],
    connections: ['t_dar_el_beida', 't_rouiba_zi'],
    schedule: { firstDeparture: '06:14', lastDeparture: '22:04', frequencyPeak: 20, frequencyOffPeak: 40 }
  },
  {
    id: 't_rouiba_zi',
    name: 'Rouïba Zone Industrielle',
    nameAr: 'رويبة المنطقة الصناعية',
    type: 'train',
    lat: 36.7270,
    lng: 3.3100,
    lines: ['RER Est'],
    connections: ['t_rouiba', 't_reghaia'],
    schedule: { firstDeparture: '06:17', lastDeparture: '22:07', frequencyPeak: 20, frequencyOffPeak: 40 }
  },
  {
    id: 't_reghaia',
    name: 'Réghaïa Ville',
    nameAr: 'رغاية',
    type: 'train',
    lat: 36.7340,
    lng: 3.3400,
    lines: ['RER Est'],
    connections: ['t_rouiba_zi', 't_reghaia_zi'],
    schedule: { firstDeparture: '06:21', lastDeparture: '22:11', frequencyPeak: 20, frequencyOffPeak: 40 }
  },
  {
    id: 't_reghaia_zi',
    name: 'Réghaïa Zone Industrielle',
    nameAr: 'رغاية المنطقة الصناعية',
    type: 'train',
    lat: 36.7380,
    lng: 3.3700,
    lines: ['RER Est'],
    connections: ['t_reghaia', 't_boudouaou'],
    schedule: { firstDeparture: '06:24', lastDeparture: '22:14', frequencyPeak: 20, frequencyOffPeak: 40 }
  },
  {
    id: 't_boudouaou',
    name: 'Boudouaou',
    nameAr: 'بودواو',
    type: 'train',
    lat: 36.7290,
    lng: 3.4050,
    lines: ['RER Est'],
    connections: ['t_reghaia_zi', 't_boumerdes'],
    schedule: { firstDeparture: '06:28', lastDeparture: '22:18', frequencyPeak: 20, frequencyOffPeak: 40 }
  },
  {
    id: 't_boumerdes',
    name: 'Boumerdès Gare',
    nameAr: 'بومرداس',
    type: 'train',
    lat: 36.7590,
    lng: 3.4690,
    lines: ['RER Est'],
    connections: ['t_boudouaou', 't_thenia'],
    schedule: { firstDeparture: '06:34', lastDeparture: '22:24', frequencyPeak: 20, frequencyOffPeak: 40 }
  },
  {
    id: 't_thenia',
    name: 'Thénia Terminus',
    nameAr: 'الثنية',
    type: 'train',
    lat: 36.7250,
    lng: 3.5550,
    lines: ['RER Est'],
    connections: ['t_boumerdes'],
    schedule: { firstDeparture: '06:40', lastDeparture: '22:30', frequencyPeak: 30, frequencyOffPeak: 60 }
  },

  // --- TRAIN BANLIEUE OUEST / BLIDA ---
  {
    id: 't_gue_de_constantine',
    name: 'Gué de Constantine (Gare SNTF)',
    nameAr: 'محطة قطار جسر قسنطينة',
    type: 'train',
    lat: 36.7080,
    lng: 3.1280,
    lines: ['RER Ouest', 'RER Blida'],
    connections: ['t_agha', 't_ain_nadja_train', 't_birtouta', 'm_constantine'],
    schedule: { firstDeparture: '05:55', lastDeparture: '21:40', frequencyPeak: 25, frequencyOffPeak: 50 }
  },
  {
    id: 't_ain_nadja_train',
    name: 'Aïn Naâdja (Gare SNTF)',
    nameAr: 'عين النعجة (محطة القطار)',
    type: 'train',
    lat: 36.7010,
    lng: 3.1160,
    lines: ['RER Ouest', 'RER Blida'],
    connections: ['t_gue_de_constantine', 't_birtouta', 'm_nadja'],
    schedule: { firstDeparture: '05:58', lastDeparture: '21:43', frequencyPeak: 25, frequencyOffPeak: 50 }
  },
  {
    id: 't_birtouta',
    name: 'Birtouta Gare Interconnexion',
    nameAr: 'بئر توتة',
    type: 'train',
    lat: 36.6430,
    lng: 3.0150,
    lines: ['RER Ouest', 'RER Blida'],
    connections: ['t_ain_nadja_train', 't_tessala', 't_boufarik', 'b_birtouta_ville'],
    schedule: { firstDeparture: '06:05', lastDeparture: '21:50', frequencyPeak: 25, frequencyOffPeak: 50 }
  },
  {
    id: 't_tessala',
    name: 'Tessala El Merdja',
    nameAr: 'تسالة المرجة',
    type: 'train',
    lat: 36.6620,
    lng: 2.9450,
    lines: ['RER Ouest'],
    connections: ['t_birtouta', 't_sidi_abdallah'],
    schedule: { firstDeparture: '06:09', lastDeparture: '21:54', frequencyPeak: 30, frequencyOffPeak: 60 }
  },
  {
    id: 't_sidi_abdallah',
    name: 'Sidi Abdallah Ville',
    nameAr: 'سيدي عبد الله',
    type: 'train',
    lat: 36.6850,
    lng: 2.8750,
    lines: ['RER Ouest'],
    connections: ['t_tessala', 't_univ_sidi_abdallah'],
    schedule: { firstDeparture: '06:12', lastDeparture: '21:58', frequencyPeak: 30, frequencyOffPeak: 60 }
  },
  {
    id: 't_univ_sidi_abdallah',
    name: 'Université Sidi Abdallah',
    nameAr: 'جامعة سيدي عبد الله',
    type: 'train',
    lat: 36.7000,
    lng: 2.8550,
    lines: ['RER Ouest'],
    connections: ['t_sidi_abdallah', 't_zeralda'],
    schedule: { firstDeparture: '06:16', lastDeparture: '22:02', frequencyPeak: 30, frequencyOffPeak: 60 }
  },
  {
    id: 't_zeralda',
    name: 'Zéralda Terminus',
    nameAr: 'زرالدة',
    type: 'train',
    lat: 36.7120,
    lng: 2.8450,
    lines: ['RER Ouest'],
    connections: ['t_univ_sidi_abdallah', 'b_zeralda'],
    schedule: { firstDeparture: '06:20', lastDeparture: '22:06', frequencyPeak: 30, frequencyOffPeak: 60 }
  },
  {
    id: 't_boufarik',
    name: 'Boufarik Gare',
    nameAr: 'بوفاريك',
    type: 'train',
    lat: 36.5750,
    lng: 2.9120,
    lines: ['RER Blida'],
    connections: ['t_birtouta', 't_beni_mered'],
    schedule: { firstDeparture: '06:10', lastDeparture: '22:00', frequencyPeak: 20, frequencyOffPeak: 40 }
  },
  {
    id: 't_beni_mered',
    name: 'Beni Mered',
    nameAr: 'بني مراد',
    type: 'train',
    lat: 36.5210,
    lng: 2.8620,
    lines: ['RER Blida'],
    connections: ['t_boufarik', 't_blida'],
    schedule: { firstDeparture: '06:15', lastDeparture: '22:05', frequencyPeak: 20, frequencyOffPeak: 40 }
  },
  {
    id: 't_blida',
    name: 'Blida Gare Centrale',
    nameAr: 'محطة قطار البليدة',
    type: 'train',
    lat: 36.4800,
    lng: 2.8310,
    lines: ['RER Blida'],
    connections: ['t_beni_mered', 't_chiffa'],
    schedule: { firstDeparture: '06:20', lastDeparture: '22:10', frequencyPeak: 20, frequencyOffPeak: 40 }
  },
  {
    id: 't_chiffa',
    name: 'La Chiffa',
    nameAr: 'الشفة',
    type: 'train',
    lat: 36.4610,
    lng: 2.7410,
    lines: ['RER Blida'],
    connections: ['t_blida', 't_el_affroun'],
    schedule: { firstDeparture: '06:25', lastDeparture: '22:15', frequencyPeak: 25, frequencyOffPeak: 50 }
  },
  {
    id: 't_el_affroun',
    name: 'El Affroun Terminus',
    nameAr: 'العفرون',
    type: 'train',
    lat: 36.4670,
    lng: 2.6250,
    lines: ['RER Blida'],
    connections: ['t_chiffa'],
    schedule: { firstDeparture: '06:30', lastDeparture: '22:25', frequencyPeak: 25, frequencyOffPeak: 50 }
  },

  // --- TÉLÉPHÉRIQUES & TÉLÉCABINES D'ALGER ---
  {
    id: 'tel_jardin',
    name: "Téléphérique Jardin d'Essai",
    nameAr: 'تلفريك حديقة التجارب',
    type: 'telepherique',
    lat: 36.7465,
    lng: 3.0720,
    lines: ['Téléphérique Mémorial'],
    connections: ['m_jardin', 'tel_memorial'],
    schedule: { firstDeparture: '06:00', lastDeparture: '19:00', frequencyPeak: 2, frequencyOffPeak: 5 }
  },
  {
    id: 'tel_memorial',
    name: 'Téléphérique Mémorial du Martyr (Maqam)',
    nameAr: 'تلفريك مقام الشهيد',
    type: 'telepherique',
    lat: 36.7435,
    lng: 3.0700,
    lines: ['Téléphérique Mémorial'],
    connections: ['tel_jardin'],
    schedule: { firstDeparture: '06:00', lastDeparture: '19:00', frequencyPeak: 2, frequencyOffPeak: 5 }
  },
  {
    id: 'tel_mai',
    name: 'Téléphérique 1er Mai',
    nameAr: 'تلفريك أول ماي',
    type: 'telepherique',
    lat: 36.7595,
    lng: 3.0525,
    lines: ['Téléphérique Palais du Peuple'],
    connections: ['m_mai', 'b_mai', 'tel_palais'],
    schedule: { firstDeparture: '06:00', lastDeparture: '19:00', frequencyPeak: 2, frequencyOffPeak: 5 }
  },
  {
    id: 'tel_palais',
    name: 'Téléphérique Palais du Peuple',
    nameAr: 'تلفريك قصر الشعب',
    type: 'telepherique',
    lat: 36.7625,
    lng: 3.0510,
    lines: ['Téléphérique Palais du Peuple'],
    connections: ['tel_mai'],
    schedule: { firstDeparture: '06:00', lastDeparture: '19:00', frequencyPeak: 2, frequencyOffPeak: 5 }
  },
  {
    id: 'tel_bologhine',
    name: 'Téléphérique Bologhine',
    nameAr: 'تلفريك بولوغين',
    type: 'telepherique',
    lat: 36.7920,
    lng: 3.0480,
    lines: ['Téléphérique Notre Dame d\'Afrique'],
    connections: ['tel_nd_afrique'],
    schedule: { firstDeparture: '06:00', lastDeparture: '19:00', frequencyPeak: 3, frequencyOffPeak: 6 }
  },
  {
    id: 'tel_nd_afrique',
    name: 'Téléphérique Notre Dame d\'Afrique',
    nameAr: 'تلفريك سيدة أفريقيا',
    type: 'telepherique',
    lat: 36.7960,
    lng: 3.0420,
    lines: ['Téléphérique Notre Dame d\'Afrique'],
    connections: ['tel_bologhine'],
    schedule: { firstDeparture: '06:00', lastDeparture: '19:00', frequencyPeak: 3, frequencyOffPeak: 6 }
  },
  {
    id: 'tel_triolet',
    name: 'Télécabine Triolet (Bab El Oued)',
    nameAr: 'تلفريك تريولي باب الواد',
    type: 'telepherique',
    lat: 36.7845,
    lng: 3.0445,
    lines: ['Télécabine Oued Koriche - Bouzaréah'],
    connections: ['b_bab_el_oued', 'bp_triolet', 'tel_frais_vallon'],
    schedule: { firstDeparture: '06:00', lastDeparture: '19:30', frequencyPeak: 2, frequencyOffPeak: 4 }
  },
  {
    id: 'tel_frais_vallon',
    name: 'Télécabine Frais Vallon',
    nameAr: 'تلفريك واد قريش (فري فالون)',
    type: 'telepherique',
    lat: 36.7865,
    lng: 3.0180,
    lines: ['Télécabine Oued Koriche - Bouzaréah'],
    connections: ['tel_triolet', 'tel_bouzareah'],
    schedule: { firstDeparture: '06:00', lastDeparture: '19:30', frequencyPeak: 2, frequencyOffPeak: 4 }
  },
  {
    id: 'tel_bouzareah',
    name: 'Télécabine Bouzaréah Ville',
    nameAr: 'تلفريك بوزريعة',
    type: 'telepherique',
    lat: 36.7885,
    lng: 2.9915,
    lines: ['Télécabine Oued Koriche - Bouzaréah'],
    connections: ['tel_frais_vallon', 'b_bouzareah'],
    schedule: { firstDeparture: '06:00', lastDeparture: '19:30', frequencyPeak: 2, frequencyOffPeak: 4 }
  },
  {
    id: 'tel_triolet_z',
    name: 'Télécabine Triolet (Branche Z\'ghara)',
    nameAr: 'تلفريك تريولي زغارة',
    type: 'telepherique',
    lat: 36.7845,
    lng: 3.0445,
    lines: ['Télécabine Bab El Oued - Z\'ghara'],
    connections: ['tel_triolet', 'tel_zghara'],
    schedule: { firstDeparture: '06:00', lastDeparture: '19:00', frequencyPeak: 3, frequencyOffPeak: 6 }
  },
  {
    id: 'tel_zghara',
    name: 'Télécabine Z\'ghara',
    nameAr: 'تلفريك زغارة',
    type: 'telepherique',
    lat: 36.7890,
    lng: 3.0390,
    lines: ['Télécabine Bab El Oued - Z\'ghara'],
    connections: ['tel_triolet_z'],
    schedule: { firstDeparture: '06:00', lastDeparture: '19:00', frequencyPeak: 3, frequencyOffPeak: 6 }
  },

  // --- ETUSA BUS HUBS & STATIONS ---
  {
    id: 'b_mai',
    name: 'Station ETUSA 1er Mai',
    nameAr: 'محطة أول ماي (إيتوزا)',
    type: 'bus',
    lat: 36.7592,
    lng: 3.0520,
    lines: ['Bus 02', 'Bus 07', 'Bus 11', 'Bus 14', 'Bus 31', 'Bus 32', 'Bus 34', 'Bus 36', 'Bus 43', 'Bus 48', 'Bus 88', 'Bus 89', 'Bus 98', 'Bus 99', 'Bus 107', 'Bus 631'],
    connections: ['m_mai', 'b_audin', 'bp_mai', 'tel_mai'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:30', frequencyPeak: 8, frequencyOffPeak: 15 }
  },
  {
    id: 'b_audin',
    name: 'Station ETUSA Place Maurice Audin',
    nameAr: 'محطة أودان (إيتوزا)',
    type: 'bus',
    lat: 36.7680,
    lng: 3.0560,
    lines: ['Bus 01', 'Bus 02', 'Bus 31', 'Bus 54'],
    connections: ['b_mai', 'b_tafourah', 'bp_audin', 'b_martyrs', 'b_telemly'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:30', frequencyPeak: 8, frequencyOffPeak: 15 }
  },
  {
    id: 'b_tafourah',
    name: 'Station ETUSA Tafourah (Grande Poste)',
    nameAr: 'محطة تافورة (إيتوزا)',
    type: 'bus',
    lat: 36.7685,
    lng: 3.0580,
    lines: ['Bus 12', 'Bus 14', 'Bus 16', 'Bus 31', 'Bus 65', 'Bus 67', 'Bus 99', 'Bus 113'],
    connections: ['b_audin', 'm_tafourah', 't_agha'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:30', frequencyPeak: 8, frequencyOffPeak: 15 }
  },
  {
    id: 'b_martyrs',
    name: 'Station ETUSA Place des Martyrs',
    nameAr: 'محطة ساحة الشهداء (إيتوزا)',
    type: 'bus',
    lat: 36.7801,
    lng: 3.0601,
    lines: ['Bus 01', 'Bus 02', 'Bus 08', 'Bus 10', 'Bus 12', 'Bus 14', 'Bus 15', 'Bus 16', 'Bus 31', 'Bus 100', 'Bus 101'],
    connections: ['m_martyrs', 'bp_martyrs', 'b_bab_el_oued'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:30', frequencyPeak: 8, frequencyOffPeak: 15 }
  },
  {
    id: 'b_ben_aknoun',
    name: 'Station ETUSA Ben Aknoun',
    nameAr: 'محطة بن عكنون (إيتوزا)',
    type: 'bus',
    lat: 36.7530,
    lng: 3.0030,
    lines: ['Bus 11', 'Bus 32', 'Bus 48', 'Bus 54', 'Bus 72', 'Bus 100', 'Bus 111', 'Bus 731'],
    connections: ['b_chevalley', 'bp_ben_aknoun_gare', 'b_hydra', 'b_dely_brahim'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:00', frequencyPeak: 10, frequencyOffPeak: 20 }
  },
  {
    id: 'b_chevalley',
    name: 'Station ETUSA Chevalley',
    nameAr: 'محطة شوالي (إيتوزا)',
    type: 'bus',
    lat: 36.7680,
    lng: 2.9980,
    lines: ['Bus 10', 'Bus 34', 'Bus 100', 'Bus 113'],
    connections: ['b_ben_aknoun', 'bp_chevalley', 'b_bouzareah', 'b_el_biar'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:00', frequencyPeak: 10, frequencyOffPeak: 20 }
  },
  {
    id: 'b_bab_el_oued',
    name: 'Station ETUSA Bab El Oued (Triolet)',
    nameAr: 'محطة باب الواد (إيتوزا)',
    type: 'bus',
    lat: 36.7850,
    lng: 3.0500,
    lines: ['Bus 08', 'Bus 10', 'Bus 15', 'Bus 16', 'Bus 31', 'Bus 43', 'Bus 100'],
    connections: ['m_martyrs', 'b_martyrs', 'bp_triolet', 'tel_triolet'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:00', frequencyPeak: 10, frequencyOffPeak: 20 }
  },
  {
    id: 'b_hydra',
    name: 'Station ETUSA Hydra',
    nameAr: 'محطة حيدرة (إيتوزا)',
    type: 'bus',
    lat: 36.7420,
    lng: 3.0250,
    lines: ['Bus 32', 'Bus 48', 'Bus 65', 'Bus 67'],
    connections: ['b_ben_aknoun', 'b_birmandreis'],
    schedule: { firstDeparture: '05:40', lastDeparture: '21:30', frequencyPeak: 12, frequencyOffPeak: 25 }
  },
  {
    id: 'b_bouzareah',
    name: 'Station ETUSA Bouzaréah',
    nameAr: 'محطة بوزريعة (إيتوزا)',
    type: 'bus',
    lat: 36.7880,
    lng: 2.9920,
    lines: ['Bus 10', 'Bus 15', 'Bus 67'],
    connections: ['b_chevalley', 'tel_bouzareah'],
    schedule: { firstDeparture: '05:40', lastDeparture: '21:30', frequencyPeak: 12, frequencyOffPeak: 25 }
  },
  {
    id: 'b_el_biar',
    name: 'Station ETUSA El Biar Place Kennedy',
    nameAr: 'محطة الأبيار (إيتوزا)',
    type: 'bus',
    lat: 36.7680,
    lng: 3.0310,
    lines: ['Bus 11', 'Bus 34', 'Bus 54'],
    connections: ['b_chevalley', 'b_ben_aknoun'],
    schedule: { firstDeparture: '05:40', lastDeparture: '21:30', frequencyPeak: 12, frequencyOffPeak: 25 }
  },
  {
    id: 'b_kouba',
    name: 'Station ETUSA Kouba Centre',
    nameAr: 'محطة القبة (إيتوزا)',
    type: 'bus',
    lat: 36.7290,
    lng: 3.0850,
    lines: ['Bus 36', 'Bus 89', 'Bus 631'],
    connections: ['bp_kouba_eglise', 'b_bachdjerrah'],
    schedule: { firstDeparture: '05:40', lastDeparture: '21:30', frequencyPeak: 12, frequencyOffPeak: 25 }
  },
  {
    id: 'b_birmandreis',
    name: 'Station ETUSA Bir Mourad Raïs',
    nameAr: 'محطة بئر مراد رايس (إيتوزا)',
    type: 'bus',
    lat: 36.7320,
    lng: 3.0520,
    lines: ['Bus 14', 'Bus 65'],
    connections: ['b_hydra', 'b_mai', 'b_birkhadem'],
    schedule: { firstDeparture: '05:40', lastDeparture: '21:30', frequencyPeak: 12, frequencyOffPeak: 25 }
  },
  {
    id: 'b_bachdjerrah',
    name: 'Station ETUSA Bachdjerrah',
    nameAr: 'محطة باش جراح (إيتوزا)',
    type: 'bus',
    lat: 36.7180,
    lng: 3.1050,
    lines: ['Bus 88', 'Bus 89'],
    connections: ['m_badr', 'b_harrach'],
    schedule: { firstDeparture: '05:40', lastDeparture: '21:30', frequencyPeak: 12, frequencyOffPeak: 25 }
  },
  {
    id: 'b_harrach',
    name: 'Station ETUSA El Harrach',
    nameAr: 'محطة الحراش (إيتوزا)',
    type: 'bus',
    lat: 36.7280,
    lng: 3.1360,
    lines: ['Bus 88', 'Bus 98'],
    connections: ['m_harrach_centre', 'bp_harrach_centre'],
    schedule: { firstDeparture: '05:40', lastDeparture: '21:30', frequencyPeak: 12, frequencyOffPeak: 25 }
  },
  {
    id: 'b_aeroport',
    name: "Station ETUSA Aéroport d'Alger",
    nameAr: 'محطة حافلات مطار الجزائر',
    type: 'bus',
    lat: 36.6950,
    lng: 3.2150,
    lines: ['Bus 99'],
    connections: ['t_aeroport'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:30', frequencyPeak: 15, frequencyOffPeak: 30 }
  },
  {
    id: 'b_salembier',
    name: 'Station ETUSA El Madania (Salembier)',
    nameAr: 'محطة المدنية (إيتوزا)',
    type: 'bus',
    lat: 36.7450,
    lng: 3.0650,
    lines: ['Bus 01', 'Bus 07'],
    connections: ['tel_memorial'],
    schedule: { firstDeparture: '05:40', lastDeparture: '21:30', frequencyPeak: 12, frequencyOffPeak: 25 }
  },
  {
    id: 'b_ain_benian',
    name: 'Station ETUSA Aïn Benian',
    nameAr: 'محطة عين بنيان (إيتوزا)',
    type: 'bus',
    lat: 36.8020,
    lng: 2.9210,
    lines: ['Bus 12', 'Bus 101', 'Bus 113'],
    connections: ['bp_cheraga', 'b_staoueli'],
    schedule: { firstDeparture: '05:40', lastDeparture: '21:00', frequencyPeak: 15, frequencyOffPeak: 30 }
  },

  // --- NEW STATIONS EXTENSIONS ---
  {
    id: 'b_staoueli',
    name: 'Station ETUSA Staouéli Centre',
    nameAr: 'محطة سطاوالي (إيتوزا)',
    type: 'bus',
    lat: 36.7580,
    lng: 2.8900,
    lines: ['Bus 72', 'Bus 111'],
    connections: ['b_palm_beach', 'b_ain_benian'],
    schedule: { firstDeparture: '05:45', lastDeparture: '21:00', frequencyPeak: 15, frequencyOffPeak: 30 }
  },
  {
    id: 'b_palm_beach',
    name: 'Station ETUSA Palm Beach / Sidi Fredj',
    nameAr: 'محطة باالم بيتش / سيدي فرج',
    type: 'bus',
    lat: 36.7620,
    lng: 2.8550,
    lines: ['Bus 111'],
    connections: ['b_staoueli', 'b_zeralda'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:30', frequencyPeak: 15, frequencyOffPeak: 30 }
  },
  {
    id: 'b_cheraga',
    name: 'Station ETUSA Chéraga Centre',
    nameAr: 'محطة الشراقة (إيتوزا)',
    type: 'bus',
    lat: 36.7710,
    lng: 2.9580,
    lines: ['Bus 11', 'Bus 72'],
    connections: ['b_dely_brahim', 'b_staoueli', 'bp_cheraga'],
    schedule: { firstDeparture: '05:45', lastDeparture: '21:30', frequencyPeak: 12, frequencyOffPeak: 25 }
  },
  {
    id: 'b_dely_brahim',
    name: 'Station ETUSA Dely Ibrahim',
    nameAr: 'محطة دالي براهيم (إيتوزا)',
    type: 'bus',
    lat: 36.7520,
    lng: 2.9800,
    lines: ['Bus 72'],
    connections: ['b_ben_aknoun', 'b_cheraga', 'bp_dely_brahim'],
    schedule: { firstDeparture: '05:45', lastDeparture: '21:30', frequencyPeak: 12, frequencyOffPeak: 25 }
  },
  {
    id: 'b_zeralda',
    name: 'Station ETUSA Zéralda Ville',
    nameAr: 'محطة زرالدة (إيتوزا)',
    type: 'bus',
    lat: 36.7120,
    lng: 2.8450,
    lines: ['Bus 101'],
    connections: ['t_zeralda', 'b_palm_beach'],
    schedule: { firstDeparture: '05:45', lastDeparture: '21:00', frequencyPeak: 15, frequencyOffPeak: 30 }
  },
  {
    id: 'b_douera',
    name: 'Station ETUSA Douera Centre',
    nameAr: 'محطة دويرة (إيتوزا)',
    type: 'bus',
    lat: 36.6710,
    lng: 2.9450,
    lines: ['Bus 731'],
    connections: ['b_baba_hassen'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:30', frequencyPeak: 15, frequencyOffPeak: 30 }
  },
  {
    id: 'b_baba_hassen',
    name: 'Station ETUSA Baba Hassen',
    nameAr: 'محطة بابا حسن (إيتوزا)',
    type: 'bus',
    lat: 36.6980,
    lng: 2.9750,
    lines: ['Bus 731'],
    connections: ['b_douera', 'b_ben_aknoun'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:30', frequencyPeak: 15, frequencyOffPeak: 30 }
  },
  {
    id: 'b_saoula',
    name: 'Station ETUSA Saoula',
    nameAr: 'محطة السحاولة (إيتوزا)',
    type: 'bus',
    lat: 36.6850,
    lng: 3.0250,
    lines: ['Bus 107'],
    connections: ['b_birkhadem'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:30', frequencyPeak: 15, frequencyOffPeak: 30 }
  },
  {
    id: 'b_birkhadem',
    name: 'Station ETUSA Birkhadem',
    nameAr: 'محطة بئر خادم (إيتوزا)',
    type: 'bus',
    lat: 36.7150,
    lng: 3.0510,
    lines: ['Bus 107'],
    connections: ['b_birmandreis', 'b_saoula'],
    schedule: { firstDeparture: '05:45', lastDeparture: '21:30', frequencyPeak: 12, frequencyOffPeak: 25 }
  },
  {
    id: 'b_birtouta_ville',
    name: 'Station ETUSA Birtouta Centre',
    nameAr: 'محطة بئر توتة وسط (إيتوزا)',
    type: 'bus',
    lat: 36.6430,
    lng: 3.0150,
    lines: ['Bus 107'],
    connections: ['t_birtouta'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:30', frequencyPeak: 15, frequencyOffPeak: 30 }
  },
  {
    id: 'b_ain_taya',
    name: 'Station ETUSA Aïn Taya',
    nameAr: 'محطة عين طاية (إيتوزا)',
    type: 'bus',
    lat: 36.7930,
    lng: 3.2850,
    lines: ['Bus 98'],
    connections: ['b_bordj_bahri'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:30', frequencyPeak: 15, frequencyOffPeak: 30 }
  },
  {
    id: 'b_bordj_bahri',
    name: 'Station ETUSA Bordj El Bahri',
    nameAr: 'محطة برج البحري (إيتوزا)',
    type: 'bus',
    lat: 36.7900,
    lng: 3.2500,
    lines: ['Bus 98'],
    connections: ['b_ain_taya', 'tr_dergana'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:30', frequencyPeak: 15, frequencyOffPeak: 30 }
  },
  {
    id: 'b_baraki',
    name: 'Station ETUSA Baraki Centre',
    nameAr: 'محطة براقي (إيتوزا)',
    type: 'bus',
    lat: 36.6680,
    lng: 3.0950,
    lines: ['Bus 88'],
    connections: ['m_constantine', 'bp_baraki'],
    schedule: { firstDeparture: '05:45', lastDeparture: '21:00', frequencyPeak: 12, frequencyOffPeak: 25 }
  },
  {
    id: 'b_telemly',
    name: 'Station ETUSA Telemly',
    nameAr: 'محطة تيليملي (إيتوزا)',
    type: 'bus',
    lat: 36.7650,
    lng: 3.0520,
    lines: ['Bus 02'],
    connections: ['b_audin'],
    schedule: { firstDeparture: '05:45', lastDeparture: '21:30', frequencyPeak: 12, frequencyOffPeak: 25 }
  },

  // --- PRIVATE BUS STATIONS (Bus Privés) ---
  {
    id: 'bp_bab_ezzouar_fac',
    name: 'Bab Ezzouar - Fac (Privé)',
    nameAr: 'جامعة باب الزوار (خاص)',
    type: 'bus_priv',
    lat: 36.7200,
    lng: 3.1830,
    lines: ['P1', 'P7'],
    connections: ['tr_usthb'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:00', frequencyPeak: 8, frequencyOffPeak: 15 }
  },
  {
    id: 'bp_bab_ezzouar_centre',
    name: 'Bab Ezzouar - Centre (Privé)',
    nameAr: 'باب الزوار وسط (خاص)',
    type: 'bus_priv',
    lat: 36.7110,
    lng: 3.1900,
    lines: ['P1'],
    connections: ['tr_centre_commercial'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:00', frequencyPeak: 8, frequencyOffPeak: 15 }
  },
  {
    id: 'bp_belfort',
    name: 'Belfort El Harrach (Privé)',
    nameAr: 'بلفور الحراش (خاص)',
    type: 'bus_priv',
    lat: 36.7300,
    lng: 3.1560,
    lines: ['P1'],
    connections: ['tr_belfort'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:00', frequencyPeak: 8, frequencyOffPeak: 15 }
  },
  {
    id: 'bp_harrach_centre',
    name: 'El Harrach Centre (Privé)',
    nameAr: 'الحراش وسط (خاص)',
    type: 'bus_priv',
    lat: 36.7290,
    lng: 3.1370,
    lines: ['P1', 'P5'],
    connections: ['m_harrach_centre', 'b_harrach'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:00', frequencyPeak: 8, frequencyOffPeak: 15 }
  },
  {
    id: 'bp_baraki',
    name: 'Baraki Centre (Privé)',
    nameAr: 'براقي وسط (خاص)',
    type: 'bus_priv',
    lat: 36.6970,
    lng: 3.0950,
    lines: ['P5', 'P11'],
    connections: ['m_constantine', 'b_eucalyptus', 'b_bachdjerrah'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:30', frequencyPeak: 8, frequencyOffPeak: 15 }
  },
  {
    id: 'bp_ben_aknoun_gare',
    name: 'Ben Aknoun Gare Routière (Privé)',
    nameAr: 'محطة بن عكنون (خاص)',
    type: 'bus_priv',
    lat: 36.7540,
    lng: 3.0040,
    lines: ['P2', 'P4', 'P6', 'P10'],
    connections: ['b_ben_aknoun'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:00', frequencyPeak: 5, frequencyOffPeak: 10 }
  },
  {
    id: 'bp_dely_brahim',
    name: 'Dely Ibrahim (Privé)',
    nameAr: 'دالي براهيم (خاص)',
    type: 'bus_priv',
    lat: 36.7520,
    lng: 2.9800,
    lines: ['P2', 'P4', 'P6', 'P10'],
    connections: ['b_dely_brahim'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:00', frequencyPeak: 5, frequencyOffPeak: 10 }
  },
  {
    id: 'bp_chevalley',
    name: 'Chevalley (Privé)',
    nameAr: 'شوالي (خاص)',
    type: 'bus_priv',
    lat: 36.7680,
    lng: 2.9980,
    lines: ['P2'],
    connections: ['b_chevalley'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:00', frequencyPeak: 5, frequencyOffPeak: 10 }
  },
  {
    id: 'bp_triolet',
    name: 'Triolet Bab El Oued (Privé)',
    nameAr: 'تريولي باب الواد (خاص)',
    type: 'bus_priv',
    lat: 36.7840,
    lng: 3.0450,
    lines: ['P2'],
    connections: ['b_bab_el_oued', 'tel_triolet'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:00', frequencyPeak: 5, frequencyOffPeak: 10 }
  },
  {
    id: 'bp_martyrs',
    name: 'Place des Martyrs (Privé)',
    nameAr: 'ساحة الشهداء (خاص)',
    type: 'bus_priv',
    lat: 36.7800,
    lng: 3.0600,
    lines: ['P2'],
    connections: ['m_martyrs', 'b_martyrs'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:00', frequencyPeak: 5, frequencyOffPeak: 10 }
  },
  {
    id: 'bp_kouba_eglise',
    name: 'Kouba La Croix (Privé)',
    nameAr: 'القبة القديمة (خاص)',
    type: 'bus_priv',
    lat: 36.7290,
    lng: 3.0850,
    lines: ['P3'],
    connections: ['b_kouba'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:30', frequencyPeak: 10, frequencyOffPeak: 18 }
  },
  {
    id: 'bp_jolie_vue',
    name: 'Jolie Vue Kouba (Privé)',
    nameAr: 'جولي فيو القبة (خاص)',
    type: 'bus_priv',
    lat: 36.7250,
    lng: 3.0980,
    lines: ['P3'],
    connections: [],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:30', frequencyPeak: 10, frequencyOffPeak: 18 }
  },
  {
    id: 'bp_ruisseau',
    name: 'Ruisseau Interchange (Privé)',
    nameAr: 'الرويسو تبادل (خاص)',
    type: 'bus_priv',
    lat: 36.7425,
    lng: 3.0825,
    lines: ['P3', 'P11'],
    connections: ['m_ruisseau', 'tr_ruisseau'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:30', frequencyPeak: 10, frequencyOffPeak: 18 }
  },
  {
    id: 'bp_mai',
    name: '1er Mai Station (Privé)',
    nameAr: 'محطة أول ماي (خاص)',
    type: 'bus_priv',
    lat: 36.7592,
    lng: 3.0520,
    lines: ['P3', 'P6', 'P9'],
    connections: ['m_mai', 'b_mai'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:30', frequencyPeak: 10, frequencyOffPeak: 18 }
  },
  {
    id: 'bp_audin',
    name: 'Maurice Audin (Privé)',
    nameAr: 'موريس أودان (خاص)',
    type: 'bus_priv',
    lat: 36.7680,
    lng: 3.0560,
    lines: ['P3'],
    connections: ['b_audin'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:30', frequencyPeak: 10, frequencyOffPeak: 18 }
  },
  {
    id: 'bp_cheraga',
    name: 'Chéraga Centre (Privé)',
    nameAr: 'الشراقة (خاص)',
    type: 'bus_priv',
    lat: 36.7710,
    lng: 2.9580,
    lines: ['P4', 'P6', 'P10'],
    connections: ['b_cheraga'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:00', frequencyPeak: 8, frequencyOffPeak: 15 }
  }
];

export const LINES: LineData[] = [
  // --- METRO D'ALGER ---
  {
    id: 'metro_m1',
    name: 'Métro Ligne 1 (Martyrs - El Harrach Gare)',
    type: 'metro',
    color: '#D32F2F', // Red
    stations: [
      'm_martyrs', 'm_boumendjel', 'm_tafourah', 'm_boukhalfa', 'm_mai',
      'm_idir', 'm_hamma', 'm_jardin', 'm_ruisseau', 'm_amirouche',
      'm_soleil', 'm_badr', 'm_ateliers', 'm_harrach_centre', 'm_harrach_gare'
    ]
  },
  {
    id: 'metro_m1_branch',
    name: 'Métro Branche Aïn Naâdja',
    type: 'metro',
    color: '#C2185B', // Dark Pink
    stations: ['m_badr', 'm_constantine', 'm_nadja']
  },

  // --- TRAMWAY D'ALGER ---
  {
    id: 'tram_t1',
    name: 'Tramway T1 (Ruisseau - Dergana Centre)',
    type: 'tram',
    color: '#1976D2', // Blue
    stations: [
      'tr_fusilles', 'tr_maaza', 'tr_mosquee', 'tr_hamadache',
      'tr_thaalibia', 'tr_bananiers', 'tr_caroubier', 'tr_glaciere', 'tr_pont_est', 'tr_belfort',
      'tr_badi', 'tr_juillet', 'tr_bab_ezzouar_pont', 'tr_usthb', 'tr_cite_8mai',
      'tr_centre_commercial', 'tr_cite_u', 'tr_smail_yefsah', 'tr_cite_206',
      'tr_bordj_kiffan', 'tr_mouhous', 'tr_mimouni', 'tr_ben_mred', 'tr_zerhouni', 'tr_dergana'
    ]
  },

  // --- TRAINS SNTF RER ---
  {
    id: 'train_rer_est',
    name: 'RER Banlieue Est (Alger Gare - Boumerdès - Thénia)',
    type: 'train',
    color: '#388E3C', // Green
    stations: [
      't_alger', 't_agha', 't_al_aln', 't_hussein_dey', 't_caroubier',
      't_harrach', 't_oued_smar', 't_bab_ezzouar', 't_dar_el_beida',
      't_rouiba', 't_rouiba_zi', 't_reghaia', 't_reghaia_zi', 't_boudouaou',
      't_boumerdes', 't_thenia'
    ]
  },
  {
    id: 'train_rer_aeroport',
    name: "RER Express Navette Aéroport (Alger - Aéroport Houari Boumediene)",
    type: 'train',
    color: '#059669', // Emerald
    stations: ['t_alger', 't_agha', 't_harrach', 't_bab_ezzouar', 't_aeroport']
  },
  {
    id: 'train_rer_ouest',
    name: 'RER Banlieue Ouest (Alger - Zéralda)',
    type: 'train',
    color: '#00796B', // Teal
    stations: [
      't_alger', 't_agha', 't_gue_de_constantine', 't_ain_nadja_train',
      't_birtouta', 't_tessala', 't_sidi_abdallah', 't_univ_sidi_abdallah', 't_zeralda'
    ]
  },
  {
    id: 'train_rer_blida',
    name: 'RER Banlieue Sud-Ouest (Alger - Blida - El Affroun)',
    type: 'train',
    color: '#0288D1', // Cyan Blue
    stations: [
      't_alger', 't_agha', 't_gue_de_constantine', 't_ain_nadja_train',
      't_birtouta', 't_boufarik', 't_beni_mered', 't_blida', 't_chiffa', 't_el_affroun'
    ]
  },

  // --- TÉLÉPHÉRIQUES & TÉLÉCABINES ---
  {
    id: 'tel_line_memorial',
    name: 'Téléphérique du Mémorial (Jardin d\'Essai - Maqam)',
    type: 'telepherique',
    color: '#8B5CF6', // Purple
    stations: ['tel_jardin', 'tel_memorial']
  },
  {
    id: 'tel_line_palais',
    name: 'Téléphérique du Palais du Peuple (1er Mai - Palais)',
    type: 'telepherique',
    color: '#7C3AED', // Dark Purple
    stations: ['tel_mai', 'tel_palais']
  },
  {
    id: 'tel_line_nd_afrique',
    name: 'Téléphérique Notre Dame d\'Afrique (Bologhine - Notre Dame)',
    type: 'telepherique',
    color: '#9333EA', // Violet
    stations: ['tel_bologhine', 'tel_nd_afrique']
  },
  {
    id: 'tel_line_bouzareah',
    name: 'Télécabine Oued Koriche (Triolet - Frais Vallon - Bouzaréah)',
    type: 'telepherique',
    color: '#A855F7', // Bright Violet
    stations: ['tel_triolet', 'tel_frais_vallon', 'tel_bouzareah']
  },
  {
    id: 'tel_line_zghara',
    name: 'Télécabine Bab El Oued (Triolet - Z\'ghara)',
    type: 'telepherique',
    color: '#C084FC', // Light Purple
    stations: ['tel_triolet_z', 'tel_zghara']
  },

  // --- ETUSA BUS LINES ---
  {
    id: 'bus_etusa_01',
    name: 'Ligne ETUSA 01 (Place des Martyrs - El Madania / Salembier)',
    type: 'bus',
    color: '#F59E0B',
    stations: ['b_martyrs', 'b_audin', 'b_salembier']
  },
  {
    id: 'bus_etusa_02',
    name: 'Ligne ETUSA 02 (Place des Martyrs - Didouche Mourad - Telemly)',
    type: 'bus',
    color: '#D97706',
    stations: ['b_martyrs', 'b_audin', 'b_telemly']
  },
  {
    id: 'bus_etusa_08',
    name: 'Ligne ETUSA 08 (Place des Martyrs - Triolet - Notre Dame)',
    type: 'bus',
    color: '#B45309',
    stations: ['b_martyrs', 'b_bab_el_oued']
  },
  {
    id: 'bus_etusa_10',
    name: 'Ligne ETUSA 10 (Place des Martyrs - Triolet - Bouzaréah)',
    type: 'bus',
    color: '#D97706',
    stations: ['b_martyrs', 'b_bab_el_oued', 'b_chevalley', 'b_bouzareah']
  },
  {
    id: 'bus_etusa_11',
    name: 'Ligne ETUSA 11 (1er Mai - El Biar - Chéraga)',
    type: 'bus',
    color: '#EA580C',
    stations: ['b_mai', 'b_el_biar', 'b_ben_aknoun', 'b_cheraga']
  },
  {
    id: 'bus_etusa_12',
    name: 'Ligne ETUSA 12 (Tafourah - Place des Martyrs - Aïn Benian)',
    type: 'bus',
    color: '#F59E0B',
    stations: ['b_tafourah', 'b_martyrs', 'b_ain_benian']
  },
  {
    id: 'bus_etusa_14',
    name: 'Ligne ETUSA 14 (Place des Martyrs - 1er Mai - Birmandreis)',
    type: 'bus',
    color: '#B45309',
    stations: ['b_martyrs', 'b_tafourah', 'b_mai', 'b_birmandreis']
  },
  {
    id: 'bus_etusa_15',
    name: 'Ligne ETUSA 15 (Place des Martyrs - Bouzaréah Fac)',
    type: 'bus',
    color: '#D97706',
    stations: ['b_martyrs', 'b_bab_el_oued', 'b_bouzareah']
  },
  {
    id: 'bus_etusa_16',
    name: 'Ligne ETUSA 16 (Tafourah - Place des Martyrs - Bab El Oued)',
    type: 'bus',
    color: '#FBBF24',
    stations: ['b_tafourah', 'b_martyrs', 'b_bab_el_oued']
  },
  {
    id: 'bus_etusa_31',
    name: 'Ligne ETUSA 31 (Bab El Oued - Maurice Audin - 1er Mai)',
    type: 'bus',
    color: '#FFA000',
    stations: ['b_bab_el_oued', 'b_tafourah', 'b_audin', 'b_mai']
  },
  {
    id: 'bus_etusa_32',
    name: 'Ligne ETUSA 32 (1er Mai - Hydra - Ben Aknoun)',
    type: 'bus',
    color: '#FF8F00',
    stations: ['b_mai', 'b_hydra', 'b_ben_aknoun']
  },
  {
    id: 'bus_etusa_34',
    name: 'Ligne ETUSA 34 (1er Mai - El Biar - Chevalley)',
    type: 'bus',
    color: '#E65100',
    stations: ['b_mai', 'b_el_biar', 'b_chevalley']
  },
  {
    id: 'bus_etusa_36',
    name: 'Ligne ETUSA 36 (1er Mai - Kouba)',
    type: 'bus',
    color: '#F57C00',
    stations: ['b_mai', 'b_kouba']
  },
  {
    id: 'bus_etusa_43',
    name: 'Ligne ETUSA 43 (1er Mai - Bab El Oued)',
    type: 'bus',
    color: '#D97706',
    stations: ['b_mai', 'b_audin', 'b_bab_el_oued']
  },
  {
    id: 'bus_etusa_48',
    name: 'Ligne ETUSA 48 (1er Mai - Hydra - Ben Aknoun)',
    type: 'bus',
    color: '#EF6C00',
    stations: ['b_mai', 'b_hydra', 'b_ben_aknoun']
  },
  {
    id: 'bus_etusa_54',
    name: 'Ligne ETUSA 54 (Maurice Audin - El Biar - Ben Aknoun)',
    type: 'bus',
    color: '#FB8C00',
    stations: ['b_audin', 'b_el_biar', 'b_ben_aknoun']
  },
  {
    id: 'bus_etusa_65',
    name: 'Ligne ETUSA 65 (Tafourah - Hydra - Birmandreis)',
    type: 'bus',
    color: '#F59E0B',
    stations: ['b_tafourah', 'b_hydra', 'b_birmandreis']
  },
  {
    id: 'bus_etusa_67',
    name: 'Ligne ETUSA 67 (Tafourah - Hydra - Bouzaréah)',
    type: 'bus',
    color: '#FF9800',
    stations: ['b_tafourah', 'b_hydra', 'b_bouzareah']
  },
  {
    id: 'bus_etusa_72',
    name: 'Ligne ETUSA 72 (Ben Aknoun - Dely Ibrahim - Staouéli)',
    type: 'bus',
    color: '#E65100',
    stations: ['b_ben_aknoun', 'b_dely_brahim', 'b_cheraga', 'b_staoueli']
  },
  {
    id: 'bus_etusa_88',
    name: 'Ligne ETUSA 88 (1er Mai - Bachdjerrah - El Harrach)',
    type: 'bus',
    color: '#F57F17',
    stations: ['b_mai', 'b_bachdjerrah', 'b_harrach']
  },
  {
    id: 'bus_etusa_89',
    name: 'Ligne ETUSA 89 (1er Mai - Kouba - Bachdjerrah)',
    type: 'bus',
    color: '#FF8F00',
    stations: ['b_mai', 'b_kouba', 'b_bachdjerrah']
  },
  {
    id: 'bus_etusa_98',
    name: 'Ligne ETUSA 98 (1er Mai - Bordj El Bahri - Aïn Taya)',
    type: 'bus',
    color: '#E65100',
    stations: ['b_mai', 'b_harrach', 'b_bordj_bahri', 'b_ain_taya']
  },
  {
    id: 'bus_etusa_99',
    name: "Ligne ETUSA Navette Aérobus (1er Mai / Tafourah - Aéroport d'Alger)",
    type: 'bus',
    color: '#E65100',
    stations: ['b_mai', 'b_tafourah', 'b_aeroport']
  },
  {
    id: 'bus_etusa_100',
    name: 'Ligne ETUSA 100 (Place des Martyrs - Chevalley - Ben Aknoun)',
    type: 'bus',
    color: '#F57C00',
    stations: ['b_martyrs', 'b_bab_el_oued', 'b_chevalley', 'b_ben_aknoun']
  },
  {
    id: 'bus_etusa_101',
    name: 'Ligne ETUSA 101 (Place des Martyrs - Aïn Benian - Zéralda)',
    type: 'bus',
    color: '#D97706',
    stations: ['b_martyrs', 'b_ain_benian', 'b_zeralda']
  },
  {
    id: 'bus_etusa_107',
    name: 'Ligne ETUSA 107 (1er Mai - Birkhadem - Saoula)',
    type: 'bus',
    color: '#EA580C',
    stations: ['b_mai', 'b_birmandreis', 'b_birkhadem', 'b_saoula']
  },
  {
    id: 'bus_etusa_111',
    name: 'Ligne ETUSA 111 (Ben Aknoun - Staouéli - Palm Beach)',
    type: 'bus',
    color: '#F59E0B',
    stations: ['b_ben_aknoun', 'b_staoueli', 'b_palm_beach']
  },
  {
    id: 'bus_etusa_113',
    name: 'Ligne ETUSA 113 (Tafourah - Chevalley - Aïn Benian)',
    type: 'bus',
    color: '#FF6F00',
    stations: ['b_tafourah', 'b_chevalley', 'b_ain_benian']
  },
  {
    id: 'bus_etusa_631',
    name: 'Ligne ETUSA 631 (1er Mai - Ruisseau - Kouba)',
    type: 'bus',
    color: '#FF8F00',
    stations: ['b_mai', 'b_kouba']
  },
  {
    id: 'bus_etusa_731',
    name: 'Ligne ETUSA 731 (Ben Aknoun - Baba Hassen - Douera)',
    type: 'bus',
    color: '#E65100',
    stations: ['b_ben_aknoun', 'b_baba_hassen', 'b_douera']
  },
  {
    id: 'bus_etusa_07',
    name: 'Ligne ETUSA 07 (Place des Martyrs - Triolet - Notre Dame d\'Afrique)',
    type: 'bus',
    color: '#D97706',
    stations: ['b_martyrs', 'b_bab_el_oued', 'tel_nd_afrique']
  },
  {
    id: 'bus_etusa_18',
    name: 'Ligne ETUSA 18 (Tafourah - El Biar - Chevalley)',
    type: 'bus',
    color: '#F59E0B',
    stations: ['b_tafourah', 'b_el_biar', 'b_chevalley']
  },
  {
    id: 'bus_etusa_50',
    name: 'Ligne ETUSA 50 (Tafourah - Ben Aknoun Express Autoroute)',
    type: 'bus',
    color: '#EA580C',
    stations: ['b_tafourah', 'b_ben_aknoun']
  },
  {
    id: 'bus_etusa_87',
    name: 'Ligne ETUSA 87 (Place des Martyrs - 1er Mai - Aïn Naâdja)',
    type: 'bus',
    color: '#B45309',
    stations: ['b_martyrs', 'b_mai', 'm_ain_nadja_station']
  },
  {
    id: 'bus_etusa_102',
    name: 'Ligne ETUSA 102 (Ben Aknoun - Chéraga - Zéralda)',
    type: 'bus',
    color: '#D97706',
    stations: ['b_ben_aknoun', 'b_cheraga', 'b_zeralda']
  },
  {
    id: 'bus_etusa_104',
    name: 'Ligne ETUSA 104 (Place des Martyrs - Birmandreis - Birkhadem)',
    type: 'bus',
    color: '#EA580C',
    stations: ['b_martyrs', 'b_birmandreis', 'b_birkhadem']
  },

  // --- PRIVATE BUS LINES ("Bus Privés") ---
  {
    id: 'bus_priv_p1',
    name: 'Bus Privé P1 (Bab Ezzouar Fac - Belfort - El Harrach)',
    type: 'bus_priv',
    color: '#00ACC1',
    stations: ['bp_bab_ezzouar_fac', 'bp_bab_ezzouar_centre', 'bp_belfort', 'bp_harrach_centre']
  },
  {
    id: 'bus_priv_p2',
    name: 'Bus Privé P2 (Ben Aknoun - Chevalley - Place des Martyrs)',
    type: 'bus_priv',
    color: '#00B8D4',
    stations: ['bp_ben_aknoun_gare', 'bp_dely_brahim', 'bp_chevalley', 'bp_triolet', 'bp_martyrs']
  },
  {
    id: 'bus_priv_p3',
    name: 'Bus Privé P3 (Kouba - Ruisseau - 1er Mai - Audin)',
    type: 'bus_priv',
    color: '#0097A7',
    stations: ['bp_kouba_eglise', 'bp_jolie_vue', 'bp_ruisseau', 'bp_mai', 'bp_audin']
  },
  {
    id: 'bus_priv_p4',
    name: 'Bus Privé P4 (Chéraga - Dely Ibrahim - Ben Aknoun)',
    type: 'bus_priv',
    color: '#00838F',
    stations: ['bp_cheraga', 'bp_dely_brahim', 'bp_ben_aknoun_gare']
  },
  {
    id: 'bus_priv_p5',
    name: 'Bus Privé P5 (Baraki - Gué de Constantine - El Harrach)',
    type: 'bus_priv',
    color: '#006064',
    stations: ['bp_baraki', 'm_constantine', 'bp_harrach_centre']
  },
  {
    id: 'bus_priv_p6',
    name: 'Bus Privé P6 (Chéraga - El Biar - 1er Mai)',
    type: 'bus_priv',
    color: '#00ACC1',
    stations: ['bp_cheraga', 'bp_dely_brahim', 'bp_ben_aknoun_gare', 'bp_mai']
  },
  {
    id: 'bus_priv_p7',
    name: 'Bus Privé P7 (Aïn Taya - Bordj El Bahri - Bab Ezzouar USTHB)',
    type: 'bus_priv',
    color: '#00B8D4',
    stations: ['b_ain_taya', 'b_bordj_bahri', 'bp_bab_ezzouar_fac']
  },
  {
    id: 'bus_priv_p8',
    name: 'Bus Privé P8 (Rouïba - Réghaïa - Dergana)',
    type: 'bus_priv',
    color: '#0097A7',
    stations: ['t_rouiba', 't_reghaia', 'tr_dergana']
  },
  {
    id: 'bus_priv_p9',
    name: 'Bus Privé P9 (Birtouta - Saoula - Birkhadem - 1er Mai)',
    type: 'bus_priv',
    color: '#00838F',
    stations: ['b_birtouta_ville', 'b_saoula', 'b_birkhadem', 'bp_mai']
  },
  {
    id: 'bus_priv_p10',
    name: 'Bus Privé P10 (Zéralda - Staouéli - Chéraga - Ben Aknoun)',
    type: 'bus_priv',
    color: '#006064',
    stations: ['b_zeralda', 'b_staoueli', 'bp_cheraga', 'bp_ben_aknoun_gare']
  },
  {
    id: 'bus_priv_p11',
    name: 'Bus Privé P11 (Baraki - Les Eucalyptus - Bachdjerrah)',
    type: 'bus_priv',
    color: '#00ACC1',
    stations: ['bp_baraki', 'b_eucalyptus', 'b_bachdjerrah', 'bp_ruisseau']
  },
  {
    id: 'bus_priv_p12',
    name: 'Bus Privé P12 (Bordj El Kiffan - Bab Ezzouar - El Harrach)',
    type: 'bus_priv',
    color: '#00838F',
    stations: ['tr_kiffan', 'bp_bab_ezzouar_centre', 'bp_harrach_centre']
  },
  {
    id: 'bus_priv_p13',
    name: 'Bus Privé P13 (Chevalley - Dely Ibrahim - Baba Hassen - Douera)',
    type: 'bus_priv',
    color: '#00ACC1',
    stations: ['bp_chevalley', 'bp_dely_brahim', 'b_baba_hassen', 'b_douera']
  },
  {
    id: 'bus_priv_p14',
    name: 'Bus Privé P14 (Aïn Benian - Staouéli - Zéralda)',
    type: 'bus_priv',
    color: '#00B8D4',
    stations: ['b_ain_benian', 'b_staoueli', 'b_zeralda']
  },
  {
    id: 'bus_priv_p15',
    name: 'Bus Privé P15 (Ben Aknoun - Birmandreis - Saoula)',
    type: 'bus_priv',
    color: '#0097A7',
    stations: ['bp_ben_aknoun_gare', 'b_birmandreis', 'b_saoula']
  },
  {
    id: 'bus_priv_p16',
    name: 'Bus Privé P16 (Place des Martyrs - Triolet - Bouzaréah)',
    type: 'bus_priv',
    color: '#006064',
    stations: ['bp_martyrs', 'bp_triolet', 'b_bouzareah']
  }
];

export const INITIAL_DISRUPTIONS: Disruption[] = [
  {
    id: 'd1',
    title: 'Maintenance de signalisation',
    description: 'Ralentissement à prévoir entre la station Tafourah et Khelifa Boukhalfa sur la ligne de Métro 1.',
    type: 'metro',
    severity: 'warning',
    lineId: 'metro_m1',
    timestamp: '2026-08-04T08:00:00Z',
    active: true
  },
  {
    id: 'd2',
    title: 'Travaux de voirie - Tramway',
    description: 'Le trafic du Tramway est perturbé près de la station Université USTHB en raison de travaux d\'urgence sur les voies.',
    type: 'tram',
    severity: 'critical',
    lineId: 'tram_t1',
    timestamp: '2026-08-04T07:30:00Z',
    active: true
  },
  {
    id: 'd3',
    title: 'Amélioration de service - Train RER Banlieue',
    description: 'Fréquence augmentée sur la ligne Alger - Reghaia - Thenia et la Navette Express Aéroport.',
    type: 'train',
    severity: 'info',
    lineId: 'train_rer_est',
    timestamp: '2026-08-04T06:00:00Z',
    active: true
  },
  {
    id: 'd4',
    title: 'Maintenance préventive - Télécabine',
    description: 'La télécabine Oued Koriche (Triolet - Bouzaréah) subit des contrôles techniques de sécurité.',
    type: 'telepherique',
    severity: 'warning',
    lineId: 'tel_line_bouzareah',
    timestamp: '2026-08-04T08:15:00Z',
    active: true
  }
];
