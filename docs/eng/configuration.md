# Configuration (Practical)

This file complements [installation.md](./installation.md) and focuses on what to configure, why it matters, and how to validate each setting.

## 1) Environment Variables (`.env`)

Recommended baseline:

```properties
BASE_URL=https://automationteststore.com/
TEST_USERNAME=tester_champion
TEST_PASSWORD=123123
FEATURE_LOCALE=pt-br
```

Meaning:

- `BASE_URL`: application base URL for Playwright navigation/hook helpers
- `TEST_USERNAME` / `TEST_PASSWORD`: credentials used by login scenarios
- `FEATURE_LOCALE`: locale for feature/step loading (`pt-br` or `eng`)

## 2) Playwright configuration (`config/playwright.config.ts`)

Current behavior:

- Loads `BASE_URL` from `.env`
- Runs two projects: Chromium and Firefox
- Chromium launch args:
  - `--disable-blink-features=AutomationControlled`
  - `--ozone-platform=x11`
- Keeps Firefox without forced X11 override (native Wayland support)
- Artifacts:
  - `screenshot: only-on-failure`
  - `trace: on-first-retry`
  - `video`: controlled by `PW_VIDEO_MODE`

Validation command:

```bash
yarn test:pw:headed:video
```

## 3) Cucumber configuration (`config/cucumber.config.cjs`)

Current behavior:

- Imports:
  - `support/world.ts`
  - `support/hooks.ts`
  - locale-aware step files
- Step discovery:
  - `steps/**/${FEATURE_LOCALE}/**/*.step.ts`
- Feature discovery:
  - `features/**/${FEATURE_LOCALE}/**/*.feature`
- Output:
  - Pretty formatter
  - JSON report
  - Allure output

Validation command:

```bash
yarn test:cucumber:no-workers:headless:video
```

## 4) Script-level behavior that impacts configuration

- `test:all:video:prompt` runs Playwright first, then Cucumber
- `allure:open` and `allure:serve` use a browser wrapper script for maximized report opening
- Linux Wayland warning noise is filtered in Allure scripts

## 5) Recommended configuration workflow

1. Set `.env`
2. Run `yarn test:api`
3. Run `yarn test:pw:headed:video`
4. Run `yarn test:all:video:prompt`
5. Open report with `yarn allure:server:report`

## 6) Common mistakes and prevention

- Wrong `BASE_URL` route:
  - Keep base at site root (`https://automationteststore.com/`), not login route
- Locale mismatch:
  - If using English features, set `FEATURE_LOCALE=eng`
- zsh prompt interruption:
  - `unsetopt correct correctall`
