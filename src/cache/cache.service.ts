import { getCacheEntry, setCacheEntry } from '../storage/cache.repository';
import { hashParams } from '../utils/hash';
import { BadgeParams } from '../badges/types';

const DEFAULT_TTL_MS = 5 * 60 * 1000;

export function buildCacheKey(
  badgeType: string,
  username: string,
  params: BadgeParams,
): string {
  const { username: _u, ...rest } = params;
  return `${badgeType}:${username}:${hashParams(rest as Record<string, unknown>)}`;
}

export function getCached(key: string): string | null {
  return getCacheEntry(key);
}

export function setCached(key: string, svg: string, ttlMs = DEFAULT_TTL_MS): void {
  setCacheEntry(key, svg, ttlMs);
}
