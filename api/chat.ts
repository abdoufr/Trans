import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { STATIONS, LINES } from '../src/data';
import { computeRoute } from '../src/routeEngine';
import { Station } from '../src/types';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize Gemini API in Vercel function:', err);
  }
}

function removeAccents(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function cleanName(name: string): string {
  const norm = removeAccents(name);
  return norm
    .replace(/^station etusa\s+/i, '')
    .replace(/^gare sntf\s+/i, '')
    .replace(/^téléphérique\s+/i, '')
    .replace(/^télécabine\s+/i, '')
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s+centre$/i, '')
    .replace(/\s+ville$/i, '')
    .replace(/\s+terminus$/i, '')
    .replace(/\s+gare$/i, '')
    .trim();
}

// Popular station keyword aliases for quick matching in Darija/French
const ALIASES: Record<string, string[]> = {
  't_boumerdes': ['boumerdes', 'boumerdas', 'bomerdas', 'bomerdes'],
  'b_birkhadem': ['birkhadem', 'bir khadem', 'birkadem'],
  't_birtouta': ['birtouta', 'bir touta', 'birtuta'],
  'b_birtouta_ville': ['birtouta', 'bir touta'],
  'b_tafourah': ['tafourah', 'tafoura', 'grande poste', 'post'],
  'm_martyrs': ['martyrs', 'شهداء', 'place des martyrs', 'place martyrs'],
  'm_mai': ['1er mai', 'premier mai', '1 mai', 'أول ماي'],
  'b_mai': ['1er mai', 'premier mai'],
  'bp_bab_ezzouar_fac': ['usthb', 'fac bab ezzouar', 'bab ezzouar fac', 'université bab ezzouar'],
  'b_cheraga': ['cheraga', 'chraga', 'شراقة'],
  'b_zeralda': ['zeralda', 'zralda', 'زرالدة'],
  't_reghaia': ['reghaia', 'rghaia', 'رغاية'],
  'm_ruisseau': ['ruisseau', 'les fusilles', 'fusilles', 'عناصر'],
  'b_chevalley': ['chevalley', 'chavali'],
  'b_ben_aknoun': ['ben aknoun', 'benaknoun'],
  't_alger': ['alger gare', 'gare centrale', 'alger centre'],
  't_agha': ['agha'],
  'b_aeroport': ['aeroport', 'matar', 'aeroport d\'alger', 'houari boumediene'],
  't_aeroport': ['aeroport', 'matar'],
  'b_ain_benian': ['ain benian', 'ain benian'],
  'm_ain_nadja_station': ['ain naadja', 'ain nadja', 'عين النعجة'],
  'b_kouba': ['kouba', 'قبة'],
};

