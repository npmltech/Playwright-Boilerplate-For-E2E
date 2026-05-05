import type { Page } from '@playwright/test';
import type { CustomWorld } from '../support/world';
import { loginLocator } from '../locators/login.locator';
import { routes } from '../config/routes';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
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
    await this.submitButton.click();
  }

  async loginWithEmptyCredentials() {
    this.logger('Iniciando login com credenciais vazias');
    await this.openLoginPage();
    await this.usernameInput.fill('');
    await this.passwordInput.fill('');
    await this.submitButton.click();
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
