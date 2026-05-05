# How to Implement Web/Browser Tests from Scratch

This guide shows how to create a complete web test in this project: Feature, Steps, and URL configuration.

## 1. Understand the project structure

For web/browser tests, this boilerplate uses:

- Features by locale in `features/web/<locale>/`
- Steps by locale in `steps/web/<locale>/`
- Page Objects in `pages/`
- Centralized locators in `locators/`

## 2. Configure the application base URL

The main URL is defined using an environment variable.

1. Create/update `.env`:

```properties
BASE_URL=https://your-site.com/
```

2. Playwright already consumes `BASE_URL` in `config/playwright.config.ts`.

3. In steps/pages, prefer relative routes whenever possible.

Example:

```ts
await page.goto('/my-route');
```

This avoids repeating domains and simplifies environment switching.

## 3. Create the Feature (BDD)

Create `features/web/eng/my-journey.feature`:

```gherkin
# language: en
@web
@smoke
@my_journey
Feature: My web journey

  Scenario: Open home page and validate main element
    Given I open the home page
    Then I should see the main page title
```

Best practices:

- Behavior-oriented scenarios (not implementation-oriented)
- Use tags for selective execution
- Keep domain language clear

## 4. Create locators and page object

### 4.1 Locator

Create `locators/my-journey.locator.ts`:

```ts
export const myJourneyLocator = {
  mainTitle: 'h1',
};
```

### 4.2 Page Object

Create `pages/my-journey.page.ts`:

```ts
import { expect, type Page } from '@playwright/test';
import { myJourneyLocator } from '../locators/my-journey.locator';

export class MyJourneyPage {
  constructor(private readonly page: Page) {}

  async openHomePage() {
    await this.page.goto('/');
  }

  async validateMainTitle() {
    await expect(
      this.page.locator(myJourneyLocator.mainTitle).first()
    ).toBeVisible();
  }
}
```

## 5. Create the Steps

Create `steps/web/eng/my-journey.step.ts`:

```ts
import { Given, Then } from '@cucumber/cucumber';
import { MyJourneyPage } from '../../../pages/my-journey.page';
import type { CustomWorld } from '../../../support/world';

Given('I open the home page', async function (this: CustomWorld) {
  const pageObject = new MyJourneyPage(this.page);
  await pageObject.openHomePage();
});

Then('I should see the main page title', async function (this: CustomWorld) {
  const pageObject = new MyJourneyPage(this.page);
  await pageObject.validateMainTitle();
});
```

Best practices:

- Keep step logic minimal (delegate to page object)
- Keep locators outside step files (dedicated locator files)
- Keep assertions in page objects for consistency

## 6. Run the tests

Run Cucumber suite (web + api):

```bash
yarn test:cucumber:no-workers:headed:video
```

Run only your scenario by tag:

```bash
yarn test:cucumber:no-workers:headed:video --tags "@my_journey"
```

Run in headless mode:

```bash
yarn test:cucumber:no-workers:headless:video --tags "@my_journey"
```

## 7. Quick checklist

- Feature created in `features/web/<locale>/`
- Step file created in `steps/web/<locale>/`
- Base URL configured in `.env` (`BASE_URL`)
- Locators centralized in `locators/`
- Page object created in `pages/`
- Tags added for selective execution
