import { getDatabase, persistDatabase } from './database';

export function getCacheEntry(key: string): string | null {
  const db = getDatabase();
  const stmt = db.prepare(
    'SELECT payload FROM cache_entries WHERE cache_key = ? AND expires_at > ?',
  );
  stmt.bind([key, Date.now()]);
  const found = stmt.step();
  const payload = found
    ? (stmt.getAsObject() as { payload: string }).payload
    : null;
  stmt.free();
  return payload;
}

export function setCacheEntry(key: string, payload: string, ttlMs: number): void {
  const db = getDatabase();
  db.run(
    `INSERT INTO cache_entries (cache_key, payload, expires_at)
     VALUES (?, ?, ?)
     ON CONFLICT(cache_key) DO UPDATE
       SET payload    = excluded.payload,
           expires_at = excluded.expires_at`,
    [key, payload, Date.now() + ttlMs],
  );
  persistDatabase();
}

export function purgeStaleCacheEntries(): void {
  const db = getDatabase();
  db.run('DELETE FROM cache_entries WHERE expires_at <= ?', [Date.now()]);
  persistDatabase();
}
