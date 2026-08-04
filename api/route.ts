import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@libsql/client';
import { computeRoute } from '../src/routeEngine';
import { Station, LineData } from '../src/types';
import { STATIONS as FALLBACK_STATIONS, LINES as FALLBACK_LINES } from '../src/data';

async function getDataFromTurso(): Promise<{ stations: Station[]; lines: LineData[] }> {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || url.startsWith('file:')) {
    return { stations: FALLBACK_STATIONS, lines: FALLBACK_LINES };
  }

  try {
    const turso = createClient({ url, authToken });

    const [stationsRes, linesRes] = await Promise.all([
      turso.execute('SELECT * FROM stations;'),
      turso.execute('SELECT * FROM lines;'),
    ]);

    const stations: Station[] = stationsRes.rows.map((row: any) => ({
      id: String(row.id),
      name: String(row.name),
      nameAr: String(row.name_ar),
      type: row.type as any,
      lat: Number(row.lat),
      lng: Number(row.lng),
      lines: JSON.parse(String(row.lines)),
      connections: JSON.parse(String(row.connections)),
      schedule: JSON.parse(String(row.schedule)),
    }));

    const lines: LineData[] = linesRes.rows.map((row: any) => ({
      id: String(row.id),
      name: String(row.name),
      type: row.type as any,
      color: String(row.color),
      stations: JSON.parse(String(row.stations)),
    }));

    return { stations, lines };
  } catch (err) {
    console.error('[api/route] Turso fetch failed, using fallback data:', err);
    return { stations: FALLBACK_STATIONS, lines: FALLBACK_LINES };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { originId, destinationId } = req.body;
  if (!originId || !destinationId) {
    return res.status(400).json({ error: 'originId et destinationId sont requis' });
  }

  try {
    const { stations, lines } = await getDataFromTurso();
    console.log(`[api/route] Using ${stations.length} stations and ${lines.length} lines from Turso`);

    const route = computeRoute(stations, lines, originId, destinationId);
    if (!route) {
      return res.status(404).json({ error: 'Aucun itinéraire trouvé entre ces deux stations.' });
    }

    return res.status(200).json({
      route,
      aiAdvice: "Itinéraire calculé depuis votre base Turso Cloud.",
    });
  } catch (err) {
    console.error('[api/route] Error:', err);
    return res.status(500).json({ error: 'Erreur serveur lors du calcul.' });
  }
}
