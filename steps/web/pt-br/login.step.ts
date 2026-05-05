import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from '../../../support/world';
import { LoginPage } from '../../../pages/login.page';
import { users } from '../../../data/users';
import { loginLocator } from '../../../locators/login.locator';
import { routePatterns } from '../../../config/routes';

const cucumberTimeoutMs = Number(process.env.CUCUMBER_TIMEOUT_MS ?? 60_000);

setDefaultTimeout(cucumberTimeoutMs);

Given('que eu estou na página de login', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page, this);
  await loginPage.openLoginPage();
});

When('eu insiro credenciais válidas', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page, this);
  await loginPage.login(users.standard.username, users.standard.password);
  await loginPage.waitForElementVisible();
});

When('eu insiro credenciais inválidas', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page, this);
  await loginPage.login('wrong_user', 'wrongpassword');
  await loginPage.waitForElementVisible();
});

When('eu clico em esqueci minha senha', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page, this);
  await loginPage.goToForgotPasswordPage();
  await loginPage.waitForElementVisible();
});

When(
  'eu tento logar sem preencher credenciais',
  async function (this: CustomWorld) {
    const loginPage = new LoginPage(this.page, this);
    await loginPage.loginWithEmptyCredentials();
    await loginPage.waitForElementVisible();
  }
);

Then('eu devo ser logado com sucesso', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(routePatterns.account, {
    timeout: cucumberTimeoutMs,
  });

  await expect(
    this.page.locator(loginLocator.logoutMenuLink).first()
  ).toBeVisible({ timeout: cucumberTimeoutMs });
});

Then('eu devo ver uma mensagem de erro', async function (this: CustomWorld) {
  await expect(this.page.locator(loginLocator.errorAlert)).toContainText(
    /incorrect|no match|error/i,
    {
      timeout: cucumberTimeoutMs,
    }
  );
});

Then(
  'eu devo ser redirecionado para a página de recuperação de senha',
  async function (this: CustomWorld) {
    await expect(this.page).toHaveURL(routePatterns.forgottenPassword, {
      timeout: cucumberTimeoutMs,
    });

    await expect(this.page.locator(loginLocator.forgottenForm)).toBeVisible({
      timeout: cucumberTimeoutMs,
    });
  }
);
