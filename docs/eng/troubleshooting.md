# Troubleshooting Guide

This file documents the main issues observed during migration and stabilization, plus the implemented fixes.

## 0) Locale-based step loading and type-based folder structure

Symptom:

- Steps become undefined after reorganising definitions into locale or type folders

Observed cause:

- Cucumber was importing fixed paths that no longer matched the new directory structure

Current structure:

```
features/
  api/<locale>/*.feature
  web/<locale>/*.feature
steps/
  api/<locale>/*.step.ts
  web/<locale>/*.step.ts
```

Fix applied:

- Step loading follows `FEATURE_LOCALE` dynamically across both type folders:
  - `config/cucumber.config.cjs` loads `./steps/**/${FEATURE_LOCALE}/**/*.step.ts`
  - `scripts/cucumber-runner.sh` imports `steps/**/${FEATURE_LOCALE}/**/*.step.ts`
  - Feature discovery: `features/**/${FEATURE_LOCALE}/**/*.feature`

Notes:

- Use `FEATURE_LOCALE=pt-br` for Portuguese features (web + api)
- Use `FEATURE_LOCALE=eng` for English features (web + api)
- All feature files declare their language via `# language: en` or `# language: pt` on line 1

## 0.1) Yarn 4 peer dependency warning for `@cucumber/messages`

Symptom:

- `YN0002: my-playwright-project@workspace:. doesn't provide @cucumber/messages`
- `YN0086: Some peer dependencies are incorrectly met by your project`

Observed cause:

- `@cucumber/pretty-formatter` and `allure-cucumberjs` require `@cucumber/messages` as a peer dependency
- Yarn 4 reports the missing peer explicitly during install or post-resolution validation

Fix applied:

- Added `@cucumber/messages` to `devDependencies`

Verification:

- Run `yarn explain peer-requirements <hash>` to inspect the warning source
- Re-run `yarn install` and confirm the warning no longer appears for `@cucumber/messages`

## 1) Navigation timeout on login page

Symptom:

- page.goto timeout during Given step

Observed cause:

- Waiting strategy and step timeout interaction

Fix applied:

- Increased effective Cucumber step timeout via hooks
- Improved navigation/readiness flow

## 2) Global timeout not taking effect as expected

Symptom:

- Step still failing around default timeout windows

Observed cause:

- Timeout location/config did not apply the way expected in runtime

Fix applied:

- Timeout centralized in hook-level Cucumber setup used by executed steps

## 3) Allure runtime warning: no test runtime is found

Symptom:

- Message: no test runtime is found. Please check test framework configuration

Observed cause:

- Used allure-js-commons attachment API directly in Cucumber context

Fix applied:

- Switched to Cucumber native attachment API in hooks:
  - this.attach(buffer, 'image/png')
- This is correctly intercepted by allure-cucumberjs reporter

## 4) Wayland/X11 warning when opening Allure report

Symptom:

- Failed to connect to Wayland display
- The platform failed to initialize

Observed cause:

- Allure finished generating the report and then tried to open a local browser in a Linux session without a working Wayland desktop

Fix applied:

- Updated package scripts to force X11 and filter warning noise in output
- Kept headless-safe serving via:
  - `yarn allure:serve`

When to use:

- Use `yarn allure:server:report` when you want to generate and serve the report locally
- Use `yarn allure:serve` in CI, containers, remote shells, or Linux sessions without a graphical desktop
- Use `yarn allure:open` only after the report exists and a desktop browser session is available

## 5) Duplicate locator strict-mode violation

Symptom:

- expect(locator).toBeVisible strict mode violation with multiple logout links

Observed cause:

- Selector matched several DOM locations

Fix applied:

- Narrowed assertion locator to visible + first match

## 6) HTML loaded but UI not fully rendered for screenshots

Symptom:

- Screenshot captured before CSS/visible elements were ready

Observed cause:

- Screenshot timing too early in step lifecycle

Fix applied:

- Added readiness checks before screenshot capture:
  - load state complete
  - readyState complete
  - stylesheets loaded
  - at least one visible element present

## 7) API scenarios should not open browser/page

Symptom:

- API scenarios timed out in hook screenshot/readiness flow
- Error examples: `page.waitForFunction: Timeout 30000ms exceeded`

Observed cause:

- Hooks launched browser/context/page for all scenarios, including pure API tests (`@api`)

Fix applied:

- `support/hooks.ts` now detects `@api` tag in `Before` and skips browser bootstrap for API-only scenarios
- Screenshot and UI readiness checks only run when a page exists and has navigated

## 8) SWAPI response shape mismatch

Symptom:

- API step failed with: `Response does not contain a valid films array`

Observed cause:

- Steps expected `{ results: [...] }`, but `https://swapi.info/api/films` returns a top-level array

Fix applied:

- SWAPI steps now treat response as `SwapiFilm[]`
- Validations were updated from `swapiResponse.results` to `swapiResponse`

## 8.1) SWAPI JSON Schema validation with AJV

Symptom:

- API tests only asserted presence of a few fields and could miss invalid types or malformed dates

Observed cause:

- Structural checks were limited to existence assertions instead of a schema-level contract

Fix applied:

- Added an AJV-backed scenario in both locales to validate the full films response against a JSON Schema
- The schema enforces required fields, integer typing for `episode_id`, and `YYYY-MM-DD` formatting for `release_date`

Verification:

- `FEATURE_LOCALE=pt-br yarn test:api`
- `FEATURE_LOCALE=eng yarn test:api`

## 9) Script portability issue in local shell

Symptom:

- set: Illegal option -o pipefail

Observed cause:

- Script executed with sh while using bash-specific options/syntax

Fix applied:

- Converted script to POSIX sh syntax

## 10) Artifacts still visible after ignore setup

Symptom:

- Folders/files still present locally after exclude script

Observed cause:

- Ignore rules affect Git tracking, not local filesystem existence

Fix applied:

- Added cleanup script to remove generated artifacts:
  - scripts/clean-artifacts.sh

## 11) Target migration to Automation Test Store

Changes applied:

- BASE_URL updated to Automation Test Store login route
- Login locators remapped to loginFrm selectors
- Success/error assertions updated to target-site behavior
- Firefox project restored in Playwright config

Verification:

- Cucumber login feature passing
- Playwright login spec passing

## Useful commands

```bash
yarn test:cucumber:no-workers:headed:video
yarn test:cucumber:no-workers:headless:video
yarn test:cucumber:workers:headed:video
yarn test:cucumber:workers:headless:video
yarn test:api
yarn test:api:pt-br
yarn test:api:eng
yarn allure:server:report
yarn allure:serve
./scripts/exclude-some-artifacts.sh
./scripts/clean-artifacts.sh
```
