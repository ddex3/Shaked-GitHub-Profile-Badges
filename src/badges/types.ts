export type BadgeType =
  | 'profile-views'
  | 'followers'
  | 'following'
  | 'repos'
  | 'gists'
  | 'created'
  | 'updated'
  | 'stars';

export type BadgeStyle = 'flat' | 'flat-square' | 'rounded';

export interface BadgeParams {
  username: string;
  label?: string;
  color?: string;
  labelColor?: string;
  style: BadgeStyle;
  prefix?: string;
  suffix?: string;
}

export interface BadgeContext {
  type: BadgeType;
  params: BadgeParams;
  ip: string;
}

export interface ResolvedBadge {
  label: string;
  value: string;
  color: string;
  labelColor: string;
}
