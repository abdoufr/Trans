import { createClient, Client } from '@libsql/client';
import { STATIONS, LINES, INITIAL_DISRUPTIONS } from '../data';
import { EXCEL_TRANSIT_DATASET } from '../algiers_transit_excel';
import { Station, LineData, Disruption, SavedRoute } from '../types';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.TURSO_DATABASE_URL || 'file:algiers_transport.db';
const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

export const turso: Client = createClient({
  url,
  authToken,
});

console.log(`[Turso DB] Connected to database at: ${url.startsWith('file:') ? 'Local SQLite file (' + url + ')' : 'Turso Edge Cloud (' + url + ')'}`);

export async function initTursoDB() {
  const executeSqlWithRetry = async (sql: string, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await turso.execute(sql);
      } catch (err) {
        if (attempt === retries) throw err;
        console.warn(`[Turso DB] SQL attempt ${attempt} failed, retrying...`);
        await new Promise(r => setTimeout(r, 1500 * attempt));
      }
    }
  };

  try {
    // 1. Create Stations Table
    await executeSqlWithRetry(`
      CREATE TABLE IF NOT EXISTS stations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        name_ar TEXT NOT NULL,
        type TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        lines TEXT NOT NULL,
        connections TEXT NOT NULL,
        schedule TEXT NOT NULL
      );
    `);

    // 2. Create Lines Table
    await executeSqlWithRetry(`
      CREATE TABLE IF NOT EXISTS lines (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        color TEXT NOT NULL,
        stations TEXT NOT NULL,
        terminus_a TEXT,
        terminus_b TEXT,
        tariff_da INTEGER,
        frequency_min INTEGER,
        operating_hours TEXT
      );
    `);

    // 3. Create Disruption Perturbations Table
    await executeSqlWithRetry(`
      CREATE TABLE IF NOT EXISTS perturbations (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        type TEXT NOT NULL,
        severity TEXT NOT NULL,
        line_id TEXT,
        timestamp TEXT NOT NULL,
        active INTEGER NOT NULL DEFAULT 1
      );
    `);

    // 4. Create Saved Routes Table
    await executeSqlWithRetry(`
      CREATE TABLE IF NOT EXISTS saved_routes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        origin_id TEXT NOT NULL,
        destination_id TEXT NOT NULL,
        origin_name TEXT NOT NULL,
        destination_name TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);

    // Seed Stations if table is empty
    const chunkArray = <T>(arr: T[], size: number): T[][] => {
      const result: T[][] = [];
      for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
      }
      return result;
    };

    const executeBatchWithRetry = async (chunk: any[], retries = 3) => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          await turso.batch(chunk);
          return;
        } catch (err) {
          if (attempt === retries) throw err;
          console.warn(`[Turso DB] Batch attempt ${attempt} failed, retrying...`);
          await new Promise(r => setTimeout(r, 1000 * attempt));
        }
      }
    };

    // Seed/Upsert Stations in batch
    console.log('[Turso DB] Syncing stations into Turso Database in batch...');
    const stationBatch = STATIONS.map(s => ({
      sql: `INSERT OR REPLACE INTO stations (id, name, name_ar, type, lat, lng, lines, connections, schedule)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      args: [
        s.id,
        s.name,
        s.nameAr,
        s.type,
        s.lat,
        s.lng,
        JSON.stringify(s.lines),
        JSON.stringify(s.connections),
        JSON.stringify(s.schedule),
      ],
    }));
    for (const chunk of chunkArray(stationBatch, 20)) {
      await executeBatchWithRetry(chunk);
    }

    // Seed/Upsert Lines in batch
    console.log('[Turso DB] Syncing lines into Turso Database in batch...');
    const lineBatch = LINES.map(line => {
      const excelMatch = EXCEL_TRANSIT_DATASET.find(e => e.lineId === line.id);
      return {
        sql: `INSERT OR REPLACE INTO lines (id, name, type, color, stations, terminus_a, terminus_b, tariff_da, frequency_min, operating_hours)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        args: [
          line.id,
          line.name,
          line.type,
          line.color,
          JSON.stringify(line.stations),
          excelMatch?.terminusA || '',
          excelMatch?.terminusB || '',
          excelMatch?.tariffDa || 50,
          excelMatch?.frequencyMin || 5,
          excelMatch?.operatingHours || '05:30 - 23:00',
        ],
      };
    });
    for (const chunk of chunkArray(lineBatch, 20)) {
      await executeBatchWithRetry(chunk);
    }

    // Seed Perturbations if empty
    const pertCheck = await turso.execute('SELECT COUNT(*) as count FROM perturbations;');
    if (Number(pertCheck.rows[0].count) === 0) {
      console.log('[Turso DB] Seeding perturbations into Turso Database in batch...');
      const pertBatch = INITIAL_DISRUPTIONS.map(d => ({
        sql: `INSERT OR REPLACE INTO perturbations (id, title, description, type, severity, line_id, timestamp, active)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        args: [d.id, d.title, d.description, d.type, d.severity, d.lineId || '', d.timestamp, d.active ? 1 : 0],
      }));
      await turso.batch(pertBatch);
    }

    console.log('[Turso DB] Initialization & Seeding Complete! Ready.');
  } catch (err) {
    console.error('[Turso DB] Initialization error:', err);
  }
}

