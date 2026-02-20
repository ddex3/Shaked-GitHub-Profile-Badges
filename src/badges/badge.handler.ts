import { Request, Response } from 'express';
import { BadgeType } from './types';
import { parseBadgeParams } from '../utils/params';
import { buildCacheKey, getCached, setCached } from '../cache/cache.service';
import { resolveProfileViews } from './resolvers/profile-views.resolver';
import { resolveGitHubStat } from './resolvers/github-stats.resolver';
import { buildSvg, buildErrorSvg } from '../svg/svg.builder';
import { NotFoundError, RateLimitError } from '../providers/github.provider';

const VALID_TYPES = new Set<BadgeType>([
  'profile-views',
  'followers',
  'following',
  'repos',
  'gists',
  'created',
  'updated',
  'stars',
]);

const DEFAULT_LABELS: Record<BadgeType, string> = {
  'profile-views': 'profile views',
  followers: 'followers',
  following: 'following',
  repos: 'repos',
  gists: 'gists',
  created: 'created',
  updated: 'updated',
  stars: 'stars',
};

const DEFAULT_COLORS: Record<BadgeType, string> = {
  'profile-views': '#007ec6',
  followers: '#4c1',
  following: '#97ca00',
  repos: '#fe7d37',
  gists: '#dfb317',
  created: '#9f9f9f',
  updated: '#9f9f9f',
  stars: '#dfb317',
};

function setSvgHeaders(res: Response, cacheable: boolean): void {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (cacheable) {
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  } else {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}

function resolveClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress ?? '0.0.0.0';
}

export async function badgeHandler(req: Request, res: Response): Promise<void> {
  const type = req.params.type as BadgeType;

  if (!VALID_TYPES.has(type)) {
    setSvgHeaders(res, false);
    res.send(buildErrorSvg('error'));
    return;
  }

  const params = parseBadgeParams(req);

  if (!params.username) {
    setSvgHeaders(res, false);
    res.send(buildErrorSvg('error'));
    return;
  }

  const isProfileViews = type === 'profile-views';
  setSvgHeaders(res, !isProfileViews);

  if (!isProfileViews) {
    const cacheKey = buildCacheKey(type, params.username, params);
    const cached = getCached(cacheKey);
    if (cached) {
      res.send(cached);
      return;
    }
  }

  try {
    let value: string;

    if (isProfileViews) {
      const ip = resolveClientIp(req);
      const count = resolveProfileViews(params.username, ip);
      value = `${params.prefix ?? ''}${count}${params.suffix ?? ''}`;
    } else {
      const stat = await resolveGitHubStat(type, params.username);
      value = `${params.prefix ?? ''}${stat}${params.suffix ?? ''}`;
    }

    const svg = buildSvg({
      label: params.label ?? DEFAULT_LABELS[type],
      value,
      color: params.color ?? DEFAULT_COLORS[type],
      labelColor: params.labelColor ?? '#555555',
      style: params.style,
    });

    if (!isProfileViews) {
      const cacheKey = buildCacheKey(type, params.username, params);
      setCached(cacheKey, svg);
    }

    res.send(svg);
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.send(buildErrorSvg('not found'));
    } else if (err instanceof RateLimitError) {
      res.send(buildErrorSvg('rate limited'));
    } else {
      res.send(buildErrorSvg('error'));
    }
  }
}
