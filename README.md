# Playwright BDD Boilerplate for E2E Testing

A complete TypeScript boilerplate for End-to-End (E2E) testing with Playwright Test and Cucumber BDD running side by side.

## Overview

This project is designed so teams can choose the test style they want:

- Playwright native test runner (`tests/e2e`)
- Cucumber BDD flow in Portuguese (`features` + `steps` + `support`)
- Shared Page Object and test data layers
- HTML and Allure reporting pipelines

## New Features Implemented

- Dual execution model: Playwright test runner and Cucumber BDD in the same project
- Multi-browser Playwright projects: Chromium and Firefox
- Smart web server bootstrap with `config/start-server-if-free.js` to skip duplicate startup when port is already in use
- Playwright websocket compatibility patch script at `config/patch-playwright-websocket.js`
- Port cleanup utility at `config/kill-port.js`
- Allure integration via `allure-cucumberjs` and ready-to-run report scripts
- Cucumber runner script with simultaneous terminal log output and file persistence (`scripts/cucumber-runner.sh`)
- Typed Cucumber world and lifecycle hooks for browser/context/page management
- Shared credentials/test data model through `data/users.ts`
- ESLint + Prettier setup tailored for TypeScript test repositories

## Prerequisites

- Node.js 18+
- Yarn 1.22+
- Git

## Installation

```bash
git clone <repository-url>
cd Playwright-Boilerplate-For-E2E
yarn install
yarn playwright install
```

Create `.env` in the project root:

```properties
BASE_URL=https://testerbud.com/practice-login-form
USERNAME=user@premiumbank.com
PASSWORD=Bank@123
PORT=3000
```

## Project Structure

```text
Playwright-Boilerplate-For-E2E/
├── config/
│   ├── playwright.config.ts
│   ├── cucumber.config.cjs
│   ├── start-server-if-free.js
│   ├── kill-port.js
│   └── patch-playwright-websocket.js
├── features/
├── steps/
├── support/
├── pages/
├── tests/e2e/
├── data/
├── scripts/
├── reports/
├── cucumber-reports/
└── allure-results/
```

## Scripts

- `yarn test:go`: run Playwright tests
- `yarn test:headed`: run Playwright in headed mode
- `yarn test:debug`: run Playwright debug UI
- `yarn test:report`: open Playwright HTML report (`reports`)
- `yarn cucumber`: run Cucumber scenarios via `scripts/cucumber-runner.sh`
- `yarn allure:generate`: build Allure report from `allure-results`
- `yarn allure:open`: open generated Allure report
- `yarn allure:serve`: temporary Allure server from raw results
- `yarn allure:report`: execute Cucumber + generate + open Allure report in one command
- `yarn lint`: lint all JS/TS files
- `yarn lint:fix`: auto-fix lint issues
- `yarn format`: format repository
- `yarn format:check`: verify formatting only
- `yarn format:lint`: lint fix + format sequence

## Configuration Details

### Playwright (`config/playwright.config.ts`)

- Projects: Chromium and Firefox desktop profiles
- Retry policy: `2` retries in CI, `0` locally
- Tracing: `on-first-retry`
- Video: `retain-on-failure`
- Screenshot: `only-on-failure`
- Web server strategy: starts only if target port is free

### Cucumber (`config/cucumber.config.cjs` and `scripts/cucumber-runner.sh`)

- Feature source: `features/**/*.feature`
- Step/hook/world loading with `tsx`
- Console pretty formatter output
- HTML + JSON reports under `cucumber-reports`
- Allure raw results under `allure-results`

## Writing Tests

### Playwright runner

Create tests in `tests/e2e/*.spec.ts`.

### Cucumber BDD

Create feature files in `features/*.feature` (Portuguese is already configured in existing examples) and implement steps in `steps/*.step.ts`.

### Shared Page Objects

Use `pages/base.page.ts` and domain page objects (for example `pages/login.page.ts`) to keep selectors and actions centralized.

## Reporting

- Playwright HTML report output: `reports`
- Cucumber report files: `cucumber-reports/cucumber-report.html`, `cucumber-reports/cucumber-report.json`, `cucumber-reports/cucumber.log`
- Allure raw artifacts: `allure-results`

## Utilities

- `config/start-server-if-free.js`: checks if `PORT` is available before attempting to run `yarn start`
- `config/kill-port.js`: force-kills processes bound to a port (default `9323`)
- `config/patch-playwright-websocket.js`: applies a compatibility patch to a Playwright websocket internals file when needed

## About TesterBud

See `about_testerbud.md` for project-specific guidance on using TesterBud with this automation boilerplate.
