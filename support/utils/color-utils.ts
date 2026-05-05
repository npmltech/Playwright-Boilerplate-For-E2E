export const ANSI = {
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  yellow: '\x1b[33m',
} as const;

const colorsEnabled =
  process.env.NO_COLOR === undefined &&
  (process.stdout.isTTY ||
    process.env.CUCUMBER_COLOR === '1' ||
    (process.env.FORCE_COLOR !== undefined && process.env.FORCE_COLOR !== '0'));

export function colorize(text: string, color: keyof typeof ANSI): string {
  if (!colorsEnabled) return text;
  return `${ANSI[color]}${text}${ANSI.reset}`;
}
