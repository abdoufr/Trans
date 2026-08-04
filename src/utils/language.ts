import { Station, RouteStep, TransportType } from '../types';
import { Language } from '../translations';

/**
 * Retourne le nom de la station selon la langue sélectionnée par l'utilisateur
 */
export function getStationName(station: Station | undefined, lang: Language): string {
  if (!station) return '';
  if ((lang === 'ar' || lang === 'dz') && station.nameAr) {
    return station.nameAr;
  }
  return station.name;
}

/**
 * Traduit le nom d'un mode de transport selon la langue
 */
export function getTransportModeName(type: TransportType | 'walk', lang: Language): string {
  if (type === 'walk') {
    if (lang === 'ar') return 'مشي';
    if (lang === 'dz') return 'مشي على الرجلين';
    if (lang === 'en') return 'Walking';
    return 'Marche';
  }

  const modes: Record<TransportType, Record<Language, string>> = {
    metro: { fr: 'Métro', ar: 'مترو', dz: 'مترو', en: 'Metro' },
    tram: { fr: 'Tramway', ar: 'ترامواي', dz: 'ترامواي', en: 'Tramway' },
    train: { fr: 'Train RER', ar: 'قطار SNTF', dz: 'تران SNTF', en: 'RER Train' },
    bus: { fr: 'Bus ETUSA', ar: 'حافلة إيتوزا', dz: 'إيتوزا', en: 'ETUSA Bus' },
    bus_priv: { fr: 'Bus Privé', ar: 'حافلة خاصة', dz: 'كار بريفي', en: 'Private Bus' },
    telepherique: { fr: 'Téléphérique', ar: 'مصعد هوائي', dz: 'تلفريك', en: 'Cable Car' },
  };

  return modes[type as TransportType]?.[lang] || type.toUpperCase();
}

/**
 * Génère l'instruction de l'étape de feuille de route dans la langue choisie
 */
export function formatStepInstruction(
  step: RouteStep,
  lang: Language,
  stations: Station[]
): string {
  const findStation = (id: string, name: string) => {
    const st = stations.find((s) => s.id === id || s.name === name);
    return getStationName(st, lang) || name;
  };

  const stName = findStation(step.stationId, step.stationName);
  const stopCount = step.intermediateStops ? step.intermediateStops.length + 1 : 1;

  // 1. Étape de départ
  if (step.instruction.includes('Départ de la station') || step.instruction.includes('Départ de')) {
    if (lang === 'ar') return `📍 الانطلاق من محطة ${stName}`;
    if (lang === 'dz') return `📍 ابدأ من محطة ${stName}`;
    if (lang === 'en') return `📍 Departure from ${stName} Station`;
    return `📍 Départ de la station ${stName}`;
  }

  // 2. Étape d'arrivée
  if (step.instruction.includes('Arrivée à la station') || step.instruction.includes('Arrivée à')) {
    if (lang === 'ar') return `🎉 الوصول إلى محطة ${stName}`;
    if (lang === 'dz') return `🎉 لحقت لمحطة ${stName}`;
    if (lang === 'en') return `🎉 Arrive at ${stName} Station`;
    return `🎉 Arrivée à la station ${stName}`;
  }

  // 3. Correspondance à pied
  if (step.type === 'walk' || step.instruction.includes('Correspondance à pied')) {
    if (lang === 'ar') return `🔄 المشي وسيلة نقل / تحويل نحو محطة ${stName} (${step.duration} دقيقة)`;
    if (lang === 'dz') return `🔄 مشي على الرجلين لمحطة ${stName} (${step.duration} دقيقة)`;
    if (lang === 'en') return `🔄 Walk to station ${stName} (${step.duration} min)`;
    return `🔄 Correspondance à pied vers la station ${stName} (${step.duration} min)`;
  }

  // 4. Trajet en transport (Ligne)
  const modeName = getTransportModeName(step.type, lang);
  const lineStr = step.lineName ? ` (${step.lineName})` : '';

  if (lang === 'ar') {
    return `اركب عبر ${modeName}${lineStr} وانزل في محطة ${stName} (${stopCount} محطات - ${step.duration} دقيقة)`;
  }
  if (lang === 'dz') {
    return `اركب فـ ${modeName}${lineStr} واهبط فـ ${stName} (${stopCount} لكاراي - ${step.duration} دقيقة)`;
  }
  if (lang === 'en') {
    return `Board ${modeName}${lineStr} and step off at ${stName} (${stopCount} stops - ${step.duration} min)`;
  }

  // French default
  return `Embarquez sur ${step.lineName || modeName} et descendez à ${stName} (${stopCount} stations - ${step.duration} min)`;
}

/**
 * Traduit une liste d'arrêts intermédiaires selon la langue choisie
 */
export function getLocalizedStopName(stopName: string, lang: Language, stations: Station[]): string {
  if (lang === 'fr' || lang === 'en') return stopName;
  const match = stations.find((s) => s.name === stopName || s.id === stopName);
  if (match && match.nameAr) {
    return match.nameAr;
  }
  return stopName;
}
