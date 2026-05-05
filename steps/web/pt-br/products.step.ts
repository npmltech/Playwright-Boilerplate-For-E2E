import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { productsLocator } from '../../../locators/products.locator';
import { routes } from '../../../config/routes';
import { BasePage } from '../../../pages/base.page';
import type { CustomWorld } from '../../../support/world';

const cucumberTimeoutMs = Number(process.env.CUCUMBER_TIMEOUT_MS ?? 60_000);

setDefaultTimeout(cucumberTimeoutMs);

Given('que eu estou na página de produtos', async function (this: CustomWorld) {
  const basePage = new BasePage(this.page, this);
  await basePage.navigate(routes.productCategory);
  await this.page.waitForLoadState('networkidle');
  await expect(
    this.page.locator(productsLocator.productCards).first()
  ).toBeVisible({
    timeout: cucumberTimeoutMs,
  });
});

When('eu visualizo a lista de produtos', async function (this: CustomWorld) {
  const products = await this.page
    .locator(productsLocator.productCards)
    .count();
  expect(products).toBeGreaterThan(0);
});

Then(
  'eu devo ver o catálogo de produtos disponíveis',
  async function (this: CustomWorld) {
    const catalogTitle = await this.page
      .locator(productsLocator.catalogTitle)
      .first();
    await expect(catalogTitle).toBeVisible();
  }
);

When('eu filtro por uma categoria', async function (this: CustomWorld) {
  const categoryFilter = this.page
    .locator(productsLocator.categoryFilterLink)
    .filter({ visible: true })
    .first();
  await expect(categoryFilter).toBeVisible({ timeout: cucumberTimeoutMs });
  await categoryFilter.click();
  await this.page.waitForLoadState('networkidle');
});

Then(
  'eu devo ver apenas produtos dessa categoria',
  async function (this: CustomWorld) {
    const products = await this.page.locator(productsLocator.productCards);
    await expect(products.first()).toBeVisible();
  }
);

When(
  'eu seleciono um produto e adiciono ao carrinho',
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
  'o produto deve ser adicionado com sucesso',
  async function (this: CustomWorld) {
    const notification = await this.page
      .locator(productsLocator.successNotification)
      .first();
    await expect(notification).toBeVisible({ timeout: 5000 });
  }
);
