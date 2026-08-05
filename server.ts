import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { STATIONS, LINES, INITIAL_DISRUPTIONS } from './src/data';
import { Station, TransportType, RouteResult, RouteStep, Disruption } from './src/types';
import { computeRoute } from './src/routeEngine';
import { initTursoDB, getTursoStations, getTursoLines, getTursoPerturbations, addTursoPerturbation, getTursoSavedRoutes, saveTursoRoute } from './src/db/turso';

dotenv.config();

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini API client initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Gemini API:', err);
  }
} else {
  console.log('No valid GEMINI_API_KEY found. Running in local/offline smart assistance fallback mode.');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize & Seed Turso SQLite / Cloud Edge Database
  await initTursoDB();

  app.use(express.json());

  // --- API ENDPOINTS ---

  // Get all stations from Turso DB with real-time simulated waiting times
  app.get('/api/stations', async (req, res) => {
    try {
      const now = new Date();
      const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

      const dbStations = await getTursoStations();
      const dbLines = await getTursoLines();

      const stationsWithLiveTimes = dbStations.map((station) => {
        const hour = now.getHours();
        const isPeak = (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19);
        const frequency = isPeak ? station.schedule.frequencyPeak : station.schedule.frequencyOffPeak;
        
        const frequencySeconds = frequency * 60;
        const remainder = currentSeconds % frequencySeconds;
        const secondsToWait = frequencySeconds - remainder;
        const waitMinutes = Math.ceil(secondsToWait / 60);

        return {
          ...station,
          liveWaitTime: waitMinutes,
        };
      });

      res.json({
        stations: stationsWithLiveTimes,
        lines: dbLines,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch stations from Turso DB' });
    }
  });

  // Get active traffic alerts and perturbations from Turso DB
  app.get('/api/perturbations', async (req, res) => {
    try {
      const alerts = await getTursoPerturbations();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch perturbations' });
    }
  });

  // Report a new perturbation to Turso DB
  app.post('/api/perturbations', async (req, res) => {
    const { title, description, type, severity, lineId } = req.body;
    if (!title || !description || !type || !severity) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const newDisruption: Disruption = {
      id: 'd_' + Date.now(),
      title,
      description,
      type,
      severity,
      lineId,
      timestamp: new Date().toISOString(),
      active: true,
    };

    await addTursoPerturbation(newDisruption);
    res.status(201).json(newDisruption);
  });

  // Saved routes endpoints
  app.get('/api/saved-routes', async (req, res) => {
    try {
      const routes = await getTursoSavedRoutes();
      res.json(routes);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch saved routes' });
    }
  });

  app.post('/api/saved-routes', async (req, res) => {
    try {
      const route = req.body;
      await saveTursoRoute(route);
      res.status(201).json(route);
    } catch (err) {
      res.status(500).json({ error: 'Failed to save route' });
    }
  });

  // Dijkstra route calculator — données depuis Turso
  app.post('/api/route', async (req, res) => {
    const { originId, destinationId } = req.body;
    if (!originId || !destinationId) {
      return res.status(400).json({ error: 'Origin and Destination are required' });
    }

    try {
      const dbStations = await getTursoStations();
      const dbLines = await getTursoLines();
      const route = computeRoute(dbStations, dbLines, originId, destinationId);
      if (!route) {
        return res.status(404).json({ error: "Aucun itinéraire trouvé entre ces stations." });
      }

      // Generate Gemini travel advice if key is available
      let aiAdvice = '';
      if (ai) {
        try {
          const originStation = STATIONS.find(s => s.id === originId);
          const destStation = STATIONS.find(s => s.id === destinationId);
          
          const prompt = `L'utilisateur calcule un itinéraire de transport en commun à Alger :
De : ${originStation?.name} (${originStation?.nameAr})
À : ${destStation?.name} (${destStation?.nameAr})
Durée totale estimée : ${route.totalDuration} minutes.
Changements : ${route.transfers} correspondances.
Tarif approximatif : ${route.totalCost} DA.

Étapes de l'itinéraire :
${route.steps.map((s, idx) => `${idx + 1}. [${s.type.toUpperCase()}] ${s.instruction} (durée : ${s.duration} min)`).join('\n')}

Génère un court conseil de voyage de 3-4 lignes en français, chaleureux et pratique pour cet itinéraire spécifique à Alger (ex: anecdotes sur le quartier, tickets nécessaires, conseils sur l'heure de pointe, correspondance). Sois très précis.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: prompt,
          });

          aiAdvice = response.text || '';
        } catch (geminiErr) {
          console.error('Gemini advice generation failed:', geminiErr);
          aiAdvice = "Bon voyage ! Pensez à acheter vos tickets à l'avance aux guichets automatiques.";
        }
      } else {
        aiAdvice = "Conseil pratique : Munissez-vous de monnaie pour les bus ETUSA. Pour le métro et le tramway, des tickets uniques ou abonnements hebdomadaires sont disponibles aux guichets.";
      }

      res.json({
        route,
        aiAdvice,
      });
    } catch (error) {
      console.error('Routing failed:', error);
      res.status(500).json({ error: 'Routing calculation failed' });
    }
  });

  // Chatbot Assistant for Algiers transport
  app.post('/api/chat', async (req, res) => {
    const { message, chatHistory } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    try {
      let reply = '';

      // Station detection helper with accent removal & keyword aliases
      const removeAccents = (str: string): string => {
        return str
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim();
      };

      const cleanName = (name: string): string => {
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
      };

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
        'b_ain_benian': ['ain benian'],
        'm_ain_nadja_station': ['ain naadja', 'ain nadja', 'عين النعجة'],
        'b_kouba': ['kouba', 'قبة'],
      };

      const normText = removeAccents(message);
      const matchesObj: { station: Station; index: number; matchedLength: number }[] = [];

      // 1. Alias Matching
      for (const [stId, keywords] of Object.entries(ALIASES)) {
        const st = STATIONS.find(s => s.id === stId);
        if (!st) continue;
        for (const kw of keywords) {
          const normKw = removeAccents(kw);
          if (normText.includes(normKw)) {
            const idx = normText.indexOf(normKw);
            if (!matchesObj.some(m => m.station.id === st.id)) {
              matchesObj.push({ station: st, index: idx, matchedLength: normKw.length });
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
        } else if (arName && message.toLowerCase().includes(arName)) {
          foundIdx = message.toLowerCase().indexOf(arName);
          matchLen = arName.length;
        }

        if (foundIdx !== -1) {
          if (!matchesObj.some(m => m.station.id === st.id)) {
            matchesObj.push({ station: st, index: foundIdx, matchedLength: matchLen });
          }
        }
      });

      matchesObj.sort((a, b) => a.index - b.index);
      const matches: Station[] = matchesObj.map(m => m.station);

      let routeContext = '';
      if (matches.length >= 2) {
        const orig = matches[0];
        const dest = matches[1];

        const calculatedRoute = computeRoute(STATIONS, LINES, orig.id, dest.id);
        if (calculatedRoute) {
          routeContext = `
[Calcul d'itinéraire Dijkstra en temps réel] :
- Départ : ${orig.name} (${orig.nameAr})
- Arrivée : ${dest.name} (${dest.nameAr})
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
          console.warn('Gemini 2.5 flash failed in server.ts, retrying gemini-1.5-flash:', geminiError);
          try {
            const response15 = await ai.models.generateContent({
              model: 'gemini-1.5-flash',
              contents: promptContent,
            });
            reply = response15.text || '';
          } catch (err2) {
            console.error('All Gemini models failed in server.ts:', err2);
          }
        }
      }

      if (!reply) {
        if (matches.length >= 2) {
          const orig = matches[0];
          const dest = matches[1];
          const calculatedRoute = computeRoute(STATIONS, LINES, orig.id, dest.id);
          if (calculatedRoute) {
            reply = `🗺️ **Itinéraire de ${orig.name} vers ${dest.name}** :\n\n` +
              `⏱️ **Durée** : ~${calculatedRoute.totalDuration} min | 💰 **Tarif** : ~${calculatedRoute.totalCost} DA | 🔄 **Changements** : ${calculatedRoute.transfers}\n\n` +
              `**Feuille de route** :\n` +
              calculatedRoute.steps.map((s, i) => `${i + 1}. **[${s.type.toUpperCase()}]** ${s.instruction}`).join('\n\n');
          }
        }

        if (!reply) {
          if (normText.includes('metro')) {
            reply = "🚇 **Métro d'Alger (Ligne 1)** :\n- **Parcours** : Place des Martyrs ↔ El Harrach Gare (branche Aïn Naâdja).\n- **Tarif** : 50 DA.\n- **Horaires** : 05:00 - 23:00 (Fréquence : 4 min aux heures de pointe).";
          } else if (normText.includes('tram')) {
            reply = "🚊 **Tramway d'Alger (T1)** :\n- **Parcours** : Ruisseau (Les Fusillés) ↔ Dergana Centre (via USTHB & Bab Ezzouar).\n- **Tarif** : 40 DA.\n- **Horaires** : 05:30 - 23:30 (Fréquence : 6 min).";
          } else if (normText.includes('aeroport') || normText.includes('matar')) {
            reply = "✈️ **Aller à l'Aéroport Houari Boumediene** :\n1. **Train RER SNTF Express** depuis les gares **Agha** ou **Alger Gare**.\n2. **Bus ETUSA Ligne Aéroport** depuis la gare routière **1er Mai** ou **Tafourah**.";
          } else if (normText.includes('tarif') || normText.includes('prix') || normText.includes('ticket')) {
            reply = "🎫 **Grille Tarifaire 2026** :\n- Métro : 50 DA\n- Tramway : 40 DA\n- Bus ETUSA : 20 - 30 DA\n- Train RER SNTF Banlieue : à partir de 40 DA\n- Téléphérique : 30 - 50 DA";
          } else if (matches.length === 1) {
            reply = `📍 Station détectée : **${matches[0].name}** (${matches[0].nameAr}). Desservie par les lignes : **${matches[0].lines.join(', ')}**. Indiquez votre destination pour calculer le trajet !`;
          } else {
            reply = "👋 Marhaban ! Je suis **Kifach Nro7 AI** (كيفاش نروح AI).\nPosez-moi vos questions sur n'importe quel trajet à Alger (ex: *Kifach nro7 mn Tafourah l USTHB ?*), les horaires ou les tarifs !";
          }
        }
      }

      res.json({ reply });
    } catch (error) {
      console.error('Chat compilation error:', error);
      res.status(500).json({ error: 'Chat assistance failed' });
    }
  });


  // --- VITE DEV / PRODUCTION MIDDLEWARE ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
