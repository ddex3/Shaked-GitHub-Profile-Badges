import { getViewCount, incrementViewCount } from '../../storage/views.repository';
import { isOnCooldown, setCooldown } from '../../utils/cooldown';

export function resolveProfileViews(username: string, ip: string): number {
  if (isOnCooldown(ip, username)) {
    return getViewCount(username);
  }
  setCooldown(ip, username);
  return incrementViewCount(username);
}
