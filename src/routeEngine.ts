import { Station, LineData, TransportType, RouteResult, RouteStep } from './types';

/**
 * Moteur de calcul d'itinéraire Dijkstra
 * Prend les stations et lignes en paramètre pour permettre l'usage depuis Turso ou données locales
 */
export function computeRoute(
  STATIONS: Station[],
  LINES: LineData[],
  startId: string,
  endId: string
): RouteResult | null {

  if (startId === endId) {
    const station = STATIONS.find(s => s.id === startId);
    return {
      steps: [{ stationId: startId, stationName: station?.name || '', type: 'walk', instruction: "Vous êtes déjà à la station de destination !", duration: 0 }],
      totalDuration: 0, totalCost: 0, transfers: 0
    };
  }

  // 0. Ligne directe sans correspondance
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
        totalDuration, totalCost: cost, transfers: 0
      };
    }
  }

  // 1. Graphe Dijkstra
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

  // 2. Pénalité de correspondance 12 min
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

  STATIONS.forEach(s => { distances[s.id] = Infinity; previous[s.id] = null; queue.add(s.id); });
  distances[startId] = 0;

  while (queue.size > 0) {
    let u: string | null = null;
    queue.forEach(nodeId => { if (u === null || distances[nodeId] < distances[u!]) u = nodeId; });
    if (u === null || distances[u] === Infinity) break;
    if (u === endId) break;
    queue.delete(u);
    for (const v in graph[u]) {
      if (!queue.has(v)) continue;
      const alt = distances[u] + graph[u][v].weight;
      if (alt < distances[v]) {
        distances[v] = alt;
        previous[v] = { parentId: u, type: graph[u][v].type, lineName: graph[u][v].lineName, weight: graph[u][v].weight };
      }
    }
  }

  if (distances[endId] === Infinity) return null;

  // 3. Reconstruction du chemin
  const rawHops: { fromId: string; fromName: string; toId: string; toName: string; type: TransportType | 'walk'; lineName?: string; weight: number }[] = [];
  let currentId = endId;
  while (previous[currentId] !== null) {
    const edge = previous[currentId]!;
    rawHops.unshift({
      fromId: edge.parentId,
      fromName: STATIONS.find(s => s.id === edge.parentId)?.name || '',
      toId: currentId,
      toName: STATIONS.find(s => s.id === currentId)?.name || '',
      type: edge.type, lineName: edge.lineName, weight: edge.weight
    });
    currentId = edge.parentId;
  }

  // 4. Consolidation des legs
  const consolidatedSteps: RouteStep[] = [];
  const startStation = STATIONS.find(s => s.id === startId);
  consolidatedSteps.push({ stationId: startId, stationName: startStation?.name || '', type: 'walk', instruction: `📍 Départ de la station ${startStation?.name}`, duration: 0 });

  let currentLeg: any = null;
  let transfers = 0;
  const usedModes = new Set<TransportType>();
  let totalCost = 0;

  rawHops.forEach(hop => {
    if (!currentLeg) {
      currentLeg = { fromStationId: hop.fromId, fromStationName: hop.fromName, toStationId: hop.toId, toStationName: hop.toName, type: hop.type, lineName: hop.lineName, duration: hop.weight, stationCount: 1, intermediateStops: [hop.toName] };
    } else if (currentLeg.type === hop.type && currentLeg.lineName === hop.lineName) {
      currentLeg.toStationId = hop.toId; currentLeg.toStationName = hop.toName;
      currentLeg.duration += hop.weight; currentLeg.stationCount++;
      currentLeg.intermediateStops.push(hop.toName);
    } else {
      flushLeg(currentLeg, consolidatedSteps, usedModes);
      if (hop.type !== 'walk' && currentLeg.type !== 'walk') transfers++;
      currentLeg = { fromStationId: hop.fromId, fromStationName: hop.fromName, toStationId: hop.toId, toStationName: hop.toName, type: hop.type, lineName: hop.lineName, duration: hop.weight, stationCount: 1, intermediateStops: [hop.toName] };
    }
  });

  if (currentLeg) flushLeg(currentLeg, consolidatedSteps, usedModes);

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

function flushLeg(leg: any, steps: RouteStep[], usedModes: Set<TransportType>) {
  if (leg.type === 'walk') {
    steps.push({ stationId: leg.toStationId, stationName: leg.toStationName, type: 'walk', lineName: leg.lineName, duration: leg.duration, instruction: `🔄 Correspondance à pied vers ${leg.toStationName} (${leg.duration} min)`, intermediateStops: leg.intermediateStops });
  } else {
    usedModes.add(leg.type);
    steps.push({ stationId: leg.toStationId, stationName: leg.toStationName, type: leg.type, lineName: leg.lineName, duration: leg.duration, instruction: `Embarquez à ${leg.fromStationName} sur ${leg.lineName} et descendez à ${leg.toStationName} (${leg.stationCount} stations - ${leg.duration} min)`, intermediateStops: leg.intermediateStops });
  }
}