function detectStationsInQuery(text: string): { origin?: Station; destination?: Station } {
  const normText = removeAccents(text);
  const matches: { station: Station; index: number; matchedLength: number }[] = [];

  // 1. Alias Matching
  for (const [stId, keywords] of Object.entries(ALIASES)) {
    const st = STATIONS.find(s => s.id === stId);
    if (!st) continue;
    for (const kw of keywords) {
      const normKw = removeAccents(kw);
      if (normText.includes(normKw)) {
        const idx = normText.indexOf(normKw);
        if (!matches.some(m => m.station.id === st.id)) {
          matches.push({ station: st, index: idx, matchedLength: normKw.length });
        }
        break;
      }
    }
  }

  // 2. Direct Station Name & Arabic Name Matching
  STATIONS.forEach((st) => {
    const rawFr = removeAccents(st.name);
    const cleanFr = cleanName(st.name);
    const arName = st.nameAr ? st.nameAr.toLowerCase() : '';

    let foundIdx = -1;
    let matchLen = 0;

    if (cleanFr.length >= 3 && normText.includes(cleanFr)) {
      foundIdx = normText.indexOf(cleanFr);
      matchLen = cleanFr.length;
    } else if (rawFr.length >= 3 && normText.includes(rawFr)) {
      foundIdx = normText.indexOf(rawFr);
      matchLen = rawFr.length;
    } else if (arName && text.toLowerCase().includes(arName)) {
      foundIdx = text.toLowerCase().indexOf(arName);
      matchLen = arName.length;
    }

    if (foundIdx !== -1) {
      if (!matches.some(m => m.station.id === st.id)) {
        matches.push({ station: st, index: foundIdx, matchedLength: matchLen });
      }
    }
  });

  matches.sort((a, b) => a.index - b.index);

  if (matches.length >= 2) {
    return { origin: matches[0].station, destination: matches[1].station };
  } else if (matches.length === 1) {
    return { origin: matches[0].station };
  }

  return {};
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, chatHistory } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Le champ message est obligatoire' });
  }

  try {
    let reply = '';
    const detected = detectStationsInQuery(message);
    let routeContext = '';

    if (detected.origin && detected.destination) {
      const calculatedRoute = computeRoute(STATIONS, LINES, detected.origin.id, detected.destination.id);
      if (calculatedRoute) {
        routeContext = `
[Calcul d'itinéraire Dijkstra en temps réel] :
- Départ : ${detected.origin.name} (${detected.origin.nameAr})
- Arrivée : ${detected.destination.name} (${detected.destination.nameAr})
- Durée estimée : ${calculatedRoute.totalDuration} min
- Correspondances : ${calculatedRoute.transfers}
- Tarif approximatif : ${calculatedRoute.totalCost} DA
- Étapes :
${calculatedRoute.steps.map((s, i) => `${i + 1}. [${s.type.toUpperCase()}] ${s.instruction} (${s.duration} min)`).join('\n')}
`;
      }
    }

    if (ai) {
      const systemInstruction = `Tu es "Kifach Nro7 AI" (كيفاش نروح AI), l'assistant IA officiel et expert ultime des transports en commun de la Wilaya d'Alger ("Kifach Nro7").
Tu réponds dans la langue utilisée par l'utilisateur (Arabe Algérien / Darija لهجة جزائرية, Français ou Arabe classique).

Tes connaissances du réseau d'Alger :
1. MÉTRO : Place des Martyrs <-> El Harrach Gare & Aïn Naâdja (19 stations, 50 DA, 05h-23h).
2. TRAMWAY T1 : Ruisseau (Les Fusillés) <-> Dergana Centre (23.2 km, 38 stations, 40 DA, 05h30-23h30).
3. RER SNTF : Alger/Agha -> El Harrach -> Réghaïa -> Thénia / Boumerdès / Zéralda / Express Aéroport Houari Boumediene / Birtouta / Blida.
4. BUS ETUSA & PRIVÉS : Hubs 1er Mai, Tafourah, Audin, Ben Aknoun, Triolet, Chevalley, Chéraga, Birkhadem, Saoula, Birtouta.
5. TÉLÉPHÉRIQUES : Notre Dame d'Afrique, Maqam Echahid, Palais du Peuple, Bouzaréah, Z'ghara.

Règles de réponse :
- Si un calcul d'itinéraire en temps réel est fourni dans le prompt, sers-t'en pour donner une réponse ultra précise étape par étape.
- Sois très clair, chaleureux, bienveillant, utilise des émojis et une présentation aérée.`;

      const promptContent = routeContext 
        ? `${systemInstruction}\n\nContexte d'itinéraire détecté :\n${routeContext}\n\nQuestion utilisateur : ${message}`
        : `${systemInstruction}\n\nQuestion utilisateur : ${message}`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            ...(chatHistory || []).map((h: any) => ({
              text: `${h.sender === 'user' ? 'User' : 'Assistant'}: ${h.text}`,
            })),
            { text: promptContent },
          ],
        });
        reply = response.text || '';
      } catch (geminiError) {
        console.warn('Gemini 2.5 flash failed, retrying gemini-1.5-flash:', geminiError);
        try {
          const response15 = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: promptContent,
          });
          reply = response15.text || '';
        } catch (err2) {
          console.error('All Gemini models failed:', err2);
        }
      }
    }

    // High quality smart route fallback when AI key is absent or API fails
    if (!reply) {
      if (detected.origin && detected.destination) {
        const calculatedRoute = computeRoute(STATIONS, LINES, detected.origin.id, detected.destination.id);
        if (calculatedRoute) {
          reply = `🗺️ **Itinéraire de ${detected.origin.name} vers ${detected.destination.name}** :\n\n` +
            `⏱️ **Durée estimée** : ~${calculatedRoute.totalDuration} min | 💰 **Tarif** : ~${calculatedRoute.totalCost} DA | 🔄 **Changements** : ${calculatedRoute.transfers}\n\n` +
            `**Feuille de route** :\n` +
            calculatedRoute.steps.map((s, i) => `${i + 1}. **[${s.type.toUpperCase()}]** ${s.instruction}`).join('\n\n');
        }
      }

      if (!reply) {
        const lower = removeAccents(message);
        if (lower.includes('metro')) {
          reply = "🚇 **Métro d'Alger (Ligne 1)** :\n- **Parcours** : Place des Martyrs ↔ El Harrach Gare (branche Aïn Naâdja).\n- **Tarif** : 50 DA.\n- **Horaires** : 05:00 - 23:00 (Fréquence : 4 min aux heures de pointe).";
        } else if (lower.includes('tram') || lower.includes('tramway')) {
          reply = "🚊 **Tramway d'Alger (T1)** :\n- **Parcours** : Ruisseau (Les Fusillés) ↔ Dergana Centre (via USTHB & Bab Ezzouar).\n- **Tarif** : 40 DA.\n- **Horaires** : 05:30 - 23:30 (Fréquence : 6 min).";
        } else if (lower.includes('aeroport') || lower.includes('matar')) {
          reply = "✈️ **Aller à l'Aéroport Houari Boumediene** :\n1. **Train RER SNTF Express** depuis **Agha** ou **Alger Gare**.\n2. **Bus ETUSA Ligne Aéroport** depuis la gare routière **1er Mai** ou **Tafourah**.";
        } else if (lower.includes('tarif') || lower.includes('prix') || lower.includes('ticket')) {
          reply = "🎫 **Grille Tarifaire 2026** :\n- Métro : 50 DA\n- Tramway : 40 DA\n- Bus ETUSA : 20 - 30 DA\n- Train RER SNTF Banlieue : à partir de 40 DA\n- Téléphérique : 30 - 50 DA";
        } else if (detected.origin) {
          reply = `📍 Station détectée : **${detected.origin.name}** (${detected.origin.nameAr}).\nVeuillez préciser votre destination (ex: *Boumerdès, USTHB, Tafourah, 1er Mai, Zéralda...*) pour calculer le trajet précis !`;
        } else {
          reply = "👋 Marhaban ! Je suis **Kifach Nro7 AI** (كيفاش نروح AI).\nPosez-moi votre question de trajet à Alger (ex: *kifach nroh mn birkhadem l boumerdes* ou *kifach nroh mn tafourah l usthb*), les horaires ou les tarifs !";
        }
      }
    }

    return res.status(200).json({ reply });
  } catch (err: any) {
    console.error('[api/chat] Error:', err);
    return res.status(500).json({
      reply: "Marhaban ! Je suis **Kifach Nro7 AI** (كيفاش نروح AI). Posez-moi votre question sur les transports d'Alger !",
    });
  }
}
