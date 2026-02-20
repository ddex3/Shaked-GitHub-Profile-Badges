import initSqlJs from 'sql.js';
import type { Database } from 'sql.js';
import path from 'path';
import fs from 'fs';
import { applySchema } from './schema';

let instance: Database | null = null;
let dbFilePath = '';

export function getDatabase(): Database {
  if (!instance) throw new Error('Database not initialized. Call initDatabase() first.');
  return instance;
}

export function persistDatabase(): void {
  if (!instance || !dbFilePath) return;
  fs.writeFileSync(dbFilePath, Buffer.from(instance.export()));
}

export async function initDatabase(): Promise<void> {
  const SQL = await initSqlJs({
    locateFile: (filename: string) =>
      path.join(path.dirname(require.resolve('sql.js')), filename),
  });

  dbFilePath = path.resolve(process.cwd(), path.join('data', 'badges.db'));

  const dir = path.dirname(dbFilePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  instance = fs.existsSync(dbFilePath)
    ? new SQL.Database(fs.readFileSync(dbFilePath))
    : new SQL.Database();

  applySchema(instance);
  persistDatabase();
}
