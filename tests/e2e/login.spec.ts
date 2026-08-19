import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { users } from '../../data/users';
import { loginLocator } from '../../ui/locators/login.locator';
import { routePatterns } from '../../config/routes';
import { ELEMENT_VISIBLE_TIMEOUT_MS } from '../../support/constants/timeouts';

console.log('>> Carregando Login.step.ts');

test.describe('Login', () => {
  test('should login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(users.standard.username, users.standard.password);
    await loginPage.waitForElementVisible();

    await expect(page).toHaveURL(routePatterns.account, {
      timeout: ELEMENT_VISIBLE_TIMEOUT_MS,
    });
    await expect(page.locator(loginLocator.logoutMenuLink).first()).toBeVisible(
      {
        timeout: ELEMENT_VISIBLE_TIMEOUT_MS,
      }
    );
  });

  test('should show error with wrong credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.loginExpectingError('wrong_user', 'wrongpassword');

    await expect(page.locator(loginLocator.errorAlert).first()).toContainText(
      /incorrect|no match|error/i,
      { timeout: ELEMENT_VISIBLE_TIMEOUT_MS }
    );
  });
});
