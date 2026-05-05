import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from '../../../support/world';
import { checkoutLocator } from '../../../locators/checkout.locator';
import { users } from '../../../data/users';
import { LoginPage } from '../../../pages/login.page';
import { routes } from '../../../config/routes';
import { BasePage } from '@pages/base.page';

const cucumberTimeoutMs = Number(process.env.CUCUMBER_TIMEOUT_MS ?? 60_000);

setDefaultTimeout(cucumberTimeoutMs);

async function waitForPageReady(world: CustomWorld) {
  await world.page.waitForLoadState('domcontentloaded');
}

async function ensureLoggedIn(world: CustomWorld) {
  const logoutLink = world.page
    .locator('a[href*="rt=account/logout"]')
    .filter({ visible: true })
    .first();
  if (await logoutLink.count()) {
    return;
  }

  const loginPage = new LoginPage(world.page, world);
  await loginPage.login(users.standard.username, users.standard.password);
  await loginPage.waitForElementVisible();
}

async function openCheckoutFromCart(world: CustomWorld) {
  const basePage = new BasePage(world.page, world);
  await basePage.navigate(routes.cart);
  await waitForPageReady(world);

  const checkoutButton = world.page
    .locator(checkoutLocator.checkoutButton)
    .filter({ visible: true })
    .first();
  await expect(checkoutButton).toBeVisible({ timeout: 15000 });
  await checkoutButton.click();
  await waitForPageReady(world);

  if (world.page.url().includes('rt=account/login')) {
    await ensureLoggedIn(world);
    await basePage.navigate(routes.cart);
    await waitForPageReady(world);

    const retryCheckoutButton = world.page
      .locator(checkoutLocator.checkoutButton)
      .filter({ visible: true })
      .first();
    await expect(retryCheckoutButton).toBeVisible({ timeout: 15000 });
    await retryCheckoutButton.click();
    await waitForPageReady(world);
  }
}

async function proceedToConfirmPage(world: CustomWorld) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const confirmButton = world.page
      .locator(checkoutLocator.confirmButton)
      .filter({ visible: true })
      .first();
    if (await confirmButton.count()) {
      return;
    }

    const continueButton = world.page
      .locator(checkoutLocator.checkoutContinueButton)
      .filter({ visible: true })
      .first();
    if (!(await continueButton.count())) {
      break;
    }

    await continueButton.click();
    await waitForPageReady(world);
  }
}

async function ensureProductInCart(world: CustomWorld) {
  const basePage = new BasePage(world.page, world);
  await ensureLoggedIn(world);

  await basePage.navigate(routes.cart);
  await waitForPageReady(world);

  let cartItems = await world.page.locator(checkoutLocator.cartItems).count();
  if (cartItems > 0) {
    return;
  }

  await basePage.navigate(routes.home);
  await waitForPageReady(world);

  const categoryLink = world.page
    .locator(checkoutLocator.categoryMenuLink)
    .filter({ visible: true })
    .first();
  await expect(categoryLink).toBeVisible({ timeout: 15000 });
  await categoryLink.click();
  await waitForPageReady(world);

  const firstProductLink = world.page
    .locator(checkoutLocator.productLink)
    .filter({ visible: true })
    .first();
  await expect(firstProductLink).toBeVisible({ timeout: 15000 });
  await firstProductLink.click();
  await waitForPageReady(world);

  const addToCartLink = world.page
    .locator(checkoutLocator.productAddToCartLink)
    .filter({ visible: true })
    .first();
  await expect(addToCartLink).toBeVisible({ timeout: 15000 });
  await addToCartLink.click();
  await waitForPageReady(world);

  await basePage.navigate(routes.cart);
  await waitForPageReady(world);
  cartItems = await world.page.locator(checkoutLocator.cartItems).count();
  expect(cartItems).toBeGreaterThan(0);
}

Given('que eu tenho produtos no carrinho', async function (this: CustomWorld) {
  await ensureProductInCart(this);

  const cartItems = await this.page.locator(checkoutLocator.cartItems).count();
  expect(cartItems).toBeGreaterThan(0);
});

When('eu acesso a página de checkout', async function (this: CustomWorld) {
  await openCheckoutFromCart(this);
});

Then('eu devo ver o resumo dos produtos', async function (this: CustomWorld) {
  const summary = await this.page.locator(checkoutLocator.orderSummary).first();
  await expect(summary).toBeVisible();
});

Given('que eu estou na página de checkout', async function (this: CustomWorld) {
  await ensureProductInCart(this);
  await openCheckoutFromCart(this);
});

When('eu preencho o endereço de entrega', async function (this: CustomWorld) {
  const addressField = this.page
    .locator(checkoutLocator.addressInput)
    .filter({ visible: true })
    .first();

  if (await addressField.count()) {
    await addressField.fill('123 Test Street', { timeout: 10000 });
    await addressField.evaluate((el) =>
      el.dispatchEvent(new Event('change', { bubbles: true }))
    );
    return;
  }

  const continueButton = this.page
    .locator(checkoutLocator.checkoutContinueButton)
    .filter({ visible: true })
    .first();
  if (await continueButton.count()) {
    await continueButton.click({ timeout: 10000 });
    await waitForPageReady(this);
  }
});

Then(
  'o endereço deve ser validado com sucesso',
  async function (this: CustomWorld) {
    const addressField = this.page
      .locator(checkoutLocator.addressInput)
      .filter({ visible: true })
      .first();

    if (await addressField.count()) {
      await expect(addressField).toHaveValue('123 Test Street');
      return;
    }

    await expect(this.page).toHaveURL(/checkout\/(payment|confirm|shipping)/, {
      timeout: cucumberTimeoutMs,
    });
  }
);

Given(
  'que eu estou na página de confirmação',
  async function (this: CustomWorld) {
    await ensureProductInCart(this);
    await openCheckoutFromCart(this);
    await proceedToConfirmPage(this);
  }
);

When('eu confirmo o pedido', async function (this: CustomWorld) {
  const confirmButton = this.page
    .locator(checkoutLocator.confirmButton)
    .filter({ visible: true })
    .first();
  await expect(confirmButton).toBeVisible({ timeout: cucumberTimeoutMs });
  await confirmButton.click();
  await waitForPageReady(this);
});

Then(
  'eu devo receber a confirmação do pedido',
  async function (this: CustomWorld) {
    const confirmation = await this.page
      .locator(checkoutLocator.orderConfirmation)
      .first();
    await expect(confirmation).toBeVisible({ timeout: 10000 });
  }
);
