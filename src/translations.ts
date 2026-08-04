export type Language = 'fr' | 'ar' | 'dz' | 'en';

export interface Translations {
  appName: string;
  appSubtitle: string;
  liveStatus: string;
  offlineStatus: string;
  filterTitle: string;
  tabRoute: string;
  tabTimetable: string;
  tabAlerts: string;
  tabFavorites: string;
  filterMetro: string;
  filterTram: string;
  filterTrain: string;
  filterBus: string;
  filterBusPriv: string;
  filterTelepherique: string;
  originLabel: string;
  destLabel: string;
  selectStation: string;
  nearestGpsBtn: string;
  findRouteBtn: string;
  swapBtn: string;
  resetBtn: string;
  durationLabel: string;
  transfersLabel: string;
  costLabel: string;
  aiAdviceTitle: string;
  timelineTitle: string;
  startNavBtn: string;
  navActiveTitle: string;
  nextStepBtn: string;
  prevStepBtn: string;
  exitNavBtn: string;
  arrivedDest: string;
  liveAttente: string;
  reportIncident: string;
  favTitle: string;
  tabDirectLines: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  fr: {
    appName: "Kifach Nro7",
    appSubtitle: "Guide des Transports d'Alger & Banlieue",
    liveStatus: "Live Connecté",
    offlineStatus: "Mode Hors-ligne",
    filterTitle: "FILTRER LES MODES DE TRANSPORT SUR LA CARTE",
    tabRoute: "Itinéraires",
    tabTimetable: "Horaires",
    tabAlerts: "Alertes",
    tabFavorites: "Favoris",
    filterMetro: "🚇 Métro",
    filterTram: "🚊 Tramway",
    filterTrain: "🚆 RER SNTF",
    filterBus: "🚌 ETUSA",
    filterBusPriv: "🚌 Bus Privé",
    filterTelepherique: "🚡 Téléphérique",
    originLabel: "DÉPART",
    destLabel: "DESTINATION",
    selectStation: "Sélectionner la gare...",
    nearestGpsBtn: "📍 Ma Station GPS",
    findRouteBtn: "Trouver le meilleur itinéraire",
    swapBtn: "Inverser les stations",
    resetBtn: "Réinitialiser",
    durationLabel: "DURÉE TOTALE",
    transfersLabel: "CHANGEMENTS",
    costLabel: "COÛT ESTIMÉ",
    aiAdviceTitle: "Conseil de Bahdja Guide",
    timelineTitle: "FEUILLE DE ROUTE :",
    startNavBtn: "🚀 Démarrer la Navigation (Google Maps)",
    navActiveTitle: "Navigation GPS en Direct",
    nextStepBtn: "Étape Suivante ➔",
    prevStepBtn: "⬅ Étape Précédente",
    exitNavBtn: "Quitter la Navigation",
    arrivedDest: "🎉 Vous êtes arrivé à destination !",
    liveAttente: "📍 Attente live :",
    reportIncident: "Signaler un incident",
    favTitle: "Trajets Récurrents Favoris",
    tabDirectLines: "Lignes Directes",
  },
  ar: {
    appName: "كيفاش نروح",
    appSubtitle: "دليل المواصلات في ولاية الجزائر والعاصمة",
    liveStatus: "متصل مباشر",
    offlineStatus: "وضع بدون إنترنت",
    filterTitle: "تصفية وسائل النقل على الخريطة",
    tabRoute: "المسارات",
    tabTimetable: "المواعيد",
    tabAlerts: "التنبيهات",
    tabFavorites: "المفضلة",
    filterMetro: "🚇 مترو",
    filterTram: "🚊 ترامواي",
    filterTrain: "🚆 قطار SNTF",
    filterBus: "🚌 حافلات إيتوزا",
    filterBusPriv: "🚌 حافلات خاصة",
    filterTelepherique: "🚡 مصعد هوائي",
    originLabel: "الانطلاق",
    destLabel: "الوجهة",
    selectStation: "اختر المحطة...",
    nearestGpsBtn: "📍 أقرب محطة إليّ",
    findRouteBtn: "البحث عن أفضل مسار",
    swapBtn: "عكس المحطات",
    resetBtn: "إعادة ضبط",
    durationLabel: "الوقت الإجمالي",
    transfersLabel: "التحويلات",
    costLabel: "التكلفة التقديرية",
    aiAdviceTitle: "نصيحة بهجة غايد",
    timelineTitle: "مخطط الرحلة :",
    startNavBtn: "🚀 ابدأ الملاحة المباشرة (مثل Google Maps)",
    navActiveTitle: "التوجيه المباشر GPS",
    nextStepBtn: "الخطوة التالية ➔",
    prevStepBtn: "⬅ الخطوة السابقة",
    exitNavBtn: "خروج من الملاحة",
    arrivedDest: "🎉 لقد وصلت إلى وجهتك بنجاح !",
    liveAttente: "📍 الانتظار المباشر :",
    reportIncident: "الإبلاغ عن خلل",
    favTitle: "الرحلات المفضلة",
    tabDirectLines: "الخطوط المباشرة",
  },
  dz: {
    appName: "كيفاش نروح",
    appSubtitle: "دليل النقل في دزاير والعاصمة",
    liveStatus: "كونيكتي لايف",
    offlineStatus: "أوفلاين بلا إنترنت",
    filterTitle: "خير الترانسبور فالماب",
    tabRoute: "طريق",
    tabTimetable: "وقات",
    tabAlerts: "الاشعارات",
    tabFavorites: "المفضلة",
    filterMetro: "🚇 مترو",
    filterTram: "🚊 ترامواي",
    filterTrain: "🚆 تران SNTF",
    filterBus: "🚌 إيتوزا",
    filterBusPriv: "🚌 كارس بريفي",
    filterTelepherique: "🚡 تلفريك",
    originLabel: "منين تبدأ",
    destLabel: "وين رايح",
    selectStation: "خير المحطة...",
    nearestGpsBtn: "📍 أقرب محطة ليا",
    findRouteBtn: "حوس على أحسن طريق",
    swapBtn: "قلب المحطات",
    resetBtn: "عاود ابدأ",
    durationLabel: "الوقت كامل",
    transfersLabel: "شحال تبدل",
    costLabel: "السومة بالتقريب",
    aiAdviceTitle: "نصيحة بهجة",
    timelineTitle: "خطوات الرحلة :",
    startNavBtn: "🚀 ابدأ الجي بي اس (Démarrer)",
    navActiveTitle: "التوجيه المباشر بالجي بي اس",
    nextStepBtn: "اللي موراها ➔",
    prevStepBtn: "⬅ اللي قبلها",
    exitNavBtn: "حبس الملاحة",
    arrivedDest: "🎉 لحقت لوجهتك بالصحة والراحة !",
    liveAttente: "📍 الوقت المتبقي :",
    reportIncident: "سجل مشكل فالطريق",
    favTitle: "التنقلات المفضلة",
    tabDirectLines: "خطوط ديريكت",
  },
  en: {
    appName: "Kifach Nro7",
    appSubtitle: "Algiers & Suburbs Transit Guide",
    liveStatus: "Live Connected",
    offlineStatus: "Offline Mode",
    filterTitle: "FILTER TRANSPORT MODES ON MAP",
    tabRoute: "Routes",
    tabTimetable: "Schedules",
    tabAlerts: "Alerts",
    tabFavorites: "Favorites",
    filterMetro: "🚇 Metro",
    filterTram: "🚊 Tramway",
    filterTrain: "🚆 RER Train",
    filterBus: "🚌 ETUSA Bus",
    filterBusPriv: "🚌 Private Bus",
    filterTelepherique: "🚡 Cable Car",
    originLabel: "ORIGIN",
    destLabel: "DESTINATION",
    selectStation: "Select station...",
    nearestGpsBtn: "📍 My Nearest Station",
    findRouteBtn: "Find Best Route",
    swapBtn: "Swap Stations",
    resetBtn: "Reset",
    durationLabel: "TOTAL DURATION",
    transfersLabel: "TRANSFERS",
    costLabel: "ESTIMATED COST",
    aiAdviceTitle: "Bahdja Guide Advice",
    timelineTitle: "ROUTE STEPS:",
    startNavBtn: "🚀 Start Live Navigation (Google Maps Mode)",
    navActiveTitle: "Live GPS Navigation",
    nextStepBtn: "Next Step ➔",
    prevStepBtn: "⬅ Previous Step",
    exitNavBtn: "Exit Navigation",
    arrivedDest: "🎉 You have arrived at your destination!",
    liveAttente: "📍 Live wait:",
    reportIncident: "Report incident",
    favTitle: "Saved Favorite Routes",
    tabDirectLines: "Direct Lines",
  }
};
