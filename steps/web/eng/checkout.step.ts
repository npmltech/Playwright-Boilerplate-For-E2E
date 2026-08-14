import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from '../../../support/world';
import { checkoutLocator } from '../../../ui/locators/checkout.locator';
import { BasePage } from '../../../pages/base.page';
import { HooksHelper } from '../../../support/helpers/hooks-helpers';
import {
  ensureProductInCart,
  openCheckoutFromCart,
  proceedToConfirmPage,
} from '../shared/checkout.helpers';

setDefaultTimeout(HooksHelper.cucumberTimeoutMs);

Given('that I have products in the cart', async function (this: CustomWorld) {
  await ensureProductInCart(this);

  const cartItems = await this.page.locator(checkoutLocator.cartItems).count();
  expect(cartItems).toBeGreaterThan(0);
});

When('I access the checkout page', async function (this: CustomWorld) {
  await openCheckoutFromCart(this);
});

Then('I should see the product summary', async function (this: CustomWorld) {
  const summary = await this.page.locator(checkoutLocator.orderSummary).first();
  await expect(summary).toBeVisible();
});

Given('that I am on the checkout page', async function (this: CustomWorld) {
  await ensureProductInCart(this);
  await openCheckoutFromCart(this);
});

When('I fill the delivery address', async function (this: CustomWorld) {
  const basePage = new BasePage(this.page, this);
  const addressField = this.page
    .locator(checkoutLocator.addressInput)
    .filter({ visible: true })
    .first();

  if (await addressField.count()) {
    await addressField.fill('123 Test Street', { timeout: HooksHelper.cucumberTimeoutMs });
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
    await continueButton.click({ timeout: HooksHelper.cucumberTimeoutMs });
    await basePage.waitForPageLoad();
  }
});

Then(
  'the address should be validated successfully',
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
      timeout: HooksHelper.cucumberTimeoutMs,
    });
  }
);

Given('that I am on the confirmation page', async function (this: CustomWorld) {
  await ensureProductInCart(this);
  await openCheckoutFromCart(this);
  await proceedToConfirmPage(this);
});

When('I confirm the order', async function (this: CustomWorld) {
  const basePage = new BasePage(this.page, this);
  const confirmButton = this.page
    .locator(checkoutLocator.confirmButton)
    .filter({ visible: true })
    .first();
  await expect(confirmButton).toBeVisible({
    timeout: HooksHelper.cucumberTimeoutMs,
  });
  await confirmButton.click();
  await basePage.waitForPageLoad();
});

Then('I should receive order confirmation', async function (this: CustomWorld) {
  const confirmation = await this.page
    .locator(checkoutLocator.orderConfirmation)
    .first();
  await expect(confirmation).toBeVisible({ timeout: HooksHelper.cucumberTimeoutMs });
});
