import type { VercelRequest, VercelResponse } from '@vercel/node';
import { STATIONS, LINES } from '../../src/data';
import { TransportType, RouteResult, RouteStep } from '../../src/types';

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

  // 0. Check if start and end are on the SAME direct line
  for (const line of LINES) {
    const idx1 = line.stations.indexOf(startId);
    const idx2 = line.stations.indexOf(endId);
    if (idx1 !== -1 && idx2 !== -1) {
      const stepStations = idx1 < idx2
        ? line.stations.slice(idx1, idx2 + 1)
        : line.stations.slice(idx2, idx1 + 1).reverse();

      const intermediate = stepStations.slice(1, -1).map(id => STATIONS.find(s => s.id === id)?.name || id);
      const startSt = STATIONS.find(s => s.id === startId);
      const endSt = STATIONS.find(s => s.id === endId);

      let perStationDuration = 2;
      if (line.type === 'telepherique') perStationDuration = 3;
      if (line.type === 'train') perStationDuration = 2;
      if (line.type === 'bus' || line.type === 'bus_priv') perStationDuration = 4;

      const totalDuration = (stepStations.length - 1) * perStationDuration;

      let cost = 50;
      if (line.type === 'tram') cost = 40;
      if (line.type === 'train') cost = 45;
      if (line.type === 'bus') cost = 30;
      if (line.type === 'bus_priv') cost = 35;
      if (line.type === 'telepherique') cost = 30;

      return {
        steps: [
          { stationId: startId, stationName: startSt?.name || '', type: 'walk', instruction: `📍 Départ de la station ${startSt?.name}`, duration: 0 },
          { stationId: endId, stationName: endSt?.name || '', type: line.type, lineName: line.name, duration: totalDuration, instruction: `Embarquez à ${startSt?.name} sur ${line.name} et descendez directement à ${endSt?.name} (${stepStations.length - 1} stations - ${totalDuration} min)`, intermediateStops: intermediate },
          { stationId: endId, stationName: endSt?.name || '', type: 'walk', instruction: `🎉 Arrivée à la station ${endSt?.name}`, duration: 0 }
        ],
        totalDuration,
        totalCost: cost,
        transfers: 0
      };
    }
  }

  // Dijkstra graph
  const graph: Record<string, Record<string, { weight: number; type: TransportType | 'walk'; lineName?: string }>> = {};
  STATIONS.forEach(s => { graph[s.id] = {}; });

  LINES.forEach(line => {
    for (let i = 0; i < line.stations.length - 1; i++) {
      const u = line.stations[i];
      const v = line.stations[i + 1];
      if (graph[u] && graph[v]) {
        let weight = 2;
        if (line.type === 'telepherique') weight = 3;
        if (line.type === 'train') weight = 2;
        if (line.type === 'bus') weight = 4;
        if (line.type === 'bus_priv') weight = 4;
        graph[u][v] = { weight, type: line.type, lineName: line.name };
        graph[v][u] = { weight, type: line.type, lineName: line.name };
      }
    }
  });

  STATIONS.forEach(s => {
    s.connections.forEach(connId => {
      if (graph[s.id] && graph[connId] && !graph[s.id][connId]) {
        graph[s.id][connId] = { weight: 12, type: 'walk', lineName: 'Correspondance à pied' };
        graph[connId][s.id] = { weight: 12, type: 'walk', lineName: 'Correspondance à pied' };
      }
    });
  });

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
      if (u === null || distances[nodeId] < distances[u!]) u = nodeId;
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
        previous[v] = { parentId: u, type: neighbors[v].type, lineName: neighbors[v].lineName, weight: neighbors[v].weight };
      }
    }
  }

  if (distances[endId] === Infinity) return null;

  const rawHops: any[] = [];
  let currentId = endId;
  while (previous[currentId] !== null) {
    const edge = previous[currentId]!;
    const fromStation = STATIONS.find(s => s.id === edge.parentId);
    const toStation = STATIONS.find(s => s.id === currentId);
    rawHops.unshift({ fromId: edge.parentId, fromName: fromStation?.name || '', toId: currentId, toName: toStation?.name || '', type: edge.type, lineName: edge.lineName, weight: edge.weight });
    currentId = edge.parentId;
  }

  const consolidatedSteps: RouteStep[] = [];
  const startStation = STATIONS.find(s => s.id === startId);
  consolidatedSteps.push({ stationId: startId, stationName: startStation?.name || '', type: 'walk', instruction: `📍 Départ de la station ${startStation?.name}`, duration: 0 });

  let currentLeg: any = null;
  let transfers = 0;
  let totalCost = 0;
  const usedModes = new Set<TransportType>();

  rawHops.forEach(hop => {
    if (!currentLeg) {
      currentLeg = { fromStationId: hop.fromId, fromStationName: hop.fromName, toStationId: hop.toId, toStationName: hop.toName, type: hop.type, lineName: hop.lineName, duration: hop.weight, stationCount: 1, intermediateStops: [hop.toName] };
    } else if (currentLeg.type === hop.type && currentLeg.lineName === hop.lineName) {
      currentLeg.toStationId = hop.toId;
      currentLeg.toStationName = hop.toName;
      currentLeg.duration += hop.weight;
      currentLeg.stationCount += 1;
      currentLeg.intermediateStops.push(hop.toName);
    } else {
      if (currentLeg.type === 'walk') {
        consolidatedSteps.push({ stationId: currentLeg.toStationId, stationName: currentLeg.toStationName, type: 'walk', lineName: currentLeg.lineName, duration: currentLeg.duration, instruction: `🔄 Correspondance à pied vers ${currentLeg.toStationName} (${currentLeg.duration} min)`, intermediateStops: currentLeg.intermediateStops });
      } else {
        usedModes.add(currentLeg.type);
        consolidatedSteps.push({ stationId: currentLeg.toStationId, stationName: currentLeg.toStationName, type: currentLeg.type, lineName: currentLeg.lineName, duration: currentLeg.duration, instruction: `Embarquez à ${currentLeg.fromStationName} sur ${currentLeg.lineName} et descendez à ${currentLeg.toStationName} (${currentLeg.stationCount} stations - ${currentLeg.duration} min)`, intermediateStops: currentLeg.intermediateStops });
      }
      if (hop.type !== 'walk' && currentLeg.type !== 'walk') transfers++;
      currentLeg = { fromStationId: hop.fromId, fromStationName: hop.fromName, toStationId: hop.toId, toStationName: hop.toName, type: hop.type, lineName: hop.lineName, duration: hop.weight, stationCount: 1, intermediateStops: [hop.toName] };
    }
  });

  if (currentLeg) {
    if (currentLeg.type === 'walk') {
      consolidatedSteps.push({ stationId: currentLeg.toStationId, stationName: currentLeg.toStationName, type: 'walk', lineName: currentLeg.lineName, duration: currentLeg.duration, instruction: `🔄 Correspondance à pied vers ${currentLeg.toStationName} (${currentLeg.duration} min)`, intermediateStops: currentLeg.intermediateStops });
    } else {
      usedModes.add(currentLeg.type);
      consolidatedSteps.push({ stationId: currentLeg.toStationId, stationName: currentLeg.toStationName, type: currentLeg.type, lineName: currentLeg.lineName, duration: currentLeg.duration, instruction: `Embarquez à ${currentLeg.fromStationName} sur ${currentLeg.lineName} et descendez à ${currentLeg.toStationName} (${currentLeg.stationCount} stations - ${currentLeg.duration} min)`, intermediateStops: currentLeg.intermediateStops });
    }
  }

  const destStation = STATIONS.find(s => s.id === endId);
  consolidatedSteps.push({ stationId: endId, stationName: destStation?.name || '', type: 'walk', instruction: `🎉 Arrivée à la station ${destStation?.name}`, duration: 0 });

  usedModes.forEach(mode => {
    if (mode === 'metro') totalCost += 50;
    else if (mode === 'tram') totalCost += 40;
    else if (mode === 'train') totalCost += 45;
    else if (mode === 'bus') totalCost += 30;
    else if (mode === 'bus_priv') totalCost += 35;
    else if (mode === 'telepherique') totalCost += 30;
  });

  return { steps: consolidatedSteps, totalDuration: distances[endId], totalCost: totalCost || 50, transfers: Math.max(0, usedModes.size - 1) };
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { originId, destinationId } = req.body;
  if (!originId || !destinationId) {
    return res.status(400).json({ error: 'originId et destinationId sont requis' });
  }

  const route = computeRoute(originId, destinationId);
  if (!route) {
    return res.status(404).json({ error: 'Aucun itinéraire trouvé entre ces deux stations.' });
  }

  return res.status(200).json({
    route,
    aiAdvice: "Mode Cloud : Itinéraire calculé avec l'algorithme Dijkstra optimisé.",
  });
}
