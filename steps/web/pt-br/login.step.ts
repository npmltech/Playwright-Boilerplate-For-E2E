import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from '../../../support/world';
import { LoginPage } from '../../../pages/login.page';
import { users } from '../../../data/users';
import { loginLocator } from '../../../ui/locators/login.locator';
import { routePatterns } from '../../../config/routes';
import { HooksHelper } from '../../../support/helpers/hooks-helpers';

setDefaultTimeout(HooksHelper.cucumberTimeoutMs);

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
  await loginPage.loginExpectingError('wrong_user', 'wrongpassword');
});

When('eu clico em esqueci minha senha', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page, this);
  await loginPage.goToForgotPasswordPage();
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
    timeout: HooksHelper.cucumberTimeoutMs,
  });

  await expect(
    this.page.locator(loginLocator.logoutMenuLink).first()
  ).toBeVisible({ timeout: HooksHelper.cucumberTimeoutMs });
});

Then('eu devo ver uma mensagem de erro', async function (this: CustomWorld) {
  await expect(this.page.locator(loginLocator.errorAlert)).toContainText(
    /incorrect|no match|error/i,
    {
      timeout: HooksHelper.cucumberTimeoutMs,
    }
  );
});

Then(
  'eu devo ser redirecionado para a página de recuperação de senha',
  async function (this: CustomWorld) {
    await expect(this.page).toHaveURL(routePatterns.forgottenPassword, {
      timeout: HooksHelper.cucumberTimeoutMs,
    });

    await expect(this.page.locator(loginLocator.forgottenForm)).toBeVisible({
      timeout: HooksHelper.cucumberTimeoutMs,
    });
  }
);
