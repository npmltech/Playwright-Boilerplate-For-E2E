import type { Page } from '@playwright/test';
import type { CustomWorld } from '../support/world';

export class BasePage {
  constructor(
    protected page: Page,
    protected world?: CustomWorld
  ) {}

  async navigate(path: string) {
    const base =
      process.env.BASE_URL || 'https://testerbud.com/practice-login-form';
    const url = path === '/' ? base : `${base}${path}`;
    const logger =
      this.world?.getColorizedLog('cyan') ??
      ((message: string) => {
        console.log(message);
      });
    logger('Navegando para: ' + url);
    await this.page.goto(url);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }
}
