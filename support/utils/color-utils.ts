export const ANSI = {
  bgGreen: '\x1b[42m',
  bgRed: '\x1b[41m',
  bold: '\x1b[1m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  gray: '\x1b[90m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  white: '\x1b[37m',
  yellow: '\x1b[33m',
} as const;

const colorsEnabled =
  process.env.NO_COLOR === undefined &&
  (process.stdout.isTTY ||
    process.env.CUCUMBER_COLOR === '1' ||
    (process.env.FORCE_COLOR !== undefined && process.env.FORCE_COLOR !== '0'));

export function isColorEnabled(): boolean {
  return colorsEnabled;
}

export function paint(code: string, text: string): string {
  if (!colorsEnabled) return text;
  return `${code}${text}${ANSI.reset}`;
}

export function withStyles(
  text: string,
  ...styles: ReadonlyArray<keyof typeof ANSI>
): string {
  if (!colorsEnabled || styles.length === 0) return text;
  const prefix = styles.map((style) => ANSI[style]).join('');
  return `${prefix}${text}${ANSI.reset}`;
}

export function colorize(text: string, color: keyof typeof ANSI): string {
  return paint(ANSI[color], text);
}

export const bold = (text: string): string => paint(ANSI.bold, text);
export const dim = (text: string): string => paint(ANSI.dim, text);
export const green = (text: string): string => paint(ANSI.green, text);
export const red = (text: string): string => paint(ANSI.red, text);
export const yellow = (text: string): string => paint(ANSI.yellow, text);
export const cyan = (text: string): string => paint(ANSI.cyan, text);
export const blue = (text: string): string => paint(ANSI.blue, text);
export const magenta = (text: string): string => paint(ANSI.magenta, text);
export const white = (text: string): string => paint(ANSI.white, text);
export const bgGreen = (text: string): string => paint(ANSI.bgGreen, text);
export const bgRed = (text: string): string => paint(ANSI.bgRed, text);

export const boldGreen = (text: string): string =>
  withStyles(text, 'bold', 'green');
export const boldRed = (text: string): string =>
  withStyles(text, 'bold', 'red');
export const boldCyan = (text: string): string =>
  withStyles(text, 'bold', 'cyan');
