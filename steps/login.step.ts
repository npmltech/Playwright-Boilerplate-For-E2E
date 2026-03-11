import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from '../support/world';
import { LoginPage } from '../pages/login.page';
import { users } from '../data/users';

setDefaultTimeout(10_000);

Given('que eu estou na página de login', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigate('/');
});

When('eu insiro credenciais válidas', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.login(users.standard.username, users.standard.password);
});

When('eu insiro credenciais inválidas', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.login('wrong@email.com', 'wrongpassword');
});

Then('eu devo ser logado com sucesso', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(
    'https://testerbud.com/practice-login-form',
    {
      timeout: 10_000,
    }
  );
});

Then('eu devo ver uma mensagem de erro', async function (this: CustomWorld) {
  await expect(
    this.page.locator('//*[contains(text(), "Invalid")]')
  ).toBeVisible({
    timeout: 10_000,
  });
});
