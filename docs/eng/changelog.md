# Changelog

All notable changes to this project are documented in this file.

## 2026-05-05 (part 4)

### Added

- Added AJV-based SWAPI schema validation scenarios in both API feature locales:
  - `features/api/eng/api-swapi.feature`
  - `features/api/pt-br/api-swapi.feature`
- Added explicit Yarn 4 peer dependency `@cucumber/messages` to satisfy formatter/reporting requirements

### Changed

- SWAPI API steps now validate the full films array against a JSON Schema using AJV in:
  - `steps/api/eng/api-swapi.step.ts`
  - `steps/api/pt-br/api-swapi.step.ts`
- Package manifest aligned for the current toolchain:
  - all runtime packages used only in test execution were moved to `devDependencies`
  - dependencies and scripts were reordered alphabetically for consistency

### Documentation

- Updated `README.md` to reflect Yarn 4 + Corepack setup, current tag-filter commands, and the AJV schema scenario
- Expanded `README.md` installation instructions with the correct Yarn setup flow for Windows, Linux, and macOS, including `yarn set version`
- Updated `API_SWAPI_TESTS.md` to document JSON Schema validation and the explicit `@cucumber/messages` peer dependency
- Updated `troubleshooting.md` with Yarn peer dependency guidance and AJV schema validation notes

## 2026-05-05

### Added

- Added parallel feature execution engine (`scripts/run-cucumber-features-parallel.mjs`) coordinating:
  - `scripts/parallel_exec/feature-runner.mjs`
  - `scripts/parallel_exec/file-discovery.mjs`
  - `scripts/parallel_exec/import-args-builder.mjs`
  - `scripts/parallel_exec/parallel-feature-executor.mjs`
  - `scripts/parallel_exec/report-directory-manager.mjs`
- Added multilingual feature file support under `features/eng/` and `features/pt-br/`:
  - `login.feature`, `register.feature`, `products.feature`, `checkout.feature`
  - **NEW:** `api-swapi.feature` — Star Wars API integration tests (bilingual)
- Added new locator files under `locators/`:
  - `login.locator.ts`, `register.locator.ts`, `products.locator.ts`, `checkout.locator.ts`
  - **NEW:** `api-swapi.locator.ts` — SWAPI endpoints and film properties
- Added new step definition files:
  - `steps/checkout.step.ts`, `steps/products.step.ts`
  - **NEW:** `steps/api-swapi.step.ts` — Bilingual API steps with native Fetch implementation
- Added `config/routes.ts` to centralise application route constants.
- Added Portuguese changelog (`CHANGELOG.pt-br.md`) for multilingual documentation.
- Added video recording support for Cucumber runs via environment variables.
- Added configurable video mode for Playwright runs via `PW_VIDEO_MODE` environment variable.
- **NEW:** Added comprehensive API testing documentation (`API_SWAPI_TESTS.md`)

### Changed

- **Simplified npm scripts** — consolidated test commands into 8 core test scripts:
  - `test:pw:headed:video` — Playwright tests, headed, with video
  - `test:pw:headless:video` — Playwright tests, headless, with video
  - `test:cucumber:no-workers:headed:video` — Cucumber serial, headed, with video
  - `test:cucumber:no-workers:headless:video` — Cucumber serial, headless, with video
  - `test:cucumber:workers:headed:video` — Cucumber parallel (default 4 workers), headed, with video
  - `test:cucumber:workers:headless:video` — Cucumber parallel, headless, with video
  - All Cucumber variants include verbose output (steps always printed to stdout)
  - Video recording is always enabled on new test commands; configurable via `PW_VIDEO_MODE` and `CUCUMBER_VIDEO`
- Unified Allure reporting:
  - `allure:server:report` — new primary command to generate and serve report together
  - `allure:serve` — still available for standalone server-only mode
- **Removed legacy scripts** to reduce confusion:
  - Removed: `test:go`, `test:headed`, `cucumber`, `cucumber:headed`, `cucumber:verbose`, `cucumber:quiet`, `cucumber:login`, `cucumber:register`, `cucumber:parallel:scenarios`, `cucumber:parallel:features`, `allure:report`, `allure:report:headless`, `allure:report:headed`
  - Removed: old test filtering via `--tags` in script names; use command-line arguments instead
