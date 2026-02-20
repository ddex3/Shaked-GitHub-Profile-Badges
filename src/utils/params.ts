import { Request } from 'express';
import { BadgeParams, BadgeStyle } from '../badges/types';

const VALID_STYLES: BadgeStyle[] = ['flat', 'flat-square', 'rounded'];

export function parseBadgeParams(req: Request): BadgeParams {
  const { username, label, color, labelColor, style, prefix, suffix } = req.query;

  return {
    username: typeof username === 'string' ? username.trim() : '',
    label: typeof label === 'string' ? label : undefined,
    color: typeof color === 'string' ? color : undefined,
    labelColor: typeof labelColor === 'string' ? labelColor : undefined,
    style: VALID_STYLES.includes(style as BadgeStyle) ? (style as BadgeStyle) : 'flat',
    prefix: typeof prefix === 'string' ? prefix : undefined,
    suffix: typeof suffix === 'string' ? suffix : undefined,
  };
}
