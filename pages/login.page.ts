import { expect, type Page } from '@playwright/test';
import type { CustomWorld } from '../support/world';
import { loginLocator } from '../ui/locators/login.locator';
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
      timeout: 15_000,
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

    // Layered submit strategy for cross-browser reliability.
    try {
      await this.submitButton.first().click();
      await this.page.waitForLoadState('domcontentloaded');
    } catch (error) {
      this.logger(`Primary login submit attempt failed: ${String(error)}`);
    }

    if (this.page.url().includes('rt=account/login')) {
      await this.passwordInput.press('Enter');
      await this.page.waitForLoadState('domcontentloaded');
    }

    if (this.page.url().includes('rt=account/login')) {
      await this.loginForm.evaluate((form: HTMLFormElement) => form.submit());
      await this.page.waitForLoadState('domcontentloaded');
    }

    await this.waitUntilLoggedIn();
    await expect(this.accountContainer).toBeVisible();
  }

  async loginExpectingError(username: string, password: string) {
    this.logger(`Iniciando login inválido com usuário: ${username}`);
    await this.openLoginPage();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.first().click();
    await this.page.waitForLoadState('domcontentloaded');

    await expect(this.page).toHaveURL(/rt=account\/login/, { timeout: 15_000 });
    await expect(this.errorAlert.first()).toContainText(
      /incorrect|no match|error/i,
      { timeout: 15_000 }
    );
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