- Feature locale support via `FEATURE_LOCALE` environment variable (default: `pt-br`)
- Cucumber worker count controlled via `CUCUMBER_PARALLEL` (for serial runs) and `CUCUMBER_FEATURE_WORKERS` (for feature-parallel runs)
- Enhanced hooks to capture video on Cucumber runs when enabled
- Playwright config now respects `PW_VIDEO_MODE` for dynamic video configuration
- Updated Cucumber config to load `api-swapi.step.ts`
- Updated `scripts/cucumber-runner.sh` to import API step definitions

### Improved

- Updated support/hooks.ts to support optional video recording via environment variable
- Updated config/playwright.config.ts to support environment-driven video mode
- Updated README.md with:
  - New simplified test commands
  - Project structure including multilingual features, locators, and parallel execution modules
  - API Testing section with SWAPI examples
  - Updated Tagging Strategy examples with @api and @swapi tags
- Updated README.md to document `FEATURE_LOCALE`, `CUCUMBER_PARALLEL`, and `PW_VIDEO_MODE` environment variables

### Documentation

- Created [api-swapi-tests.md](./api-swapi-tests.md) with comprehensive API testing guide
- Updated README.md Running Tests section with clear examples for all 8 test scenarios
- Updated README.md Reporting section to document `allure:server:report` as primary workflow
- Updated README.md Project Structure to include multilingual features, locators, parallel execution modules, and API tests
- Updated README.md Table of Contents to include API Testing section
- Updated CHANGELOG.md to reflect script consolidation, video recording improvements, and API testing additions

---

## 2026-05-05 (part 2)

### Added

- Added `test:api`, `test:api:pt-br`, and `test:api:eng` shortcut scripts for running API tests without browser
- Added locale-based step loading: steps are now split into `steps/eng/` and `steps/pt-br/` folders
  - `steps/pt-br/login.step.ts`, `register.step.ts`, `products.step.ts`, `checkout.step.ts`, `api-swapi.step.ts`
  - `steps/eng/login.step.ts`, `register.step.ts`, `products.step.ts`, `checkout.step.ts`, `api-swapi.step.ts`
- Removed mixed-language top-level step files (`steps/*.step.ts`)

### Fixed

- API scenarios (tagged `@api`) no longer launch a browser instance — `support/hooks.ts` now skips browser bootstrap for API-only scenarios
- Fixed `page.waitForFunction` timeout on API scenarios — screenshot/readiness checks only run when a page exists and has navigated away from `about:blank`
- Fixed SWAPI response shape: `swapi.info/api/films` returns a top-level array, not `{ results: [] }` — updated `SwapiFilm[]` interface and all response validators

### Changed

- `config/cucumber.config.cjs` now loads `./steps/${FEATURE_LOCALE}/**/*.step.ts` dynamically based on locale
- `scripts/cucumber-runner.sh` now imports steps from `steps/${FEATURE_LOCALE}/**/*.step.ts`
- `support/world.ts` `getColorizedLog()` extended to accept all ANSI colours (`blue`, `green`, `red`, `yellow`) in addition to `cyan` and `gray`

### Documentation

- Updated `troubleshooting.md` with entries for: locale-based step loading, API browser skip fix, SWAPI array fix, and updated useful commands
- Updated `API_SWAPI_TESTS.md` with corrected response shape (array) and locale-specific step file references
- Updated `README.md` project structure to reflect `steps/eng/` and `steps/pt-br/` folders

---

## 2026-05-05 (part 3)

### Added

- All feature files now declare Gherkin language via header comment:
  - `# language: en` on all files under `features/**/eng/`
  - `# language: pt` on all files under `features/**/pt-br/`

### Changed

- Features and steps reorganised from flat locale folders into type-based hierarchy:
  - `features/api/<locale>/` for API-only feature files
  - `features/web/<locale>/` for browser-driven feature files
  - `steps/api/<locale>/` for API-only step definitions
  - `steps/web/<locale>/` for browser-driven step definitions
- Cucumber config and runner globs updated from `steps/${FEATURE_LOCALE}/**` to `steps/**/${FEATURE_LOCALE}/**` to traverse the type folder
- `test:api`, `test:api:pt-br`, `test:api:eng` scripts now pass `CUCUMBER_VIDEO=0` — no video artefacts for API runs
- SWAPI "Validate film data structure" scenario converted to `Scenario Outline` with `Examples` table (5 property rows), replacing 5 individual `Then` steps with a single parameterised step `the first film should have property {string}`

### Documentation

