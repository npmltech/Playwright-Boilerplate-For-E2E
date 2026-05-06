import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { users } from '../../data/users';
import { loginLocator } from '../../locators/web-elements/login.locator';
import { routePatterns } from '../../config/routes';

console.log('>> Carregando Login.step.ts');

test.describe('Login', () => {
  test('should login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(users.standard.username, users.standard.password);
    await loginPage.waitForElementVisible();

    await expect(page).toHaveURL(routePatterns.account, { timeout: 15_000 });
    await expect(page.locator(loginLocator.logoutMenuLink).first()).toBeVisible(
      {
        timeout: 15_000,
      }
    );
  });

  test('should show error with wrong credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('wrong_user', 'wrongpassword');
    await loginPage.waitForElementVisible();

    await expect(page.locator(loginLocator.errorAlert).first()).toContainText(
      /incorrect|no match|error/i,
      { timeout: 15_000 }
    );
  });
});
