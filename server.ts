import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { STATIONS, LINES, INITIAL_DISRUPTIONS } from './src/data';
import { Station, TransportType, RouteResult, RouteStep, Disruption } from './src/types';

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
  } catch (error) {
    console.error('Failed to initialize Gemini API:', error);
  }
} else {
  console.log('No valid GEMINI_API_KEY found. Running in local/offline smart assistance fallback mode.');
}

// In-memory perturbations store
let livePerturbations: Disruption[] = [...INITIAL_DISRUPTIONS];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ENDPOINTS ---

  // Get all stations with real-time simulated waiting times
  app.get('/api/stations', (req, res) => {
    try {
      const now = new Date();
      const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

      const stationsWithLiveTimes = STATIONS.map((station) => {
        // Calculate a simulated waiting time based on the current seconds and frequency
        const hour = now.getHours();
        const isPeak = (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19);
        const frequency = isPeak ? station.schedule.frequencyPeak : station.schedule.frequencyOffPeak;
        
        // Wait time in minutes: modular loop of frequency
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
        lines: LINES,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch stations' });
    }
  });

  // Get active traffic alerts and perturbations
  app.get('/api/perturbations', (req, res) => {
    res.json(livePerturbations);
  });

  // Report a new perturbation
  app.post('/api/perturbations', (req, res) => {
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

    livePerturbations.unshift(newDisruption);
    res.status(201).json(newDisruption);
  });

  // Dijkstra route calculator
  app.post('/api/route', async (req, res) => {
    const { originId, destinationId } = req.body;
    if (!originId || !destinationId) {
      return res.status(400).json({ error: 'Origin and Destination are required' });
    }

    try {
      const route = computeRoute(originId, destinationId);
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


  // --- PATHFINDER IMPLEMENTATION ---

  function computeRoute(startId: string, endId: string): RouteResult | null {
    if (startId === endId) {
      const station = STATIONS.find(s => s.id === startId);
      return {
        steps: [{
          stationId: startId,
          stationName: station?.name || '',
          type: 'walk',
          instruction: "Vous êtes déjà à destination !",
          duration: 0
        }],
        totalDuration: 0,
        totalCost: 0,
        transfers: 0
      };
    }

    // Graph structure for Dijkstra
    // { stationId: { neighborId: { weight: number, type: TransportType | 'walk', lineName: string } } }
    const graph: Record<string, Record<string, { weight: number; type: TransportType | 'walk'; lineName?: string }>> = {};

    // Initialize graph with empty records
    STATIONS.forEach(s => {
      graph[s.id] = {};
    });

    // 1. Add edges along lines
    LINES.forEach(line => {
      for (let i = 0; i < line.stations.length - 1; i++) {
        const u = line.stations[i];
        const v = line.stations[i + 1];
        
        if (graph[u] && graph[v]) {
          // Travel time between adjacent stations is generally 2 minutes for Metro/Tram, 3 minutes for Telepherique, 4 minutes for Train, 6 minutes for Bus, 5 minutes for Private Bus
          let weight = 2;
          if (line.type === 'telepherique') weight = 3;
          if (line.type === 'train') weight = 4;
          if (line.type === 'bus') weight = 6;
          if (line.type === 'bus_priv') weight = 5;

          graph[u][v] = { weight, type: line.type, lineName: line.name };
          graph[v][u] = { weight, type: line.type, lineName: line.name };
        }
      }
    });

    // 2. Add manual connection edges with low weights (walk/transfer: typically 5 minutes)
    STATIONS.forEach(s => {
      s.connections.forEach(connId => {
        if (graph[s.id] && graph[connId]) {
          // If they aren't already connected, or if they are connected on different modes (interchange)
          if (!graph[s.id][connId]) {
            graph[s.id][connId] = { weight: 5, type: 'walk', lineName: 'Correspondance à pied' };
            graph[connId][s.id] = { weight: 5, type: 'walk', lineName: 'Correspondance à pied' };
          }
        }
      });
    });

    // Dijkstra's algorithm
    const distances: Record<string, number> = {};
    const previous: Record<string, { parentId: string; type: TransportType | 'walk'; lineName?: string; weight: number } | null> = {};
    const queue = new Set<string>();

    STATIONS.forEach(s => {
      distances[s.id] = Infinity;
      previous[s.id] = null;
      queue.add(s.id);
    });

    distances[startId] = 0;

    while (queue.size > 0) {
      // Find node in queue with minimal distance
      let u: string | null = null;
      queue.forEach(nodeId => {
        if (u === null || distances[nodeId] < distances[u]) {
          u = nodeId;
        }
      });

      if (u === null || distances[u] === Infinity) break;
      if (u === endId) break; // Reached destination

      queue.delete(u);

      const neighbors = graph[u];
      for (const v in neighbors) {
        if (!queue.has(v)) continue;
        const alt = distances[u] + neighbors[v].weight;
        if (alt < distances[v]) {
          distances[v] = alt;
          previous[v] = {
            parentId: u,
            type: neighbors[v].type,
            lineName: neighbors[v].lineName,
            weight: neighbors[v].weight
          };
        }
      }
    }

    if (distances[endId] === Infinity) return null;

    // Reconstruct path
    const pathSteps: RouteStep[] = [];
    let currentId = endId;

    while (previous[currentId] !== null) {
      const edge = previous[currentId]!;
      const station = STATIONS.find(s => s.id === currentId);
      
      let instruction = '';
      if (edge.type === 'walk') {
        instruction = `Marchez jusqu'à ${station?.name}`;
      } else {
        instruction = `Prenez la ligne ${edge.lineName} vers ${station?.name}`;
      }

      pathSteps.unshift({
        stationId: currentId,
        stationName: station?.name || '',
        type: edge.type,
        lineName: edge.lineName,
        duration: edge.weight,
        instruction
      });

      currentId = edge.parentId;
    }

    // Add initial step
    const startStation = STATIONS.find(s => s.id === startId);
    if (pathSteps.length > 0) {
      pathSteps.unshift({
        stationId: startId,
        stationName: startStation?.name || '',
        type: 'walk',
        instruction: `Départ de ${startStation?.name}`,
        duration: 0
      });
    }

    // Calculate details
    let totalCost = 0;
    let transfers = 0;
    let currentMode: TransportType | 'walk' | null = null;

    pathSteps.forEach(step => {
      if (step.type !== 'walk' && step.type !== currentMode) {
        if (currentMode !== null) transfers++;
        currentMode = step.type;
        
        // Accumulate cost
        if (step.type === 'metro') totalCost += 50;
        else if (step.type === 'tram') totalCost += 40;
        else if (step.type === 'bus') totalCost += 30;
        else if (step.type === 'bus_priv') totalCost += 35;
        else if (step.type === 'telepherique') totalCost += 30;
        else if (step.type === 'train') totalCost += 45; // base banlieue
      }
    });

    return {
      steps: pathSteps,
      totalDuration: distances[endId],
      totalCost: totalCost || 50, // Min cost 50 DA
      transfers
    };
  }


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
