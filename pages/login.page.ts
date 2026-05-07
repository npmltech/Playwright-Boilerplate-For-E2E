import type { Page } from '@playwright/test';
import type { CustomWorld } from '../support/world';
import { loginLocator } from '../locators/web-elements/login.locator';
import { routes } from '../config/routes';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  private loginForm = this.page.locator(loginLocator.loginForm);
  private accountMenuLink = this.page.locator(loginLocator.accountMenuLink);
  private loginMenuLink = this.page.locator(loginLocator.loginMenuLink);
  private usernameInput = this.page.locator(loginLocator.usernameInput);
  private passwordInput = this.page.locator(loginLocator.passwordInput);
  private submitButton = this.page.locator(loginLocator.submitButton);
  private forgotPasswordLink = this.page.locator(
    loginLocator.forgotPasswordLink
  );
  private accountContainer = this.page.locator(loginLocator.accountContainer);

  private logger =
    this.world?.getColorizedLog('cyan') ??
    ((message: string) => {
      console.log(message);
    });

  constructor(page: Page, world?: CustomWorld) {
    super(page, world);
  }

  async openLoginPage() {
    await this.navigate(routes.login);
    await this.accountMenuLink.first().waitFor({ state: 'visible' });
    await this.loginMenuLink.first().waitFor({ state: 'visible' });
    await this.usernameInput.waitFor({ state: 'visible' });
  }

  async login(username: string, password: string) {
    this.logger(`Iniciando login com usuário: ${username}`);
    await this.openLoginPage();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);

    // Use layered submit strategy to reduce browser-specific flakiness.
    await this.submitButton.first().click({ force: true });
    await this.page
      .waitForURL(/rt=account\/account/, { timeout: 5000 })
      .catch(() => {});

    if (this.page.url().includes('rt=account/login')) {
      await this.passwordInput.press('Enter');
      await this.page
        .waitForURL(/rt=account\/account/, { timeout: 5000 })
        .catch(() => {});
    }

    if (this.page.url().includes('rt=account/login')) {
      await this.loginForm.evaluate((form: HTMLFormElement) => form.submit());
    }

    await this.page.waitForLoadState('domcontentloaded');
  }

  async loginWithEmptyCredentials() {
    this.logger('Iniciando login com credenciais vazias');
    await this.openLoginPage();
    await this.usernameInput.fill('');
    await this.passwordInput.fill('');
    await this.submitButton.first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async goToForgotPasswordPage() {
    await this.openLoginPage();
    await this.forgotPasswordLink.first().click();
  }

  async waitForElementVisible() {
    await this.page.waitForLoadState('load');
    await this.page.waitForFunction(() => {
      return (
        document.readyState === 'complete' && document.styleSheets.length > 0
      );
    });
    await this.accountContainer.waitFor({ state: 'visible' });
  }
}