- Updated `README.md`: project structure tree and API Testing section reflect new `api/` + `web/` hierarchy
- Updated `API_SWAPI_TESTS.md`: corrected file paths and documented Scenario Outline approach
- Updated `troubleshooting.md` §0: expanded to cover type-based folder structure and updated globs

---

## 2026-04-02

### Added

- Added a headless-safe Allure report command:
  - `yarn allure:report:headless`

### Documentation

- Updated README.md reporting section to document the Linux/headless Allure flow.
- Expanded troubleshooting.md with the Wayland display failure symptom and when to use `allure:report:headless` instead of browser-opening commands.

### Fixed

- Hardened Allure report opening on Linux by documenting and preserving the X11-forced report scripts for environments where Wayland browser startup fails.

## 2026-04-01

### Changed

- Updated dependencies to latest versions:
  - `@playwright/test`: `^1.58.2` → `^1.59.0`
  - `@types/node`: `^25.3.0` → `^25.5.0`
  - `allure-commandline`: `^2.37.0` → `^2.38.1`
  - `eslint`: `^10.0.3` → `^10.1.0`
  - `typescript`: `^5.9.3` → `^6.0.2` _(major version bump)_
  - `typescript-eslint`: `^8.57.0` → `^8.58.0`

### Documentation

- Reviewed all documentation for accuracy against current project state.
- Updated README.md project structure to include `register.feature`, `register.step.ts`, and all `config/` files (`kill-port.js`, `patch-playwright-websocket.js`, `cucumber.config.js.deprecated`, `environments/`).
- Updated README.md to document `support/helpers/hooks-helpers.ts` and `support/utils/color-utils.ts`.
- Updated README.md Cucumber scripts section to include `cucumber:headed`, `cucumber:login`, and `cucumber:register`.
- Updated README.md Allure reporting section to include `allure:report:headed`.
- Updated README.md Tagging Strategy section to cover `register.feature` tags and label examples.
- Fixed duplicate `### Added`, `### Changed`, and `### Fixed` sections in the 2026-03-31 CHANGELOG entry.

## 2026-03-31

### Added

- Added Cucumber and Allure labels/tags in login feature scenarios:
  - Cucumber tags: @login, @authentication, @smoke, @regression
  - Allure labels via tags: severity, suite, feature
- Added per-step screenshot attachments in Cucumber hooks.
- Added artifact utility scripts:
  - scripts/exclude-some-artifacts.sh
  - scripts/clean-artifacts.sh
- Added project troubleshooting guide:
  - troubleshooting.md
- Added Automation Test Store target documentation:
  - about_automationteststore.md
- Added dedicated registration feature file:
  - features/register.feature
- Added new Cucumber step definitions for registration and password recovery scenarios:
  - steps/register.step.ts
- Added convenience scripts to run tagged Cucumber subsets:
  - cucumber:login
  - cucumber:register

### Changed

- Migrated test target to Automation Test Store.
- Updated BASE_URL to:
  - https://automationteststore.com/index.php?rt=account/login
- Updated credentials in environment and user data defaults:
  - USERNAME=tester_champion
  - PASSWORD=123123
- Remapped login locators and navigation to Automation Test Store login form:
  - #loginFrm_loginname
  - #loginFrm_password
  - #loginFrm button[title="Login"]
- Updated success and negative assertions in both Cucumber steps and Playwright spec.
- Restored Firefox execution in Playwright projects.
- Improved screenshot timing to wait for fully rendered page elements.
- Updated README to reflect current target, scripts, reporting flow, and workflow notes.
- Moved non-login authentication scenarios out of login.feature into register.feature.
- Updated Cucumber loading to include register steps in both active and deprecated configs.
- Updated cucumber runner imports to load register step definitions.
- Enhanced script argument handling in cucumber runner to pass through filters like --tags.

### Fixed

- Fixed Allure attachment runtime warning by using Cucumber native attachment API:
  - this.attach(buffer, 'image/png')
- Fixed strict-mode locator conflicts for logout link assertions.
- Fixed shell portability issue in artifact exclusion script (POSIX sh compatibility).
- Reduced Wayland/X11 warning noise in Allure open flow.
- Fixed invalid Gherkin tag formatting in register.feature by removing whitespace from tag values.

### Documentation

- Replaced old target guidance with current Automation Test Store documentation.
- Centralized observed issues and solutions in troubleshooting.md.
