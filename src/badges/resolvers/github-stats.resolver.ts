import { BadgeType } from '../types';
import { getUser, getUserTotalStars } from '../../providers/github.provider';

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export async function resolveGitHubStat(
  type: BadgeType,
  username: string,
): Promise<string> {
  if (type === 'stars') {
    return formatNumber(await getUserTotalStars(username));
  }

  const user = await getUser(username);

  switch (type) {
    case 'followers':
      return formatNumber(user.followers);
    case 'following':
      return formatNumber(user.following);
    case 'repos':
      return formatNumber(user.public_repos);
    case 'gists':
      return formatNumber(user.public_gists);
    case 'created':
      return formatDate(user.created_at);
    case 'updated':
      return formatDate(user.updated_at);
    default:
      return 'N/A';
  }
}
