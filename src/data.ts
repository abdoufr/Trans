import { Station, LineData, Disruption } from './types';

export const STATIONS: Station[] = [
  // --- METRO LINE 1 ---
  {
    id: 'm_martyrs',
    name: 'Place des Martyrs',
    nameAr: 'ساحة الشهداء',
    type: 'metro',
    lat: 36.7801,
    lng: 3.0601,
    lines: ['M1'],
    connections: ['m_boumendjel', 'bp_martyrs', 'b_bab_el_oued'],
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
    connections: ['m_boumendjel', 'm_boukhalfa', 'b_tafourah', 't_agha'],
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
    connections: ['m_boukhalfa', 'm_idir', 'b_mai', 'bp_mai'],
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
    connections: ['m_hamma', 'm_ruisseau'],
    schedule: { firstDeparture: '05:15', lastDeparture: '23:15', frequencyPeak: 4, frequencyOffPeak: 8 }
  },
  {
    id: 'm_ruisseau',
    name: 'Les Fusillés (Ruisseau)',
    nameAr: 'العناصر - الرويسو',
    type: 'metro',
    lat: 36.7425,
    lng: 3.0825,
    lines: ['M1', 'Tram T1'],
    connections: ['m_jardin', 'm_amirouche', 'tr_ruisseau', 'tr_les_fusilles', 'bp_ruisseau'],
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
    name: 'Hai El Badr',
    nameAr: 'حي البدر',
    type: 'metro',
    lat: 36.7245,
    lng: 3.1115,
    lines: ['M1'],
    connections: ['m_soleil', 'm_ateliers', 'm_constantine', 'm_nadja'],
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
    connections: ['m_ateliers', 'm_harrach_gare', 'bp_harrach_centre'],
    schedule: { firstDeparture: '05:31', lastDeparture: '23:31', frequencyPeak: 5, frequencyOffPeak: 10 }
  },
  {
    id: 'm_harrach_gare',
    name: 'El Harrach Gare',
    nameAr: 'الحراش محطة القطار',
    type: 'metro',
    lat: 36.7225,
    lng: 3.1415,
    lines: ['M1', 'Train Est'],
    connections: ['m_harrach_centre', 't_harrach'],
    schedule: { firstDeparture: '05:34', lastDeparture: '23:34', frequencyPeak: 5, frequencyOffPeak: 10 }
  },
  {
    id: 'm_constantine',
    name: 'Gué de Constantine',
    nameAr: 'جسر قسنطينة',
    type: 'metro',
    lat: 36.7080,
    lng: 3.1280,
    lines: ['M1 (Branch A)'],
    connections: ['m_badr', 'm_nadja', 't_gue_de_constantine'],
    schedule: { firstDeparture: '05:29', lastDeparture: '23:29', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'm_nadja',
    name: 'Aïn Naâdja',
    nameAr: 'عين النعجة',
    type: 'metro',
    lat: 36.7020,
    lng: 3.1180,
    lines: ['M1 (Branch A)'],
    connections: ['m_badr', 'm_constantine'],
    schedule: { firstDeparture: '05:32', lastDeparture: '23:32', frequencyPeak: 6, frequencyOffPeak: 12 }
  },

  // --- TRAMWAY LINES (T1) ---
  {
    id: 'tr_ruisseau',
    name: 'Ruisseau (Tram)',
    nameAr: 'الرويسو (ترامواي)',
    type: 'tram',
    lat: 36.7425,
    lng: 3.0825,
    lines: ['Tram T1'],
    connections: ['m_ruisseau', 'tr_les_fusilles', 'bp_ruisseau'],
    schedule: { firstDeparture: '05:30', lastDeparture: '23:15', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_les_fusilles',
    name: 'Les Fusillés (Tram)',
    nameAr: 'العناصر (ترامواي)',
    type: 'tram',
    lat: 36.7420,
    lng: 3.0835,
    lines: ['Tram T1'],
    connections: ['tr_ruisseau', 'tr_maaza', 'm_ruisseau'],
    schedule: { firstDeparture: '05:31', lastDeparture: '23:16', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_maaza',
    name: 'Tripoli - Maaza',
    nameAr: 'طرابلس - معزة',
    type: 'tram',
    lat: 36.7410,
    lng: 3.0900,
    lines: ['Tram T1'],
    connections: ['tr_les_fusilles', 'tr_mosquee'],
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
    connections: ['tr_hamadache', 'tr_caroubier'],
    schedule: { firstDeparture: '05:43', lastDeparture: '23:28', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_caroubier',
    name: 'Caroubier (Tram)',
    nameAr: 'الخروبة (ترامواي)',
    type: 'tram',
    lat: 36.7360,
    lng: 3.1280,
    lines: ['Tram T1'],
    connections: ['tr_thaalibia', 'tr_glaciere', 't_caroubier'],
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
    nameAr: 'جامعة باب الزوار',
    type: 'tram',
    lat: 36.7190,
    lng: 3.1810,
    lines: ['Tram T1'],
    connections: ['tr_bab_ezzouar_pont', 'tr_centre_commercial', 'bp_bab_ezzouar_fac'],
    schedule: { firstDeparture: '06:06', lastDeparture: '23:51', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_centre_commercial',
    name: 'Bab Ezzouar - Centre Commercial',
    nameAr: 'باب الزوار - المركز التجاري',
    type: 'tram',
    lat: 36.7120,
    lng: 3.1950,
    lines: ['Tram T1'],
    connections: ['tr_usthb', 'tr_cite_u', 'bp_bab_ezzouar_centre'],
    schedule: { firstDeparture: '06:10', lastDeparture: '23:55', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_cite_u',
    name: 'Cité Universitaire',
    nameAr: 'الحي الجامعي',
    type: 'tram',
    lat: 36.7150,
    lng: 3.2050,
    lines: ['Tram T1'],
    connections: ['tr_centre_commercial', 'tr_smail_yefsah'],
    schedule: { firstDeparture: '06:13', lastDeparture: '23:58', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_smail_yefsah',
    name: 'Bab Ezzouar - Smaïl Yefsah',
    nameAr: 'باب الزوار - إسماعيل يفصح',
    type: 'tram',
    lat: 36.7180,
    lng: 3.2150,
    lines: ['Tram T1'],
    connections: ['tr_cite_u', 'tr_bordj_kiffan'],
    schedule: { firstDeparture: '06:16', lastDeparture: '00:01', frequencyPeak: 6, frequencyOffPeak: 12 }
  },
  {
    id: 'tr_bordj_kiffan',
    name: 'Bordj El Kiffan',
    nameAr: 'برج الكيفان',
    type: 'tram',
    lat: 36.7490,
    lng: 3.2350,
    lines: ['Tram T1'],
    connections: ['tr_smail_yefsah', 'tr_ben_mred'],
    schedule: { firstDeparture: '06:22', lastDeparture: '00:07', frequencyPeak: 8, frequencyOffPeak: 15 }
  },
  {
    id: 'tr_ben_mred',
    name: "Ben M'red",
    nameAr: "بن مراد",
    type: 'tram',
    lat: 36.7580,
    lng: 3.2550,
    lines: ['Tram T1'],
    connections: ['tr_bordj_kiffan', 'tr_dergana'],
    schedule: { firstDeparture: '06:27', lastDeparture: '00:12', frequencyPeak: 8, frequencyOffPeak: 15 }
  },
  {
    id: 'tr_dergana',
    name: 'Dergana Centre',
    nameAr: 'درقانة وسط',
    type: 'tram',
    lat: 36.7720,
    lng: 3.2750,
    lines: ['Tram T1'],
    connections: ['tr_ben_mred'],
    schedule: { firstDeparture: '06:33', lastDeparture: '00:18', frequencyPeak: 8, frequencyOffPeak: 15 }
  },

  // --- TRAIN / BANLIEUE (SNTF RER) ---
  {
    id: 't_alger',
    name: 'Alger Gare Centrale',
    nameAr: 'محطة قطار الجزائر',
    type: 'train',
    lat: 36.7710,
    lng: 3.0645,
    lines: ['RER Est', 'RER Ouest'],
    connections: ['t_agha', 'm_tafourah'],
    schedule: { firstDeparture: '05:40', lastDeparture: '21:30', frequencyPeak: 15, frequencyOffPeak: 30 }
  },
  {
    id: 't_agha',
    name: 'Agha',
    nameAr: 'آغا',
    type: 'train',
    lat: 36.7640,
    lng: 3.0595,
    lines: ['RER Est', 'RER Ouest'],
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
    name: 'Hussein Dey',
    nameAr: 'حسين داي',
    type: 'train',
    lat: 36.7430,
    lng: 3.1020,
    lines: ['RER Est'],
    connections: ['t_al_aln', 't_caroubier'],
    schedule: { firstDeparture: '05:49', lastDeparture: '21:39', frequencyPeak: 15, frequencyOffPeak: 30 }
  },
  {
    id: 't_caroubier',
    name: 'Caroubier (Train)',
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
    name: 'El Harrach Gare (Train)',
    nameAr: 'الحراش محطة القطار',
    type: 'train',
    lat: 36.7225,
    lng: 3.1415,
    lines: ['RER Est'],
    connections: ['t_caroubier', 't_oued_smar', 'm_harrach_gare'],
    schedule: { firstDeparture: '05:58', lastDeparture: '21:48', frequencyPeak: 15, frequencyOffPeak: 30 }
  },
  {
    id: 't_oued_smar',
    name: 'Oued Smar',
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
    name: 'Bab Ezzouar (Train)',
    nameAr: 'باب الزوار (محطة القطار)',
    type: 'train',
    lat: 36.7160,
    lng: 3.1900,
    lines: ['RER Est'],
    connections: ['t_oued_smar', 't_dar_el_beida'],
    schedule: { firstDeparture: '06:03', lastDeparture: '21:53', frequencyPeak: 20, frequencyOffPeak: 40 }
  },
  {
    id: 't_dar_el_beida',
    name: 'Dar El Beïda',
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
    name: 'Rouïba',
    nameAr: 'رويبة',
    type: 'train',
    lat: 36.7210,
    lng: 3.2850,
    lines: ['RER Est'],
    connections: ['t_dar_el_beida', 't_reghaia'],
    schedule: { firstDeparture: '06:14', lastDeparture: '22:04', frequencyPeak: 20, frequencyOffPeak: 40 }
  },
  {
    id: 't_reghaia',
    name: 'Réghaïa',
    nameAr: 'رغاية',
    type: 'train',
    lat: 36.7340,
    lng: 3.3400,
    lines: ['RER Est'],
    connections: ['t_rouiba', 't_boudouaou'],
    schedule: { firstDeparture: '06:21', lastDeparture: '22:11', frequencyPeak: 20, frequencyOffPeak: 40 }
  },
  {
    id: 't_boudouaou',
    name: 'Boudouaou',
    nameAr: 'بودواو',
    type: 'train',
    lat: 36.7290,
    lng: 3.4050,
    lines: ['RER Est'],
    connections: ['t_reghaia', 't_boumerdes'],
    schedule: { firstDeparture: '06:28', lastDeparture: '22:18', frequencyPeak: 20, frequencyOffPeak: 40 }
  },
  {
    id: 't_boumerdes',
    name: 'Boumerdès',
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
    name: 'Thénia',
    nameAr: 'الثنية',
    type: 'train',
    lat: 36.7250,
    lng: 3.5550,
    lines: ['RER Est'],
    connections: ['t_boumerdes'],
    schedule: { firstDeparture: '06:40', lastDeparture: '22:30', frequencyPeak: 30, frequencyOffPeak: 60 }
  },

  // --- TRAIN BANLIEUE OUEST / SUD-OUEST ---
  {
    id: 't_gue_de_constantine',
    name: 'Gué de Constantine (Train)',
    nameAr: 'محطة قطار جسر قسنطينة',
    type: 'train',
    lat: 36.7080,
    lng: 3.1280,
    lines: ['RER Ouest'],
    connections: ['t_agha', 't_birtouta', 'm_constantine'],
    schedule: { firstDeparture: '05:55', lastDeparture: '21:40', frequencyPeak: 25, frequencyOffPeak: 50 }
  },
  {
    id: 't_birtouta',
    name: 'Birtouta',
    nameAr: 'بئر توتة',
    type: 'train',
    lat: 36.6430,
    lng: 3.0150,
    lines: ['RER Ouest'],
    connections: ['t_gue_de_constantine', 't_sidi_abdallah', 't_blida'],
    schedule: { firstDeparture: '06:05', lastDeparture: '21:50', frequencyPeak: 25, frequencyOffPeak: 50 }
  },
  {
    id: 't_sidi_abdallah',
    name: 'Sidi Abdallah',
    nameAr: 'سيدي عبد الله',
    type: 'train',
    lat: 36.6850,
    lng: 2.8750,
    lines: ['RER Ouest'],
    connections: ['t_birtouta', 't_univ_sidi_abdallah'],
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
    name: 'Zéralda',
    nameAr: 'زرالدة',
    type: 'train',
    lat: 36.7120,
    lng: 2.8450,
    lines: ['RER Ouest'],
    connections: ['t_univ_sidi_abdallah'],
    schedule: { firstDeparture: '06:20', lastDeparture: '22:06', frequencyPeak: 30, frequencyOffPeak: 60 }
  },
  {
    id: 't_blida',
    name: 'Blida Gare',
    nameAr: 'محطة قطار البليدة',
    type: 'train',
    lat: 36.4800,
    lng: 2.8310,
    lines: ['RER Ouest'],
    connections: ['t_birtouta', 't_el_affroun'],
    schedule: { firstDeparture: '06:10', lastDeparture: '22:10', frequencyPeak: 20, frequencyOffPeak: 40 }
  },
  {
    id: 't_el_affroun',
    name: 'El Affroun',
    nameAr: 'العفرون',
    type: 'train',
    lat: 36.4670,
    lng: 2.6250,
    lines: ['RER Ouest'],
    connections: ['t_blida'],
    schedule: { firstDeparture: '06:25', lastDeparture: '22:25', frequencyPeak: 20, frequencyOffPeak: 40 }
  },

  // --- BUS HUBS (ETUSA) ---
  {
    id: 'b_mai',
    name: 'Station ETUSA 1er Mai',
    nameAr: 'محطة أول ماي (إيتوزا)',
    type: 'bus',
    lat: 36.7592,
    lng: 3.0520,
    lines: ['Bus 14', 'Bus 16', 'Bus 31', 'Bus 48'],
    connections: ['m_mai', 'b_audin', 'bp_mai'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:30', frequencyPeak: 10, frequencyOffPeak: 20 }
  },
  {
    id: 'b_audin',
    name: 'Station ETUSA Place Maurice Audin',
    nameAr: 'محطة أودان (إيتوزا)',
    type: 'bus',
    lat: 36.7680,
    lng: 3.0560,
    lines: ['Bus 31', 'Bus 32', 'Bus 54'],
    connections: ['b_mai', 'b_tafourah', 'bp_audin'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:30', frequencyPeak: 10, frequencyOffPeak: 20 }
  },
  {
    id: 'b_tafourah',
    name: 'Station ETUSA Tafourah',
    nameAr: 'محطة تافورة (إيتوزا)',
    type: 'bus',
    lat: 36.7685,
    lng: 3.0580,
    lines: ['Bus 14', 'Bus 16', 'Bus 67', 'Bus 113'],
    connections: ['b_audin', 'm_tafourah'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:30', frequencyPeak: 10, frequencyOffPeak: 20 }
  },
  {
    id: 'b_ben_aknoun',
    name: 'Station ETUSA Ben Aknoun',
    nameAr: 'محطة بن عكنون (إيتوزا)',
    type: 'bus',
    lat: 36.7530,
    lng: 3.0030,
    lines: ['Bus 32', 'Bus 48', 'Bus 100'],
    connections: ['b_chevalley', 'bp_ben_aknoun_gare', 'b_hydra'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:00', frequencyPeak: 12, frequencyOffPeak: 25 }
  },
  {
    id: 'b_chevalley',
    name: 'Station ETUSA Chevalley',
    nameAr: 'محطة شوالي (إيتوزا)',
    type: 'bus',
    lat: 36.7680,
    lng: 2.9980,
    lines: ['Bus 100', 'Bus 113'],
    connections: ['b_ben_aknoun', 'bp_chevalley', 'b_bouzareah'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:00', frequencyPeak: 12, frequencyOffPeak: 25 }
  },
  {
    id: 'b_bab_el_oued',
    name: 'Station ETUSA Bab El Oued',
    nameAr: 'محطة باب الواد (إيتوزا)',
    type: 'bus',
    lat: 36.7850,
    lng: 3.0500,
    lines: ['Bus 31', 'Bus 100'],
    connections: ['m_martyrs', 'bp_triolet'],
    schedule: { firstDeparture: '05:30', lastDeparture: '22:00', frequencyPeak: 12, frequencyOffPeak: 25 }
  },
  {
    id: 'b_hydra',
    name: 'Station ETUSA Hydra',
    nameAr: 'محطة حيدرة (إيتوزا)',
    type: 'bus',
    lat: 36.7420,
    lng: 3.0250,
    lines: ['Bus 48', 'Bus 67'],
    connections: ['b_ben_aknoun'],
    schedule: { firstDeparture: '05:40', lastDeparture: '21:30', frequencyPeak: 15, frequencyOffPeak: 30 }
  },
  {
    id: 'b_bouzareah',
    name: 'Station ETUSA Bouzaréah',
    nameAr: 'محطة بوزريعة (إيتوزا)',
    type: 'bus',
    lat: 36.7880,
    lng: 2.9920,
    lines: ['Bus 67'],
    connections: ['b_chevalley'],
    schedule: { firstDeparture: '05:40', lastDeparture: '21:30', frequencyPeak: 15, frequencyOffPeak: 30 }
  },

  // --- PRIVATE BUS STATIONS (Bus Privés - icon is cyan-500) ---
  {
    id: 'bp_bab_ezzouar_fac',
    name: 'Bab Ezzouar - Fac (Privé)',
    nameAr: 'جامعة باب الزوار (خاص)',
    type: 'bus_priv',
    lat: 36.7200,
    lng: 3.1830,
    lines: ['P1'],
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
    lines: ['P1'],
    connections: ['m_harrach_centre'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:00', frequencyPeak: 8, frequencyOffPeak: 15 }
  },
  // Private Line 2
  {
    id: 'bp_ben_aknoun_gare',
    name: 'Ben Aknoun Gare Routière (Privé)',
    nameAr: 'محطة بن عكنون (خاص)',
    type: 'bus_priv',
    lat: 36.7540,
    lng: 3.0040,
    lines: ['P2'],
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
    lines: ['P2'],
    connections: [],
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
    connections: ['b_bab_el_oued'],
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
    connections: ['m_martyrs'],
    schedule: { firstDeparture: '06:00', lastDeparture: '20:00', frequencyPeak: 5, frequencyOffPeak: 10 }
  },
  // Private Line 3
  {
    id: 'bp_kouba_eglise',
    name: 'Kouba La Croix (Privé)',
    nameAr: 'القبة القديمة (خاص)',
    type: 'bus_priv',
    lat: 36.7290,
    lng: 3.0850,
    lines: ['P3'],
    connections: [],
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
    lines: ['P3'],
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
    lines: ['P3'],
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
  }
];

export const LINES: LineData[] = [
  {
    id: 'metro_m1',
    name: 'Métro Ligne 1',
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
    color: '#C2185B', // Pinkish red
    stations: ['m_badr', 'm_constantine', 'm_nadja']
  },
  {
    id: 'tram_t1',
    name: 'Tramway T1',
    type: 'tram',
    color: '#1976D2', // Blue
    stations: [
      'tr_ruisseau', 'tr_les_fusilles', 'tr_maaza', 'tr_mosquee', 'tr_hamadache',
      'tr_thaalibia', 'tr_caroubier', 'tr_glaciere', 'tr_pont_est', 'tr_belfort',
      'tr_badi', 'tr_juillet', 'tr_bab_ezzouar_pont', 'tr_usthb', 'tr_centre_commercial',
      'tr_cite_u', 'tr_smail_yefsah', 'tr_bordj_kiffan', 'tr_ben_mred', 'tr_dergana'
    ]
  },
  {
    id: 'train_rer_est',
    name: 'Train de Banlieue (Est: Alger - Boumerdès - Thénia)',
    type: 'train',
    color: '#388E3C', // Green
    stations: [
      't_alger', 't_agha', 't_al_aln', 't_hussein_dey', 't_caroubier',
      't_harrach', 't_oued_smar', 't_bab_ezzouar', 't_dar_el_beida',
      't_rouiba', 't_reghaia', 't_boudouaou', 't_boumerdes', 't_thenia'
    ]
  },
  {
    id: 'train_rer_ouest',
    name: 'Train de Banlieue (Ouest/Sud-Ouest: Alger - Blida - El Affroun / Zéralda)',
    type: 'train',
    color: '#00796B', // Teal
    stations: [
      't_alger', 't_agha', 't_gue_de_constantine', 't_birtouta',
      't_sidi_abdallah', 't_univ_sidi_abdallah', 't_zeralda'
    ]
  },
  {
    id: 'train_rer_blida',
    name: 'Train de Banlieue (Sud-Ouest: Alger - Blida - El Affroun)',
    type: 'train',
    color: '#0288D1', // Cyan-blue train
    stations: [
      't_alger', 't_agha', 't_gue_de_constantine', 't_birtouta',
      't_blida', 't_el_affroun'
    ]
  },
  // --- ETUSA BUS LINES (Fully detailed and complete) ---
  {
    id: 'bus_etusa_31',
    name: 'Ligne ETUSA 31 (Bab El Oued - Maurice Audin - 1er Mai)',
    type: 'bus',
    color: '#FFA000', // Amber
    stations: ['b_bab_el_oued', 'b_tafourah', 'b_audin', 'b_mai']
  },
  {
    id: 'bus_etusa_48',
    name: 'Ligne ETUSA 48 (1er Mai - Hydra - Ben Aknoun)',
    type: 'bus',
    color: '#FF8F00', // Darker Amber
    stations: ['b_mai', 'b_hydra', 'b_ben_aknoun']
  },
  {
    id: 'bus_etusa_100',
    name: 'Ligne ETUSA 100 (Bab El Oued - Chevalley - Ben Aknoun)',
    type: 'bus',
    color: '#F57C00', // Orange-amber
    stations: ['b_bab_el_oued', 'b_chevalley', 'b_ben_aknoun']
  },
  {
    id: 'bus_etusa_67',
    name: 'Ligne ETUSA 67 (Tafourah - Hydra - Bouzaréah)',
    type: 'bus',
    color: '#EF6C00',
    stations: ['b_tafourah', 'b_hydra', 'b_bouzareah']
  },

  // --- PRIVATE BUS LINES ("Bus Privés") ---
  {
    id: 'bus_priv_p1',
    name: 'Bus Privé P1 (Bab Ezzouar Fac - Belfort - El Harrach)',
    type: 'bus_priv',
    color: '#00ACC1', // Cyan
    stations: ['bp_bab_ezzouar_fac', 'bp_bab_ezzouar_centre', 'bp_belfort', 'bp_harrach_centre']
  },
  {
    id: 'bus_priv_p2',
    name: 'Bus Privé P2 (Ben Aknoun - Chevalley - Place des Martyrs)',
    type: 'bus_priv',
    color: '#00B8D4', // Brighter Cyan
    stations: ['bp_ben_aknoun_gare', 'bp_dely_brahim', 'bp_chevalley', 'bp_triolet', 'bp_martyrs']
  },
  {
    id: 'bus_priv_p3',
    name: 'Bus Privé P3 (Kouba - Ruisseau - 1er Mai - Audin)',
    type: 'bus_priv',
    color: '#0097A7', // Deep Cyan
    stations: ['bp_kouba_eglise', 'bp_jolie_vue', 'bp_ruisseau', 'bp_mai', 'bp_audin']
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
    timestamp: '2026-07-11T08:00:00Z',
    active: true
  },
  {
    id: 'd2',
    title: 'Travaux de voirie - Tramway',
    description: 'Le trafic du Tramway est perturbé près de la station Université USTHB en raison de travaux d\'urgence sur les voies.',
    type: 'tram',
    severity: 'critical',
    lineId: 'tram_t1',
    timestamp: '2026-07-11T07:30:00Z',
    active: true
  },
  {
    id: 'd3',
    title: 'Amélioration de service - Train de Banlieue',
    description: 'Fréquence augmentée sur la ligne Alger - Reghaia - Thenia pour le week-end.',
    type: 'train',
    severity: 'info',
    lineId: 'train_rer_est',
    timestamp: '2026-07-11T06:00:00Z',
    active: true
  },
  {
    id: 'd4',
    title: 'Embouteillage - Bus Privé',
    description: 'Forts ralentissements sur la ligne P2 près de Dely Ibrahim en raison d\'un encombrement routier.',
    type: 'bus_priv',
    severity: 'warning',
    lineId: 'bus_priv_p2',
    timestamp: '2026-07-11T08:15:00Z',
    active: true
  }
];
