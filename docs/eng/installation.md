# Installation + Initial Configuration

This guide is intentionally practical and merged with the essential configuration steps, so you can go from clone to first successful execution without switching docs.

For advanced details, see [configuration.md](./configuration.md).

## 1) Clone repository

```bash
git clone <repository-url>
cd Playwright-Boilerplate-For-E2E
```

## 2) Enable Corepack and set Yarn version

Use Corepack so the workspace uses the expected Yarn version.

```bash
corepack enable
corepack prepare yarn@4.14.0 --activate
yarn set version 4.14.0
```

If you prefer latest stable Yarn instead of pinning:

```bash
yarn set version stable
```

Verify:

```bash
yarn --version
```

## 3) Install project dependencies and Playwright browsers

```bash
yarn install
yarn playwright install
```

## 4) Create `.env` (base configuration)

Create or update `.env` at project root:

```properties
BASE_URL=https://automationteststore.com/
USERNAME=tester_champion
PASSWORD=123123
FEATURE_LOCALE=pt-br
```

What each variable controls:

- `BASE_URL`: base application URL used by Playwright and hooks
- `USERNAME` / `PASSWORD`: login test credentials
- `FEATURE_LOCALE`: locale used by Cucumber feature/step discovery (`pt-br` or `eng`)

## 5) Understand runtime behavior (already configured)

You do not need to change these to start, but it helps to know how the project behaves:

- Playwright config (`config/playwright.config.ts`):
  - Uses `BASE_URL` from `.env`
  - Runs Chromium and Firefox
  - Applies Chromium-only args: `--disable-blink-features=AutomationControlled`, `--ozone-platform=x11`
  - Captures screenshot/trace/video on failures/retries
- Cucumber config (`config/cucumber.config.cjs`):
  - Loads steps by locale via `steps/**/${FEATURE_LOCALE}/**/*.step.ts`
  - Loads features by locale via `features/**/${FEATURE_LOCALE}/**/*.feature`
  - Generates pretty/json/allure outputs

## 6) First execution (recommended order)

Run API checks first (faster feedback), then UI:

```bash
yarn test:api
yarn test:pw:headed:video
```

Run full flow (Playwright + Cucumber):

```bash
yarn test:all:video:prompt
```

## 7) Report generation

```bash
yarn allure:server:report
```

Useful notes:

- `allure:open` / `allure:serve` are configured to open report browser maximized
- Wayland warning noise is filtered in scripts while preserving real failures

## 8) Quick troubleshooting

- zsh autocorrect prompt (`test` -> `tests`):

  ```bash
  unsetopt correct correctall
  ```

- If login fails intermittently in Firefox, keep current page-object submit fallback (already implemented)
- If headed browser fails on Linux Wayland, keep current defaults (Chromium forced to X11 via launch args; Firefox native Wayland)
