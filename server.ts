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
          instruction: "Vous êtes déjà à la station de destination !",
          duration: 0
        }],
        totalDuration: 0,
        totalCost: 0,
        transfers: 0
      };
    }

    // Graph structure for Dijkstra
    const graph: Record<string, Record<string, { weight: number; type: TransportType | 'walk'; lineName?: string }>> = {};

    STATIONS.forEach(s => {
      graph[s.id] = {};
    });

    // 1. Add edges along lines
    LINES.forEach(line => {
      for (let i = 0; i < line.stations.length - 1; i++) {
        const u = line.stations[i];
        const v = line.stations[i + 1];
        
        if (graph[u] && graph[v]) {
          let weight = 2;
          if (line.type === 'telepherique') weight = 3;
          if (line.type === 'train') weight = 4;
          if (line.type === 'bus') weight = 5;
          if (line.type === 'bus_priv') weight = 5;

          graph[u][v] = { weight, type: line.type, lineName: line.name };
          graph[v][u] = { weight, type: line.type, lineName: line.name };
        }
      }
    });

    // 2. Add connection edges (walk/transfer: 5 minutes)
    STATIONS.forEach(s => {
      s.connections.forEach(connId => {
        if (graph[s.id] && graph[connId]) {
          if (!graph[s.id][connId]) {
            graph[s.id][connId] = { weight: 5, type: 'walk', lineName: 'Correspondance à pied' };
            graph[connId][s.id] = { weight: 5, type: 'walk', lineName: 'Correspondance à pied' };
          }
        }
      });
    });

    // Dijkstra algorithm
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
      let u: string | null = null;
      queue.forEach(nodeId => {
        if (u === null || distances[nodeId] < distances[u]) {
          u = nodeId;
        }
      });

      if (u === null || distances[u] === Infinity) break;
      if (u === endId) break;

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

    // Reconstruct raw hop list
    interface RawHop {
      fromId: string;
      fromName: string;
      toId: string;
      toName: string;
      type: TransportType | 'walk';
      lineName?: string;
      weight: number;
    }

    const rawHops: RawHop[] = [];
    let currentId = endId;

    while (previous[currentId] !== null) {
      const edge = previous[currentId]!;
      const fromStation = STATIONS.find(s => s.id === edge.parentId);
      const toStation = STATIONS.find(s => s.id === currentId);

      rawHops.unshift({
        fromId: edge.parentId,
        fromName: fromStation?.name || '',
        toId: currentId,
        toName: toStation?.name || '',
        type: edge.type,
        lineName: edge.lineName,
        weight: edge.weight
      });

      currentId = edge.parentId;
    }

    // CONSOLIDATE RAW HOPS INTO TURN-BY-TURN LEGS
    const consolidatedSteps: RouteStep[] = [];
    const startStation = STATIONS.find(s => s.id === startId);

    // Initial Departure Step
    consolidatedSteps.push({
      stationId: startId,
      stationName: startStation?.name || '',
      type: 'walk',
      instruction: `📍 Départ de la station ${startStation?.name}`,
      duration: 0
    });

    let currentLeg: {
      fromStationId: string;
      fromStationName: string;
      toStationId: string;
      toStationName: string;
      type: TransportType | 'walk';
      lineName?: string;
      duration: number;
      stationCount: number;
      intermediateStops: string[];
    } | null = null;

    let transfers = 0;
    let totalCost = 0;
    let usedModes = new Set<TransportType>();

    rawHops.forEach((hop) => {
      if (!currentLeg) {
        currentLeg = {
          fromStationId: hop.fromId,
          fromStationName: hop.fromName,
          toStationId: hop.toId,
          toStationName: hop.toName,
          type: hop.type,
          lineName: hop.lineName,
          duration: hop.weight,
          stationCount: 1,
          intermediateStops: [hop.toName],
        };
      } else if (currentLeg.type === hop.type && currentLeg.lineName === hop.lineName) {
        // Continue same line/mode leg
        currentLeg.toStationId = hop.toId;
        currentLeg.toStationName = hop.toName;
        currentLeg.duration += hop.weight;
        currentLeg.stationCount += 1;
        currentLeg.intermediateStops.push(hop.toName);
      } else {
        // Flush previous leg
        if (currentLeg.type === 'walk') {
          consolidatedSteps.push({
            stationId: currentLeg.toStationId,
            stationName: currentLeg.toStationName,
            type: 'walk',
            lineName: currentLeg.lineName,
            duration: currentLeg.duration,
            instruction: `🔄 Correspondance à pied vers la station ${currentLeg.toStationName} (${currentLeg.duration} min)`,
            intermediateStops: currentLeg.intermediateStops,
          });
        } else {
          usedModes.add(currentLeg.type);
          consolidatedSteps.push({
            stationId: currentLeg.toStationId,
            stationName: currentLeg.toStationName,
            type: currentLeg.type,
            lineName: currentLeg.lineName,
            duration: currentLeg.duration,
            instruction: `Embarquez à ${currentLeg.fromStationName} sur ${currentLeg.lineName} et descendez à ${currentLeg.toStationName} (${currentLeg.stationCount} stations - ${currentLeg.duration} min)`,
            intermediateStops: currentLeg.intermediateStops,
          });
        }

        // Start new leg
        if (hop.type !== 'walk' && currentLeg.type !== 'walk') {
          transfers++;
        }

        currentLeg = {
          fromStationId: hop.fromId,
          fromStationName: hop.fromName,
          toStationId: hop.toId,
          toStationName: hop.toName,
          type: hop.type,
          lineName: hop.lineName,
          duration: hop.weight,
          stationCount: 1,
          intermediateStops: [hop.toName],
        };
      }
    });

    // Flush last leg
    if (currentLeg) {
      const leg = currentLeg as any;
      if (leg.type === 'walk') {
        consolidatedSteps.push({
          stationId: leg.toStationId,
          stationName: leg.toStationName,
          type: 'walk',
          lineName: leg.lineName,
          duration: leg.duration,
          instruction: `🔄 Correspondance à pied vers ${leg.toStationName} (${leg.duration} min)`,
          intermediateStops: leg.intermediateStops,
        });
      } else {
        usedModes.add(leg.type);
        consolidatedSteps.push({
          stationId: leg.toStationId,
          stationName: leg.toStationName,
          type: leg.type,
          lineName: leg.lineName,
          duration: leg.duration,
          instruction: `Embarquez à ${leg.fromStationName} sur ${leg.lineName} et descendez à la station ${leg.toStationName} (${leg.stationCount} stations - ${leg.duration} min)`,
          intermediateStops: leg.intermediateStops,
        });
      }
    }

    // Final arrival step
    const destStation = STATIONS.find(s => s.id === endId);
    consolidatedSteps.push({
      stationId: endId,
      stationName: destStation?.name || '',
      type: 'walk',
      instruction: `🎉 Arrivée à la station ${destStation?.name}`,
      duration: 0
    });

    // Calculate total cost based on unique transport modes used
    usedModes.forEach(mode => {
      if (mode === 'metro') totalCost += 50;
      else if (mode === 'tram') totalCost += 40;
      else if (mode === 'train') totalCost += 45;
      else if (mode === 'bus') totalCost += 30;
      else if (mode === 'bus_priv') totalCost += 35;
      else if (mode === 'telepherique') totalCost += 30;
    });

    return {
      steps: consolidatedSteps,
      totalDuration: distances[endId],
      totalCost: totalCost || 50,
      transfers: Math.max(0, usedModes.size - 1)
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
