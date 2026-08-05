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

// Find stations in query text
function detectStationsInQuery(text: string): { origin?: Station; destination?: Station } {
  const lower = text.toLowerCase();
  
  // Sort stations by length descending so longer station names match first
  const sorted = [...STATIONS].sort((a, b) => b.name.length - a.name.length);
  
  const matches: Station[] = [];
  sorted.forEach((st) => {
    const frName = st.name.toLowerCase();
    const arName = st.nameAr ? st.nameAr.toLowerCase() : '';
    if (lower.includes(frName) || (arName && lower.includes(arName))) {
      if (!matches.some(m => m.id === st.id)) {
        matches.push(st);
      }
    }
  });

  if (matches.length >= 2) {
    // Try to determine order from string index
    const idx0 = lower.indexOf(matches[0].name.toLowerCase());
    const idx1 = lower.indexOf(matches[1].name.toLowerCase());
    if (idx0 <= idx1) {
      return { origin: matches[0], destination: matches[1] };
    } else {
      return { origin: matches[1], destination: matches[0] };
    }
  } else if (matches.length === 1) {
    return { origin: matches[0] };
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

    // Check if query is an origin -> destination route request
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
3. RER SNTF : Alger/Agha -> El Harrach -> Réghaïa -> Thénia / Zéralda / Express Aéroport Houari Boumediene.
4. BUS ETUSA & PRIVÉS : Hubs 1er Mai, Tafourah, Audin, Ben Aknoun, Triolet, Chevalley, Chéraga.
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
        console.warn('Gemini 2.5 flash failed, retrying with gemini-1.5-flash:', geminiError);
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

    // Fallback if AI not available or Gemini error
    if (!reply) {
      if (detected.origin && detected.destination) {
        const calculatedRoute = computeRoute(STATIONS, LINES, detected.origin.id, detected.destination.id);
        if (calculatedRoute) {
          reply = `🗺️ **Itinéraire de ${detected.origin.name} vers ${detected.destination.name}** :\n\n` +
            `⏱️ **Durée** : ~${calculatedRoute.totalDuration} min | 💰 **Tarif** : ~${calculatedRoute.totalCost} DA | 🔄 **Changements** : ${calculatedRoute.transfers}\n\n` +
            `**Feuille de route** :\n` +
            calculatedRoute.steps.map((s, i) => `${i + 1}. **[${s.type.toUpperCase()}]** ${s.instruction}`).join('\n\n');
        }
      }

      if (!reply) {
        const lower = message.toLowerCase();
        if (lower.includes('métro') || lower.includes('metro')) {
          reply = "🚇 **Métro d'Alger (Ligne 1)** :\n- **Parcours** : Place des Martyrs ↔ El Harrach Gare (branche Aïn Naâdja).\n- **Tarif** : 50 DA.\n- **Horaires** : 05:00 - 23:00 (Fréquence : 4 min aux heures de pointe).";
        } else if (lower.includes('tram') || lower.includes('tramway')) {
          reply = "🚊 **Tramway d'Alger (T1)** :\n- **Parcours** : Ruisseau (Les Fusillés) ↔ Dergana Centre (via USTHB & Bab Ezzouar).\n- **Tarif** : 40 DA.\n- **Horaires** : 05:30 - 23:30 (Fréquence : 6 min).";
        } else if (lower.includes('aéroport') || lower.includes('aeroport') || lower.includes('matar')) {
          reply = "✈️ **Aller à l'Aéroport Houari Boumediene** :\n1. **Train RER SNTF Express** depuis les gares **Agha** ou **Alger Gare**.\n2. **Bus ETUSA Ligne Aéroport** depuis la gare routière **1er Mai** ou **Tafourah**.";
        } else if (lower.includes('tarif') || lower.includes('prix') || lower.includes('ticket')) {
          reply = "🎫 **Grille Tarifaire 2026** :\n- Métro : 50 DA\n- Tramway : 40 DA\n- Bus ETUSA : 20 - 30 DA\n- Train RER SNTF Banlieue : à partir de 40 DA\n- Téléphérique : 30 - 50 DA";
        } else if (detected.origin) {
          reply = `📍 Station détectée : **${detected.origin.name}** (${detected.origin.nameAr}). Desservie par les lignes : **${detected.origin.lines.join(', ')}**. Indiquez votre destination pour calculer le trajet !`;
        } else {
          reply = "👋 Marhaban ! Je suis **Kifach Nro7 AI** (كيفاش نروح AI).\nPosez-moi vos questions sur n'importe quel trajet à Alger (ex: *Kifach nro7 mn Tafourah l USTHB ?*), les horaires ou les tarifs !";
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
