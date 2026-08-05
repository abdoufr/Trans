import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

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

    if (ai) {
      const systemInstruction = `Tu es "Kifach Nro7 AI" (كيفاش نروح AI), l'assistant IA officiel, intelligent et bienveillant de la plateforme de transport de la Wilaya d'Alger ("Kifach Nro7").
Tu réponds en Français, en Arabe Algérien (Darija لهجة جزائرية) ou en Arabe selon la langue utilisée par l'utilisateur.

Tes connaissances d'expert sur le réseau d'Alger :
1. MÉTRO D'ALGER (Ligne 1) : 19 stations de la Place des Martyrs jusqu'à El Harrach Gare, avec une extension vers Aïn Naâdja. Tarif : 50 DA. Horaires : 05:00 - 23:00. Correspondances principales : Ruisseau (Tramway T1) et El Harrach Gare (RER SNTF).
2. TRAMWAY D'ALGER (Ligne T1) : Ruisseau (Les Fusillés) -> Dergana Centre (23.2 km, 38 stations via Bab Ezzouar, USTHB, Cité Zerhouni, Bordj El Kiffan). Tarif : 40 DA. Horaires : 05:30 - 23:30.
3. TRAIN DE BANLIEUE SNTF (RER) :
   - Ligne Est : Alger Gare / Agha -> Hussein Dey -> El Harrach -> Bab Ezzouar -> Réghaïa -> Thénia.
   - Ligne Ouest : Alger -> Birtouta -> Zéralda.
   - Navette Express Aéroport : Agha -> Bab Ezzouar -> Aéroport d'Alger Houari Boumediene.
4. BUS ETUSA & BUS PRIVÉS :
   - Grands hubs d'échanges : 1er Mai, Tafourah, Grande Poste / Audin, Ben Aknoun Gare Routière, Triolet / Bab El Oued, Chevalley, Chéraga.
   - Lignes ETUSA célèbres : Ligne 07 (Martyrs - Notre Dame d'Afrique), Ligne 18 (Tafourah - El Biar - Chevalley), Ligne 104 (Martyrs - Birmandreis - Birkhadem), Ligne 634 (Tafourah - USTHB).
5. TÉLÉPHÉRIQUES & TÉLÉCABINES : Notre Dame d'Afrique, Maqam Echahid (Mémorial du Martyr - Riadh El Feth), Palais du Peuple, Oued Koriche -> Bouzaréah, Bab El Oued -> Z'ghara.

Instructions :
- Sois court, précis, bienveillant et structuré avec des puces et des émojis.
- Si l'utilisateur demande comment aller d'un lieu A à un lieu B, donne-lui les lignes précises à prendre et les correspondances.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          { text: systemInstruction },
          ...(chatHistory || []).map((h: any) => ({
            text: `${h.sender === 'user' ? 'User' : 'Assistant'}: ${h.text}`,
          })),
          { text: `User: ${message}` },
        ],
      });

      reply = response.text || "Désolé, je rencontre des difficultés à formuler une réponse.";
    } else {
      // Smart offline fallback engine
      const lower = message.toLowerCase();
      if (lower.includes('métro') || lower.includes('metro')) {
        reply = "🚇 **Métro d'Alger** : 19 stations reliées de la **Place des Martyrs** à **El Harrach Gare** (avec branche vers Aïn Naâdja). Ticket : 50 DA. Horaires : 05h00 - 23h00.";
      } else if (lower.includes('tram') || lower.includes('tramway')) {
        reply = "🚊 **Tramway T1** : Relié de **Ruisseau (Les Fusillés)** à **Dergana Centre** via l'USTHB et Bab Ezzouar (23 km, 38 stations). Ticket : 40 DA. Horaires : 05h30 - 23h30.";
      } else if (lower.includes('tarif') || lower.includes('prix') || lower.includes('ticket')) {
        reply = "🎫 **Tarifs 2026** : Métro (50 DA), Tramway (40 DA), Bus ETUSA (20-30 DA), RER SNTF Banlieue (à partir de 40 DA).";
      } else if (lower.includes('aéroport') || lower.includes('aeroport') || lower.includes('matar')) {
        reply = "✈️ **Navette Aéroport Houari Boumediene** : Prenez le train RER SNTF Express depuis **Agha / Alger Gare** ou le bus ETUSA depuis la station **1er Mai** / **Tafourah**.";
      } else {
        reply = "👋 Marhaban ! Je suis **Kifach Nro7 AI** (كيفاش نروح AI). Posez-moi toutes vos questions sur les lignes de métro, tramway, RER SNTF, téléphériques ou bus à Alger !";
      }
    }

    return res.status(200).json({ reply });
  } catch (err: any) {
    console.error('[api/chat] Error:', err);
    return res.status(500).json({
      reply: "Bienvenue sur **Kifach Nro7 AI** (كيفاش نروح AI) ! Posez vos questions sur les horaires, itinéraires ou tarifs des transports d'Alger.",
    });
  }
}