// Database CRUD query functions for Server
export async function getTursoStations(): Promise<Station[]> {
  try {
    const res = await turso.execute('SELECT * FROM stations;');
    return res.rows.map((row: any) => ({
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
  } catch (err) {
    console.error('Failed to fetch stations from Turso:', err);
    return STATIONS;
  }
}

export async function getTursoLines(): Promise<LineData[]> {
  try {
    const res = await turso.execute('SELECT * FROM lines;');
    return res.rows.map((row: any) => ({
      id: String(row.id),
      name: String(row.name),
      type: row.type as any,
      color: String(row.color),
      stations: JSON.parse(String(row.stations)),
    }));
  } catch (err) {
    console.error('Failed to fetch lines from Turso:', err);
    return LINES;
  }
}

export async function getTursoPerturbations(): Promise<Disruption[]> {
  try {
    const res = await turso.execute('SELECT * FROM perturbations WHERE active = 1 ORDER BY timestamp DESC;');
    return res.rows.map((row: any) => ({
      id: String(row.id),
      title: String(row.title),
      description: String(row.description),
      type: row.type as any,
      severity: row.severity as any,
      lineId: String(row.line_id),
      timestamp: String(row.timestamp),
      active: Boolean(row.active),
    }));
  } catch (err) {
    console.error('Failed to fetch perturbations from Turso:', err);
    return INITIAL_DISRUPTIONS;
  }
}

export async function addTursoPerturbation(d: Disruption): Promise<void> {
  try {
    await turso.execute({
      sql: `INSERT INTO perturbations (id, title, description, type, severity, line_id, timestamp, active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      args: [d.id, d.title, d.description, d.type, d.severity, d.lineId || '', d.timestamp, 1],
    });
  } catch (err) {
    console.error('Failed to add perturbation to Turso:', err);
  }
}

export async function saveTursoRoute(r: SavedRoute): Promise<void> {
  try {
    await turso.execute({
      sql: `INSERT INTO saved_routes (id, name, origin_id, destination_id, origin_name, destination_name, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?);`,
      args: [r.id, r.name, r.originId, r.destinationId, r.originName, r.destinationName, r.createdAt],
    });
  } catch (err) {
    console.error('Failed to save route to Turso:', err);
  }
}

export async function getTursoSavedRoutes(): Promise<SavedRoute[]> {
  try {
    const res = await turso.execute('SELECT * FROM saved_routes ORDER BY created_at DESC;');
    return res.rows.map((row: any) => ({
      id: String(row.id),
      name: String(row.name),
      originId: String(row.origin_id),
      destinationId: String(row.destination_id),
      originName: String(row.origin_name),
      destinationName: String(row.destination_name),
      createdAt: String(row.created_at),
    }));
  } catch (err) {
    console.error('Failed to fetch saved routes from Turso:', err);
    return [];
  }
}
