import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { users } from '../../data/users';

console.log('>> Carregando Login.step.ts');

test.describe('Login', () => {
  test('should login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL('https://testerbud.com/practice-login-form');
  });

  test('should show error with wrong credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('wrong@email.com', 'wrongpassword');

    await expect(
      page.locator('//*[contains(text(), "required")]')
    ).toBeVisible();
  });
});
