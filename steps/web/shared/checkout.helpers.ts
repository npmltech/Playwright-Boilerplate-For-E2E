import { expect } from '@playwright/test';
import type { CustomWorld } from '../../../support/world';
import { checkoutLocator } from '../../../ui/locators/checkout.locator';
import { users } from '../../../data/users';
import { LoginPage } from '../../../pages/login.page';
import { routes } from '../../../config/routes';
import { BasePage } from '../../../pages/base.page';

export async function ensureLoggedIn(world: CustomWorld) {
  const logoutLink = world.page
    .locator('a[href*="rt=account/logout"]')
    .filter({ visible: true })
    .first();
  if (await logoutLink.count()) return;

  const loginPage = new LoginPage(world.page, world);
  await loginPage.login(users.standard.username, users.standard.password);
  await loginPage.waitForElementVisible();
}

export async function openCheckoutFromCart(world: CustomWorld) {
  const basePage = new BasePage(world.page, world);
  await basePage.navigate(routes.cart);
  await basePage.waitForPageLoad();

  const checkoutButton = world.page
    .locator(checkoutLocator.checkoutButton)
    .filter({ visible: true })
    .first();
  await expect(checkoutButton).toBeVisible({ timeout: 15000 });
  await checkoutButton.click();
  await basePage.waitForPageLoad();

  if (world.page.url().includes('rt=account/login')) {
    await ensureLoggedIn(world);
    await basePage.navigate(routes.cart);
    await basePage.waitForPageLoad();

    const retryCheckoutButton = world.page
      .locator(checkoutLocator.checkoutButton)
      .filter({ visible: true })
      .first();
    await expect(retryCheckoutButton).toBeVisible({ timeout: 15000 });
    await retryCheckoutButton.click();
    await basePage.waitForPageLoad();
  }
}

export async function proceedToConfirmPage(world: CustomWorld) {
  const basePage = new BasePage(world.page, world);
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const confirmButton = world.page
      .locator(checkoutLocator.confirmButton)
      .filter({ visible: true })
      .first();
    if (await confirmButton.count()) return;

    const continueButton = world.page
      .locator(checkoutLocator.checkoutContinueButton)
      .filter({ visible: true })
      .first();
    if (!(await continueButton.count())) break;

    await continueButton.click();
    await basePage.waitForPageLoad();
  }
}

export async function ensureProductInCart(world: CustomWorld) {
  const basePage = new BasePage(world.page, world);
  await ensureLoggedIn(world);

  await basePage.navigate(routes.cart);
  await basePage.waitForPageLoad();

  let cartItems = await world.page.locator(checkoutLocator.cartItems).count();
  if (cartItems > 0) return;

  await basePage.navigate(routes.home);
  await basePage.waitForPageLoad();

  const categoryLink = world.page
    .locator(checkoutLocator.categoryMenuLink)
    .filter({ visible: true })
    .first();
  await expect(categoryLink).toBeVisible({ timeout: 15000 });
  await categoryLink.click();
  await basePage.waitForPageLoad();

  const firstProductLink = world.page
    .locator(checkoutLocator.productLink)
    .filter({ visible: true })
    .first();
  await expect(firstProductLink).toBeVisible({ timeout: 15000 });
  await firstProductLink.click();
  await basePage.waitForPageLoad();

  const addToCartLink = world.page
    .locator(checkoutLocator.productAddToCartLink)
    .filter({ visible: true })
    .first();
  await expect(addToCartLink).toBeVisible({ timeout: 15000 });
  await addToCartLink.click();
  await basePage.waitForPageLoad();

  await basePage.navigate(routes.cart);
  await basePage.waitForPageLoad();
  cartItems = await world.page.locator(checkoutLocator.cartItems).count();
  expect(cartItems).toBeGreaterThan(0);
}
