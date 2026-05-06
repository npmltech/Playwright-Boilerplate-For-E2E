import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from '../../../support/world';
import { LoginPage } from '../../../pages/login.page';
import { users } from '../../../data/users';
import { loginLocator } from '../../../locators/web-elements/login.locator';
import { routePatterns } from '../../../config/routes';

const cucumberTimeoutMs = Number(process.env.CUCUMBER_TIMEOUT_MS ?? 60_000);

setDefaultTimeout(cucumberTimeoutMs);

Given('that I am on the login page', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page, this);
  await loginPage.openLoginPage();
});

When('I enter valid credentials', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page, this);
  await loginPage.login(users.standard.username, users.standard.password);
  await loginPage.waitForElementVisible();
});

When('I enter invalid credentials', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page, this);
  await loginPage.login('wrong_user', 'wrongpassword');
  await loginPage.waitForElementVisible();
});

When('I click on forgot my password', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page, this);
  await loginPage.goToForgotPasswordPage();
  await loginPage.waitForElementVisible();
});

When(
  'I try to log in without filling credentials',
  async function (this: CustomWorld) {
    const loginPage = new LoginPage(this.page, this);
    await loginPage.loginWithEmptyCredentials();
    await loginPage.waitForElementVisible();
  }
);

Then('I should be logged in successfully', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(routePatterns.account, {
    timeout: cucumberTimeoutMs,
  });

  await expect(
    this.page.locator(loginLocator.logoutMenuLink).first()
  ).toBeVisible({ timeout: cucumberTimeoutMs });
});

Then('I should see an error message', async function (this: CustomWorld) {
  await expect(this.page.locator(loginLocator.errorAlert)).toContainText(
    /incorrect|no match|error/i,
    {
      timeout: cucumberTimeoutMs,
    }
  );
});

Then(
  'I should be redirected to the password recovery page',
  async function (this: CustomWorld) {
    await expect(this.page).toHaveURL(routePatterns.forgottenPassword, {
      timeout: cucumberTimeoutMs,
    });

    await expect(this.page.locator(loginLocator.forgottenForm)).toBeVisible({
      timeout: cucumberTimeoutMs,
    });
  }
);
