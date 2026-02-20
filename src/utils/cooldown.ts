const COOLDOWN_MS = 30 * 60 * 1000;
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;

const store = new Map<string, number>();

setInterval(() => {
  const now = Date.now();
  for (const [key, ts] of store) {
    if (now - ts >= COOLDOWN_MS) {
      store.delete(key);
    }
  }
}, CLEANUP_INTERVAL_MS).unref();

export function isOnCooldown(ip: string, username: string): boolean {
  const key = `${ip}:${username}`;
  const last = store.get(key);
  return last !== undefined && Date.now() - last < COOLDOWN_MS;
}

export function setCooldown(ip: string, username: string): void {
  store.set(`${ip}:${username}`, Date.now());
}
