import { BadgeStyle } from '../badges/types';

export interface SvgOptions {
  label: string;
  value: string;
  color: string;
  labelColor: string;
  style: BadgeStyle;
}

export type ErrorType = 'not found' | 'rate limited' | 'error';

const NAMED_COLORS: Record<string, string> = {
  brightgreen: '#4c1',
  green: '#97ca00',
  yellow: '#dfb317',
  yellowgreen: '#a4a61d',
  orange: '#fe7d37',
  red: '#e05d44',
  blue: '#007ec6',
  grey: '#555555',
  gray: '#555555',
  lightgrey: '#9f9f9f',
  lightgray: '#9f9f9f',
  success: '#4c1',
  critical: '#e05d44',
  important: '#fe7d37',
  informational: '#007ec6',
  inactive: '#9f9f9f',
};

const CHAR_WIDTHS: Record<string, number> = {
  ' ': 3.3, '!': 4, '"': 5.3, '#': 8.5, $: 7, '%': 10, '&': 8, "'": 3.3,
  '(': 4.3, ')': 4.3, '*': 6, '+': 9.5, ',': 4, '-': 4.7, '.': 4, '/': 5.3,
  '0': 7, '1': 7, '2': 7, '3': 7, '4': 7, '5': 7, '6': 7, '7': 7, '8': 7, '9': 7,
  ':': 4, ';': 4, '<': 9.5, '=': 9.5, '>': 9.5, '?': 6.3, '@': 11.5,
  A: 8, B: 7.7, C: 7.3, D: 8.5, E: 6.7, F: 6.3, G: 8, H: 8.5, I: 3.7, J: 4.3,
  K: 8, L: 6.7, M: 10, N: 8.5, O: 9, P: 7, Q: 9, R: 7.7, S: 6.3, T: 6.7,
  U: 8.5, V: 8, W: 11, X: 7.7, Y: 7, Z: 7.3,
  a: 6.7, b: 7, c: 6, d: 7, e: 7, f: 3.7, g: 7, h: 7, i: 3, j: 3, k: 6.7,
  l: 3, m: 10.7, n: 7, o: 7, p: 7, q: 7, r: 4.7, s: 5.3, t: 5, u: 7,
  v: 6.7, w: 9.3, x: 6.3, y: 6.7, z: 5.7,
};

const H_PAD = 5;
const HEIGHT = 20;

function measureText(text: string): number {
  return text.split('').reduce((acc, ch) => acc + (CHAR_WIDTHS[ch] ?? 7), 0);
}

function resolveColor(color: string): string {
  if (NAMED_COLORS[color]) return NAMED_COLORS[color];
  if (color.startsWith('#')) return color;
  return `#${color}`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function uid(): string {
  return Math.random().toString(36).slice(2, 8);
}

export function buildSvg(options: SvgOptions): string {
  const { label, value, style } = options;
  const color = resolveColor(options.color);
  const labelColor = resolveColor(options.labelColor);

  const labelW = Math.ceil(measureText(label)) + H_PAD * 2;
  const valueW = Math.ceil(measureText(value)) + H_PAD * 2;
  const totalW = labelW + valueW;

  const lx = Math.floor(labelW / 2);
  const vx = labelW + Math.floor(valueW / 2);

  const id = uid();
  const rx = style === 'rounded' ? 10 : style === 'flat' ? 3 : 0;
  const hasGradient = style !== 'flat-square';

  const gradientDef = hasGradient
    ? `<linearGradient id="g${id}" x2="0" y2="100%">
      <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
      <stop offset="1" stop-opacity=".1"/>
    </linearGradient>`
    : '';

  const clipDef = `<clipPath id="c${id}">
      <rect width="${totalW}" height="${HEIGHT}" rx="${rx}" fill="#fff"/>
    </clipPath>`;

  const gradientRect = hasGradient
    ? `<rect width="${totalW}" height="${HEIGHT}" fill="url(#g${id})"/>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${HEIGHT}" role="img" aria-label="${escapeXml(label)}: ${escapeXml(value)}">
  <title>${escapeXml(label)}: ${escapeXml(value)}</title>
  <defs>
    ${gradientDef}
    ${clipDef}
  </defs>
  <g clip-path="url(#c${id})">
    <rect width="${labelW}" height="${HEIGHT}" fill="${labelColor}"/>
    <rect x="${labelW}" width="${valueW}" height="${HEIGHT}" fill="${color}"/>
    ${gradientRect}
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
    <text x="${lx}" y="15" fill="#010101" fill-opacity=".3" aria-hidden="true">${escapeXml(label)}</text>
    <text x="${lx}" y="14">${escapeXml(label)}</text>
    <text x="${vx}" y="15" fill="#010101" fill-opacity=".3" aria-hidden="true">${escapeXml(value)}</text>
    <text x="${vx}" y="14">${escapeXml(value)}</text>
  </g>
</svg>`;
}

export function buildErrorSvg(errorType: ErrorType): string {
  return buildSvg({
    label: 'badge',
    value: errorType,
    color: '#e05d44',
    labelColor: '#555555',
    style: 'flat',
  });
}
