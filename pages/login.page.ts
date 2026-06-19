import { expect, type Page } from '@playwright/test';
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
  private errorAlert = this.page.locator(loginLocator.errorAlert);

  private logger =
    this.world?.getColorizedLog('cyan') ??
    ((message: string) => {
      console.log(message);
    });

  constructor(page: Page, world?: CustomWorld) {
    super(page, world);
  }

  private async waitUntilLoggedIn() {
    await expect(this.page).toHaveURL(/rt=account\/account/, {
      timeout: 5000,
    });
  }

  async openLoginPage() {
    await this.navigate(routes.login);
    await expect(this.accountMenuLink.first()).toBeVisible();
    await expect(this.loginMenuLink.first()).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
  }

  async login(username: string, password: string) {
    this.logger(`Iniciando login com usuário: ${username}`);
    await this.openLoginPage();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);

    // Use layered submit strategy to reduce browser-specific flakiness.
    await this.submitButton.first().click({ force: true });
    await this.waitUntilLoggedIn().catch(() => {});

    if (this.page.url().includes('rt=account/login')) {
      await this.passwordInput.press('Enter');
      await this.waitUntilLoggedIn().catch(() => {});
    }

    if (this.page.url().includes('rt=account/login')) {
      await this.loginForm.evaluate((form: HTMLFormElement) => form.submit());
      await this.waitUntilLoggedIn();
    }

    await expect(this.accountContainer).toBeVisible();
  }

  async loginWithEmptyCredentials() {
    this.logger('Iniciando login com credenciais vazias');
    await this.openLoginPage();
    await this.usernameInput.fill('');
    await this.passwordInput.fill('');
    await this.submitButton.first().click();
    await expect(this.errorAlert).toBeVisible();
  }

  async goToForgotPasswordPage() {
    await this.openLoginPage();
    await this.forgotPasswordLink.first().click();
  }

  async waitForElementVisible() {
    await expect(this.accountContainer).toBeVisible();
  }
}
