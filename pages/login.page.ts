import type { Page } from '@playwright/test';
import type { CustomWorld } from '../support/world';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  private usernameInput = this.page.locator(
    'xpath=//*[contains(@type, "email")]'
  );
  private passwordInput = this.page.locator(
    'xpath=//*[contains(@type, "password")]'
  );
  private submitButton = this.page.locator('button[type="submit"]');

  private logger =
    this.world?.getColorizedLog('cyan') ??
    ((message: string) => {
      console.log(message);
    });

  constructor(page: Page, world?: CustomWorld) {
    super(page, world);
  }

  async login(username: string, password: string) {
    this.logger(`Iniciando login com usuário: ${username}`);
    await this.navigate('/');
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}