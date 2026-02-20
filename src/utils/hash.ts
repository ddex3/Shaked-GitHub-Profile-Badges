import { createHash } from 'crypto';

export function hashParams(params: Record<string, unknown>): string {
  const sorted = Object.keys(params)
    .sort()
    .reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {});
  return createHash('md5').update(JSON.stringify(sorted)).digest('hex').slice(0, 8);
}
