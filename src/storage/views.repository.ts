import { getDatabase, persistDatabase } from './database';

export function getViewCount(username: string): number {
  const db = getDatabase();
  const stmt = db.prepare('SELECT views_count FROM profile_views WHERE username = ?');
  stmt.bind([username]);
  const found = stmt.step();
  const count = found
    ? (stmt.getAsObject() as { views_count: number }).views_count
    : 0;
  stmt.free();
  return count;
}

export function incrementViewCount(username: string): number {
  const db = getDatabase();

  const stmt = db.prepare('SELECT views_count FROM profile_views WHERE username = ?');
  stmt.bind([username]);
  const found = stmt.step();
  const current = found
    ? (stmt.getAsObject() as { views_count: number }).views_count
    : null;
  stmt.free();

  if (current !== null) {
    db.run(
      "UPDATE profile_views SET views_count = views_count + 1, updated_at = datetime('now') WHERE username = ?",
      [username],
    );
    persistDatabase();
    return current + 1;
  }

  db.run('INSERT INTO profile_views (username, views_count) VALUES (?, 1)', [username]);
  persistDatabase();
  return 1;
}
