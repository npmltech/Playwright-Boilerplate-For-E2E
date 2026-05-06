# How to Implement API Tests from Scratch

This guide shows how to create a complete API test in this project: Feature, Steps, and URL configuration.

## 1. Understand the project structure

For API tests, this boilerplate uses:

- Features by locale in `features/api/<locale>/`
- Steps by locale in `steps/api/<locale>/`
- Centralized endpoints in `locators/endpoints/`

Locale examples:

- `pt-br` (default)
- `eng`

## 2. Configure the API URL

Choose where your API base URL is defined.

Recommended approach in this project:

1. Create/update a variable in `.env`:

```properties
API_BASE_URL=https://your-api.com
```

2. Centralize endpoint definitions in an API locator (or create a new one):

```ts
// locators/endpoints/my-api.locator.ts
export const myApiLocator = {
  baseUrl: process.env.API_BASE_URL ?? 'https://your-api.com',
  endpoints: {
    health: '/health',
  },
};
```

This avoids repeated hardcoded URLs in steps.

## 3. Create the Feature (BDD)

Create `features/api/eng/my-api.feature`:

```gherkin
# language: en
@api
@smoke
@my_api
Feature: My API

  Scenario: Get API health successfully
    Given I prepare the request for the health endpoint
    When I send the GET request
    Then the response status should be 200
```

Best practices:

- Use tags for filtering (`@api`, `@smoke`, `@my_api`)
- Keep scenarios small and objective
- Name scenarios by expected behavior

## 4. Create the Steps

Create `steps/api/eng/my-api.step.ts`:

```ts
import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { myApiLocator } from '../../../locators/endpoints/my-api.locator';

let response: Response | undefined;
let url = '';

Given('I prepare the request for the health endpoint', function () {
  url = `${myApiLocator.baseUrl}${myApiLocator.endpoints.health}`;
});

When('I send the GET request', async function () {
  response = await fetch(url, { method: 'GET' });
});

Then('the response status should be {int}', function (expectedStatus: number) {
  assert.ok(response, 'Response was not received');
  assert.equal(response.status, expectedStatus);
});
```

Best practices:

- Always validate that a response exists before using `response.status`
- Centralize URL and endpoints in locator/config files
- Avoid business logic inside Feature files

## 5. Run the tests

Run API tests only:

```bash
yarn test:api
```

Run API tests in English locale:

```bash
yarn test:api:eng
```

Run API tests in Portuguese locale with workers:

```bash
yarn test:cucumber:workers:headless:video:pt-br --tags "@my_api"
```

Run API tests in English locale with workers:

```bash
yarn test:cucumber:workers:headless:video:eng --tags "@my_api"
```

Filter by a specific tag:

```bash
yarn test:cucumber:no-workers:headless:video --tags "@my_api"
```

## 6. Expand to payload validation

After status code validation, add:

- Required field validation
- Type validation
- JSON Schema validation using AJV

Recommended pattern:

1. Parse `await response.json()`
2. Validate basic shape
3. Validate contract with AJV to prevent silent regressions

## 7. Quick checklist

- Feature created in `features/api/<locale>/`
- Steps created in `steps/api/<locale>/`
- Base URL defined in `.env`
- Endpoint centralized in `locators/endpoints/`
- Tags added for filtering
- Execution validated with API command
