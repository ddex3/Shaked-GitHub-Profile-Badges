import type { Database } from 'sql.js';

export function applySchema(db: Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS profile_views (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      username    TEXT    NOT NULL,
      views_count INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_profile_views_username
      ON profile_views (username);

    CREATE TABLE IF NOT EXISTS cache_entries (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      cache_key  TEXT    NOT NULL UNIQUE,
      payload    TEXT    NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_cache_entries_key
      ON cache_entries (cache_key);
  `);
}
