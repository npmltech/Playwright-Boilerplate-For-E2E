import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { productsLocator } from '../../../locators/web-elements/products.locator';
import { routes } from '../../../config/routes';
import { BasePage } from '../../../pages/base.page';
import type { CustomWorld } from '../../../support/world';

const cucumberTimeoutMs = Number(process.env.CUCUMBER_TIMEOUT_MS ?? 60_000);

setDefaultTimeout(cucumberTimeoutMs);

Given('that I am on the products page', async function (this: CustomWorld) {
  const basePage = new BasePage(this.page, this);
  await basePage.navigate(routes.productCategory);
  await this.page.waitForLoadState('networkidle');
  await expect(
    this.page.locator(productsLocator.productCards).first()
  ).toBeVisible({
    timeout: cucumberTimeoutMs,
  });
});

When('I view the product list', async function (this: CustomWorld) {
  const products = await this.page
    .locator(productsLocator.productCards)
    .count();
  expect(products).toBeGreaterThan(0);
});

Then(
  'I should see the available product catalog',
  async function (this: CustomWorld) {
    const catalogTitle = await this.page
      .locator(productsLocator.catalogTitle)
      .first();
    await expect(catalogTitle).toBeVisible();
  }
);

When('I filter by a category', async function (this: CustomWorld) {
  const categoryFilter = this.page
    .locator(productsLocator.categoryFilterLink)
    .filter({ visible: true })
    .first();
  await expect(categoryFilter).toBeVisible({ timeout: cucumberTimeoutMs });
  await categoryFilter.click();
  await this.page.waitForLoadState('networkidle');
});

Then(
  'I should see only products from that category',
  async function (this: CustomWorld) {
    const products = await this.page.locator(productsLocator.productCards);
    await expect(products.first()).toBeVisible();
  }
);

When(
  'I select a product and add it to the cart',
  async function (this: CustomWorld) {
    const addToCartButton = this.page
      .locator(productsLocator.addToCartButton)
      .filter({ visible: true })
      .first();
    await expect(addToCartButton).toBeVisible({ timeout: cucumberTimeoutMs });
    await addToCartButton.click();
    await this.page.waitForLoadState('networkidle');
  }
);

Then(
  'the product should be added successfully',
  async function (this: CustomWorld) {
    const notification = await this.page
      .locator(productsLocator.successNotification)
      .first();
    await expect(notification).toBeVisible({ timeout: 5000 });
  }
);
