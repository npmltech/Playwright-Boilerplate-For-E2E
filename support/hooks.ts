import { Before, BeforeStep, AfterStep, After } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import type { CustomWorld } from './world';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env'), quiet: true });

const isVerbose = process.env.CUCUMBER_VERBOSE === '1';
const forceColor =
  process.env.CUCUMBER_COLOR === '1' ||
  (process.env.FORCE_COLOR !== undefined && process.env.FORCE_COLOR !== '0');
const colorsEnabled =
  process.env.NO_COLOR === undefined && (process.stdout.isTTY || forceColor);

const ANSI = {
  reset: '\x1b[0m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
} as const;

function colorize(text: string, color: keyof typeof ANSI): string {
  if (!colorsEnabled) return text;
  return `${ANSI[color]}${text}${ANSI.reset}`;
}

interface GherkinDocumentLike {
  feature?: {
    children?: ReadonlyArray<{
      scenario?: {
        steps?: ReadonlyArray<{ id?: string; keyword?: string }>;
      };
    }>;
  };
}

interface PickleStepLike {
  astNodeIds?: ReadonlyArray<string>;
  text: string;
}

function getStepKeyword(
  gherkinDocument: GherkinDocumentLike,
  pickleStep: PickleStepLike
): string {
  const astNodeIds = pickleStep?.astNodeIds ?? [];
  const children = gherkinDocument?.feature?.children ?? [];

  for (const child of children) {
    const scenario = child?.scenario;
    const steps = scenario?.steps ?? [];

    for (const step of steps) {
      if (step?.id !== undefined && astNodeIds.includes(step.id)) {
        return (step?.keyword ?? '').trim();
      }
    }
  }

  return '';
}

function formatException(exception: unknown): string {
  if (exception && typeof exception === 'object') {
    const record = exception as { stack?: unknown; message?: unknown };
    if (typeof record.stack === 'string' && record.stack.length > 0) {
      return record.stack;
    }
    if (typeof record.message === 'string' && record.message.length > 0) {
      return record.message;
    }
  }

  return String(exception);
}

Before(async function (this: CustomWorld, { pickle }) {
  if (isVerbose) {
    console.log(`\n${colorize(`📋 Cenário: ${pickle.name}`, 'cyan')}`);
  }

  this.browser = await chromium.launch({ headless: true });
  this.context = await this.browser.newContext({
    baseURL: process.env.BASE_URL,
  });
  this.page = await this.context.newPage();
});

BeforeStep(function ({ pickleStep, gherkinDocument }) {
  if (!isVerbose) return;

  const keyword = getStepKeyword(gherkinDocument, pickleStep);
  const stepLine = `${keyword} ${pickleStep.text}`.trim();
  console.log(`\n${colorize(stepLine, 'blue')}`);
});

AfterStep(function ({ pickleStep, gherkinDocument, result }) {
  if (!isVerbose) return;

  const keyword = getStepKeyword(gherkinDocument, pickleStep);
  const stepLine = `${keyword} ${pickleStep.text}`.trim();
  const status = String(result?.status ?? 'UNKNOWN');

  if (status === 'PASSED') {
    console.log(colorize(`✔ ${stepLine}`, 'green'));
  } else if (status === 'SKIPPED') {
    console.log(colorize(`? ${stepLine}`, 'yellow'));
  } else if (status === 'PENDING' || status === 'UNDEFINED') {
    console.log(colorize(`! ${status}: ${stepLine}`, 'yellow'));
  }

  if (result?.exception) {
    console.error(`\n${colorize(`❌ STEP ERROR: ${stepLine}`, 'red')}`);
    console.error(formatException(result.exception));
  }
});

After(async function (this: CustomWorld, { pickle, result }) {
  if (isVerbose && result?.exception) {
    console.error(`\n${colorize(`❌ SCENARIO ERROR: ${pickle.name}`, 'red')}`);
    console.error(formatException(result.exception));
  }

  await this.page.close();
  await this.context.close();
  await this.browser.close();
});