import type { ANSI } from '../utils/color-utils';
import { colorize } from '../utils/color-utils';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env'), quiet: true });

export interface GherkinDocumentLike {
  feature?: {
    children?: ReadonlyArray<{
      scenario?: {
        steps?: ReadonlyArray<{ id?: string; keyword?: string }>;
      };
    }>;
  };
}

export interface PickleStepLike {
  astNodeIds?: ReadonlyArray<string>;
  text: string;
}

export class HooksHelper {
  static readonly isVerbose = process.env.CUCUMBER_VERBOSE === '1';
  static readonly cucumberTimeoutMs = Number(
    process.env.CUCUMBER_TIMEOUT_MS ?? 60_000
  );
  static readonly botBypassUserAgent =
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';
  static readonly defaultBaseUrl = 'https://automationteststore.com/';

  private static readonly _keywordCache = new WeakMap<
    object,
    Map<string, string>
  >();

  static colorize(text: string, color: keyof typeof ANSI): string {
    return colorize(text, color);
  }

  static getStepKeyword(
    gherkinDocument: GherkinDocumentLike,
    pickleStep: PickleStepLike
  ): string {
    let keywordMap = HooksHelper._keywordCache.get(
      gherkinDocument as object
    );
    if (!keywordMap) {
      keywordMap = new Map<string, string>();
      for (const child of gherkinDocument?.feature?.children ?? []) {
        for (const step of child?.scenario?.steps ?? []) {
          if (step.id !== undefined) {
            keywordMap.set(step.id, (step.keyword ?? '').trim());
          }
        }
      }
      HooksHelper._keywordCache.set(gherkinDocument as object, keywordMap);
    }

    for (const id of pickleStep?.astNodeIds ?? []) {
      const keyword = keywordMap.get(id);
      if (keyword !== undefined) return keyword;
    }
    return '';
  }

  static formatException(exception: unknown): string {
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
}
