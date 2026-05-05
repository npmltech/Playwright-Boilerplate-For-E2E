import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { users } from '../../data/users';

console.log('>> Carregando Login.step.ts');

test.describe('Login', () => {
  test('should login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(users.standard.username, users.standard.password);
    await loginPage.waitForElementVisible();

    await expect(page).toHaveURL(/index\.php\?rt=account\/account/);
    await expect(
      page.locator('a[href*="rt=account/logout"]:visible').first()
    ).toBeVisible();
  });

  test('should show error with wrong credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('wrong_user', 'wrongpassword');
    await loginPage.waitForElementVisible();

    await expect(
      page.locator('.alert.alert-error, .alert.alert-danger')
    ).toContainText(/incorrect|no match|error/i);
  });
});
