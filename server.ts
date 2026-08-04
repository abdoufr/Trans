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
      if (ai) {
        const systemInstruction = `Tu es l'assistant virtuel officiel de "Kifach Nro7" (كيفاش نروح), une plateforme intelligente et chaleureuse dédiée aux transports en commun de la Wilaya d'Alger.
Tu aides les citoyens algérois et les visiteurs à naviguer facilement dans le réseau de transports : Métro d'Alger, Tramway, Trains de Banlieue (SNTF RER), Navette Aéroport Express, Téléphériques / Télécabines, et Bus ETUSA / Privés.
Tu as accès à ces informations de référence sur le réseau :
- Le métro d'Alger (Ligne 1) s'étend de la Place des Martyrs à El Harrach Gare, avec une branche vers Aïn Naâdja. Correspondances clés à Ruisseau (Les Fusillés) avec le Tramway et à El Harrach Gare avec le train.
- Le tramway (Ligne T1) relie Ruisseau à Dergana Centre sur 23 km via l'USTHB, Bab Ezzouar et Bordj El Kiffan.
- Le train de banlieue dessert l'Est (Alger Gare, Agha, Hussein Dey, Caroubier, El Harrach, Bab Ezzouar, Dar El Beida, Reghaia, Thenia), l'Aéroport d'Alger, et l'Ouest (Alger-Zeralda).
- Les bus ETUSA possèdent des hubs majeurs à 1er Mai, Audin, Tafourah, Ben Aknoun, Bab El Oued et Chevalley.
- Les téléphériques relient Maqam Echahid, Palais du Peuple, Notre Dame d'Afrique, Bouzaréah et Z'ghara.

Réponds aux questions de l'utilisateur de manière concise, polie et pratique en français (ou en arabe algérien / darija si sollicité). Propose des suggestions claires.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: [
            { text: systemInstruction },
            ...(chatHistory || []).map((h: any) => ({
              text: `${h.sender === 'user' ? 'User' : 'Assistant'}: ${h.text}`
            })),
            { text: `User: ${message}` }
          ],
        });

        reply = response.text || "Désolé, je rencontre des difficultés à formuler une réponse.";
      } else {
        // High quality offline responsive simulator logic
        const lower = message.toLowerCase();
        if (lower.includes('métro') || lower.includes('metro')) {
          reply = "Le Métro d'Alger comporte 19 stations opérationnelles, reliant la Place des Martyrs à El Harrach Gare (Ligne principale) et de Haï El Badr à Aïn Naâdja (Branche). Il fonctionne de 05:00 à 23:00 avec une fréquence de 4 minutes aux heures de pointe. Le tarif est de 50 DA.";
        } else if (lower.includes('tramway') || lower.includes('tram')) {
          reply = "Le Tramway d'Alger relie la station Les Fusillés (Ruisseau) à Dergana Centre, en passant par Bab Ezzouar, l'USTHB et Bordj El Kiffan. Il fonctionne de 05:30 à 23:30 avec une fréquence de 6 minutes. Le billet coûte 40 DA.";
        } else if (lower.includes('tarif') || lower.includes('prix') || lower.includes('ticket')) {
          reply = "Les tarifs unitaires sont : Métro (50 DA), Tramway (40 DA), Bus ETUSA (20-30 DA), Trains de banlieue SNTF (à partir de 40 DA selon les zones). Un ticket d'abonnement intermodal n'existe pas encore, il faut acheter des tickets séparés.";
        } else if (lower.includes('train') || lower.includes('rer') || lower.includes('sntf')) {
          reply = "Le train de banlieue SNTF relie Alger (Gare Centrale / Agha) à Thénia à l'Est, et Alger à Zéralda à l'Ouest ainsi que l'Express Aéroport. Les gares d'interconnexion clés sont Agha et El Harrach Gare. Les trains circulent de 05:40 à 21:30.";
        } else {
          reply = "Bienvenue sur Kifach Nro7 (كيفاش نروح) ! Je peux vous aider sur les horaires, les trajets ou les tarifs du Métro, Tramway, RER SNTF, Téléphériques et Bus à Alger. Que souhaitez-vous savoir ?";
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
