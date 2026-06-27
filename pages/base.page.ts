import { expect, type Page } from '@playwright/test';
import type { CustomWorld } from '../support/world';

export class BasePage {
  constructor(
    protected page: Page,
    protected world?: CustomWorld
  ) {}

  async navigate(path: string) {
    const base = process.env.BASE_URL || 'https://automationteststore.com/';
    const url = new URL(path, base).toString();
    const logger =
      this.world?.getColorizedLog('cyan') ??
      ((message: string) => {
        console.log(message);
      });
    logger('Navegando para: ' + url);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async waitForPageLoad() {
    await expect(this.page.locator('body')).toBeVisible();
  }
}
