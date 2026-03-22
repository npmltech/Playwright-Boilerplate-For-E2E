import { setWorldConstructor, World } from '@cucumber/cucumber';
import { type IWorldOptions } from '@cucumber/cucumber';
import { type Browser, type BrowserContext, type Page } from '@playwright/test';

const ANSI = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
} as const;

const colorsEnabled =
  process.stdout.isTTY ||
  process.env.CUCUMBER_COLOR === '1' ||
  process.env.FORCE_COLOR === '1';

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }

  public getColorizedLog(
    color: 'cyan' | 'gray' = 'gray'
  ): (message: string) => void {
    return (message: string) => {
      console.log(
        colorsEnabled ? `${ANSI[color]}${message}${ANSI.reset}` : message
      );
    };
  }
}

setWorldConstructor(CustomWorld);
