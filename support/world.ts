import { setWorldConstructor, World } from '@cucumber/cucumber';
import { type IWorldOptions } from '@cucumber/cucumber';
import { type Browser, type BrowserContext, type Page } from '@playwright/test';
import { colorize } from './utils/color-utils';

export { ANSI } from './utils/color-utils';

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  apiResponse?: unknown;
  apiStatus?: number;

  constructor(options: IWorldOptions) {
    super(options);
  }

  public getColorizedLog(
    color: 'blue' | 'cyan' | 'gray' | 'green' | 'red' | 'yellow' = 'gray'
  ): (message: string) => void {
    return (message: string) => {
      console.log(colorize(message, color));
    };
  }
}

setWorldConstructor(CustomWorld);
