# About TesterBud

TesterBud is the target application used by this boilerplate to demonstrate production-like E2E automation patterns with Playwright and Cucumber.

## Why This Project Uses TesterBud

- Public practice environment with stable and repeatable login scenarios
- Good fit for both imperative tests (`@playwright/test`) and BDD scenarios (`@cucumber/cucumber`)
- Real UI interactions (inputs, buttons, validation messages) without local app setup

## Implemented Coverage in This Boilerplate

The project currently automates the Practice Login Form flow at:

- `https://testerbud.com/practice-login-form`

Implemented scenarios:

- Successful login path using credential data loaded from environment variables
- Invalid credential path validating error visibility
- Same business flow covered in both runners
- Playwright tests in `tests/e2e/login.spec.ts`
- BDD scenarios in `features/login.feature` with steps in `steps/login.step.ts`

## How TesterBud Is Wired in This Repo

- Base URL and credentials are read from `.env`
- Shared user data is centralized in `data/users.ts`
- Page interactions are encapsulated in `pages/login.page.ts`
- BDD hooks create and dispose browser context per scenario (`support/hooks.ts`)
- Playwright config runs Chromium and Firefox against the same target URL (`config/playwright.config.ts`)

## Recommended Environment Setup

Use these variables in `.env`:

```properties
BASE_URL=https://testerbud.com/practice-login-form
USERNAME=user@premiumbank.com
PASSWORD=Bank@123
PORT=3000
```

## Running Against TesterBud

- `yarn test:go` for Playwright runner
- `yarn cucumber` for Cucumber BDD runner
- `yarn allure:report` for end-to-end BDD + Allure workflow

## Useful TesterBud Practice Extensions

After validating login, you can expand automation using other TesterBud practice modules such as:

- Dynamic elements
- Table and list assertions
- Dropdown interactions
- Alerts and modal dialogs
- File upload workflows

## Practical Tips

- Keep selectors inside page objects to reduce test maintenance
- Keep credentials and base URL in `.env`, never hardcode them
- Use the same scenario in both runners when validating framework parity
- Check generated artifacts (`reports`, `cucumber-reports`, `allure-results`) after each run