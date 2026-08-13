# Changelog

All notable changes to this project are documented in this file.

## 2026-06-27

### Added

- `steps/web/shared/checkout.helpers.ts`: new shared module centralising all checkout helper functions (`ensureLoggedIn`, `openCheckoutFromCart`, `proceedToConfirmPage`, `ensureProductInCart`) — eliminates 120+ lines of logic duplicated between the pt-br and eng checkout step files. Both locale files now import from this single source.
- `steps/web/shared/register.helpers.ts`: new shared module with `uniqueSuffix()` and `selectValidZone()` — eliminates duplication across both locale register step files.

### Changed

- **`test:all:headless:video:prompt`** and **`test:all:video:prompt`** now run **3 phases** instead of 2: `[1/3] Playwright` → `[2/3] Cucumber PT-BR` → `[3/3] Cucumber ENG`. Previously, the Cucumber phase ran only the locale in `FEATURE_LOCALE` (whichever was set in `.env`), silently skipping the other locale.
- **`test:cucumber:workers:headless:video:all`** refactored: single `test:prepare` at start, then invokes `cucumber-runner.sh` directly with `;` between locales so ENG always runs even when PT-BR fails, and PT-BR allure results are not wiped before ENG runs (previously the second locale's `:run` wrapper triggered a second `test:prepare`, deleting PT-BR output).
- **`scripts/cucumber-runner.sh`** now writes locale-specific report files (`cucumber-report-{FEATURE_LOCALE}.json`, `cucumber-report-{FEATURE_LOCALE}.html`, `cucumber-{FEATURE_LOCALE}.log`) instead of a single overwritable `cucumber-report.json` and `cucumber.log`. The `yarn report:cucumber:summary` command already expected these locale-specific names, so it now gets the full merged picture automatically.
- **`pages/login.page.ts` — `login()`**: removed `{ force: true }` from the submit click (Firefox does not trigger form submission on forced clicks); replaced silent `.catch(() => {})` on `waitUntilLoggedIn()` with explicit `waitForLoadState('domcontentloaded')` after each fallback attempt, followed by a final `waitUntilLoggedIn()` that throws a meaningful error if login never succeeded.
- **`steps/web/pt-br/login.step.ts`**, **`steps/web/eng/login.step.ts`**: removed `waitForElementVisible()` call from the forgot-password `When` step — that method asserts `accountContainer` (the post-login account widget), which does not exist on the password recovery page, making the step always time out.
- **`steps/web/pt-br/register.step.ts`**, **`steps/web/eng/register.step.ts`**:
  - Removed redundant second `selectValidZone()` call at the end of each fill step.
  - Removed `countrySelect.selectOption('30')` and `selectValidZone()` from the submit step — re-selecting the country in the submit step fired a `change` event that reset the zone dropdown, silently undoing the fill step's zone selection.
  - Removed debug `console.log` that was left in the pt-br submit step.
  - `waitForFunction` now passes `successFlags` alongside `successPattern`, reconstructing the browser-side regex as `new RegExp(successPattern, successFlags)` to preserve flags from the original `routePatterns.registerSuccess`.
  - Both files now import `uniqueSuffix` and `selectValidZone` from `steps/web/shared/register.helpers.ts`.
- **`support/hooks.ts` — `AfterStep`**: screenshot is now taken only when `status !== 'PASSED'`. Previously a screenshot was captured after every step regardless of outcome, generating N PNG attachments per green scenario and adding several seconds of overhead to long suites.
- **`support/helpers/hooks-helpers.ts` — `getStepKeyword()`**: now uses a `WeakMap` to cache the `Map<stepId, keyword>` per Gherkin document. Previously performed a nested O(children × steps) scan on every `BeforeStep` and `AfterStep` call; now O(1) per lookup after the first call per document.
- All step files (`login`, `register`, `checkout`, `products` — both locales): removed local `const cucumberTimeoutMs = Number(process.env.CUCUMBER_TIMEOUT_MS ?? 60_000)` expression that was copy-pasted in 8 files; all now import and reference `HooksHelper.cucumberTimeoutMs`.
- **`steps/web/pt-br/checkout.step.ts`**, **`steps/web/eng/checkout.step.ts`**: rewritten to import from `steps/web/shared/checkout.helpers.ts`; local `waitForPageReady()` wrapper removed in favour of `BasePage.waitForPageLoad()` used inside the shared module.
- **Dependencies updated** — 14 packages bumped (keeping `@cucumber/cucumber` at 12.7.0 pending v13 migration):

  | Package                   | Before  | After   |
  | ------------------------- | ------- | ------- |
  | `@playwright/test`        | ^1.59.0 | ^1.61.1 |
  | `allure-cucumberjs`       | 3.6.0   | 3.10.1  |
  | `allure-js-commons`       | 3.6.0   | 3.10.1  |
  | `allure-commandline`      | ^2.38.1 | ^2.43.0 |
  | `prettier-plugin-gherkin` | ^3.1.3  | ^4.0.0  |
  | `@types/node`             | ^25.5.0 | ^26.0.0 |
  | `eslint`                  | ^10.1.0 | ^10.5.0 |
  | `typescript-eslint`       | ^8.58.0 | ^8.62.0 |
  | `typescript`              | ^6.0.2  | ^6.0.3  |
  | `tsx`                     | ^4.21.0 | ^4.22.4 |
  | `prettier`                | ^3.8.1  | ^3.8.4  |
  | `globals`                 | ^17.4.0 | ^17.7.0 |
  | `jiti`                    | ^2.6.1  | ^2.7.0  |
  | `dotenv`                  | ^17.3.1 | ^17.4.2 |

  Playwright browsers reinstalled (`yarn playwright install`) after the binary path changed from `firefox-1490` to `firefox-1532`.

### Fixed

- **Forgot-password Cucumber step always timed out**: `waitForElementVisible()` asserted `accountContainer` (post-login widget) after navigating to the recovery page, where that element is never present.
- **Register zone dropdown silently reset between steps**: the submit step re-selected the country, firing a `change` event that cleared the zone selection made in the fill step.
- **`login()` swallowed real submission failures**: `.catch(() => {})` on `waitUntilLoggedIn()` discarded errors from failed redirects, allowing the code to keep retrying with a potentially double-submitted form and surfacing a generic timeout at the wrong line.
- **`waitForFunction` discarded regex flags**: `new RegExp(source)` in the browser context omitted flags from the original `RegExp` object, causing potential false negatives on URLs that only match with case-insensitive (`i`) or other flags.
- **`test:all:*` only ran one locale**: Cucumber phase ran with whatever `FEATURE_LOCALE` was active in `.env`, silently skipping the other locale's scenarios.
- **`test:cucumber:workers:headless:video:all` wiped PT-BR allure results before ENG ran**: the ENG `:run` wrapper called `test:prepare`, which deleted `allure-results/` including PT-BR output collected in the previous phase.

### Documentation

- `docs/eng/project-structure.md`, `docs/pt-br/estrutura-do-projeto.md`: added `steps/web/shared/` directory with `checkout.helpers.ts` and `register.helpers.ts`.
- `docs/eng/reporting.md`, `docs/pt-br/relatorios.md`: added "Automatic generation after Cucumber runs" section explaining that `cucumber-runner.sh` auto-generates `allure-report/` at the end of every Cucumber run; manual `yarn allure:generate` is no longer required after normal test executions.
- `docs/eng/troubleshooting.md`, `docs/pt-br/solucao-de-problemas.md`: added entries #15 (Firefox login `force: true` prevents form submission), #16 (Cucumber steps skipped due to `page.goto` timeout on slow pages), #17 (`allure-results/` empty because `&&` blocked Cucumber when Playwright failed); "Useful commands" section updated with 4 new no-workers locale shortcuts.

## 2026-06-23

### Fixed

- **Firefox login test skipping steps after form submission**: `loginExpectingError()` in `pages/login.page.ts` was using `click({ force: true })` on the submit button. Firefox does not trigger a form submission when the click is forced, leaving focus on the password field and never sending the POST. The page URL already matched `/rt=account/login/` before submission, so `toHaveURL` passed instantly and the error alert assertion timed out after 15 s. Fixed by removing `force: true` and adding `waitForLoadState('domcontentloaded')` after the click so the method waits for the server response before asserting on the alert.

- **Cucumber steps being skipped after slow page loads**: `BasePage.navigate()` was calling `page.goto(url)` with no options, which defaults to `waitUntil: 'load'`. This waits for every external resource (images, CDN scripts, analytics) before resolving. On slow connections the 30 s Playwright navigation timeout was reached before the `load` event fired, causing the `Given` step to throw, and all remaining steps in the scenario to be marked as **skipped**. Fixed by changing to `{ waitUntil: 'domcontentloaded' }`, which returns as soon as the HTML is parsed; the existing visibility assertions in each page method verify the page is usable.

- **Zone selection failing for countries other than the UK** (`register.step.ts`, PT-BR and ENG): the previous approach used an XPath targeting the Cardiff option, which only exists in the UK zone list. When the country was set to Brazil (id `30`), no matching option was found, the zone was left unselected, and form submission failed silently. Replaced with a dynamic loop over `select.options` that picks the first option with a non-empty, non-zero value using `option.selected = true` and a `change` event dispatch — works for any country.

- **`registerLocator.errorAlert` selector too narrow**: was matching only `.alert.alert-error, .alert.alert-danger`, missing alerts with only the `.alert` class. Broadened to `.alert.alert-error, .alert.alert-danger, .alert`, consistent with `loginLocator.errorAlert`.

- **`allure-results/` empty after `test:all:headless:video:prompt`**: the script chained PW and Cucumber with `&&`. When any Playwright test failed (for example the Firefox login test), the chain stopped before Cucumber ran, so `allure-results/` was never created. Changed the separator between Playwright and Cucumber to `;` in `test:all:headless:video:prompt` and `docker:test:all:video` — Cucumber now always runs regardless of Playwright exit code.

- **`cucumber-runner.sh` Allure auto-generation suppressed by wrong exit code**: the runner piped `cucumber-js` output through `tee`, and `$?` captured `tee`'s exit code (always 0), not Cucumber's. The conditional `if ls allure-results/*-result.json` check still ran, but the `exit` at the end reported success even when Cucumber failed. Fixed with `PIPESTATUS[0]` to capture Cucumber's exit code before the pipe, and `exit $CUCUMBER_EXIT` to propagate it correctly.

- **`test:api:*` video recorded despite `CUCUMBER_VIDEO=0`**: the scripts set `CUCUMBER_VIDEO=0` but then called `yarn test:cucumber:headless:video:run`, which explicitly overrides the variable back to `CUCUMBER_VIDEO=1` inside the script. The `hooks.ts` check (`CUCUMBER_VIDEO !== '0'`) was therefore always seeing `1`. Fixed by having `test:api`, `test:api:pt-br`, and `test:api:eng` call `cucumber-runner.sh` directly with `CUCUMBER_VIDEO=0` in the prefix, bypassing the override.

### Changed

- **Cleanup now runs before every test script**: `yarn test:prepare` (which runs `scripts/clean-artifacts.sh`) was previously only called in the "non-`:run`" variant scripts and could be skipped when a `:run` script was executed directly. All `:run` scripts now include `yarn test:prepare &&` at the start. The composite `test:all:*` scripts were adjusted to call the PW and Cucumber binaries directly rather than delegating to `:run` variants, so only one cleanup pass runs per full-suite execution (avoiding deletion of Playwright reports before Cucumber generates its own).

- **`package.json` scripts reorganized** into semantic groups with a consistent ordering: Code Quality → Infrastructure → Playwright → Cucumber (no-workers → workers, headless → headed, locale variants) → API → Combined suites → Allure reports → Cucumber reports → Docker.

### Added

- **No-workers locale shortcuts (headless and headed)**:
  - `test:cucumber:headless:video:pt-br` — no-workers headless, Brazilian Portuguese
  - `test:cucumber:headless:video:eng` — no-workers headless, English
  - `test:cucumber:headed:video:pt-br` — no-workers headed, Brazilian Portuguese
  - `test:cucumber:headed:video:eng` — no-workers headed, English

  These complement the existing worker-based locale variants (`test:cucumber:workers:headless:video:pt-br` / `:eng` / `:all`) and fill the gap for serial runs.

## 2026-06-19

### Changed

- Refactored web synchronization strategy to remove explicit waits and rely on state-driven assertions.
- Replaced direct explicit waits in affected flows (`login`, `register`, `products`, `checkout`, and `hooks`) with:
  - `expect(locator).toBeVisible()`
  - `expect(page).toHaveURL(...)`
  - `expect.poll(...)` for dynamic dropdown data
- Improved stability by reducing fixed time coupling (`waitForTimeout`) and generic readiness waits (`waitForLoadState`, `waitForFunction`) in critical steps.

### Added

- New command `report:cucumber:summary` to generate a merged, colorized Cucumber summary.
- Summary now includes:
  - per-status counters
  - failure highlights
  - `Test Run` timestamp in `dd.mm.yyyy hh:mm`
  - JSON artifact output (`.tmp/cucumber-report-summary.json`)

### Reporting

- Cucumber runner now writes locale-specific report files to avoid overwrite between locale runs:
  - `cucumber-report-pt-br.json` / `cucumber-report-pt-br.html`
  - `cucumber-report-eng.json` / `cucumber-report-eng.html`
- Summary command merges all `cucumber-report-*.json` files by default.
- Legacy fallback retained: when locale files are not found, command reads `cucumber-report.json` and warns that totals may represent a single locale.

### Documentation

- Updated README, commands, running-tests, reporting, troubleshooting, project-structure, and changelog docs in both English and Portuguese.

## 2026-05-10

### Added

- Docker command shortcuts in `package.json`:
  - `docker:build` — build container images
  - `docker:clean` — remove generated Docker artifacts safely through a temporary cleanup container
  - `docker:up` — start all containers
  - `docker:down` — stop and remove containers
  - `docker:logs` — view live container logs
  - `docker:compose` — generic docker-compose command wrapper
  - `docker:test:pw:video` — run Playwright tests in Docker with video evidence
  - `docker:test:cucumber:video:pt-br` — run Cucumber tests in Docker with video evidence for Brazilian Portuguese
  - `docker:test:cucumber:video:eng` — run Cucumber tests in Docker with video evidence for English
  - `docker:test:api:video` — run API tests in Docker
  - `docker:test:all:video` — run full Docker suite (Playwright + Cucumber for `pt-br` and `eng`) with video evidence

### Changed

- **Reorganized Docker assets** into a dedicated `container/` folder:
  - Moved `Dockerfile` to `container/Dockerfile`
  - Moved `docker-compose.yml` to `container/docker-compose.yml`
  - Moved `scripts/docker-entrypoint.sh` to `container/docker-entrypoint.sh`
  - Updated Dockerfile entrypoint path to reference new location
  - Added `network: host` to compose build config to improve build reliability
  - Added `network_mode: host` to compose runtime to avoid bridge networking failures
  - Updated Docker entrypoint behavior to prepare writable artifact directories for bind mounts

### Documentation

- Updated `docs/eng/project-structure.md` to reflect `container/` folder structure
- Updated `README.md` with Docker commands section (EN and PT-BR)
- Added Docker usage examples to Quick Start section
- Updated Docker guide, command reference, README, and troubleshooting docs to cover `docker:clean`, `docker:test:cucumber:video:pt-br`, `docker:test:cucumber:video:eng`, `docker:test:all:video`, host networking, and artifact permission recovery

## 2026-05-06

### Added

- New script `test:cucumber:workers:headless:video:pt-br` in `package.json`: runs the Cucumber suite with workers in headless mode with video restricted to the `pt-br` locale (explicit).
- Three locale shortcuts now available:
  - `test:cucumber:workers:headless:video:pt-br` — Brazilian Portuguese only
  - `test:cucumber:workers:headless:video:eng` — English only
  - `test:cucumber:workers:headless:video:all` — all locales in sequence

### Documentation

- Full documentation audit (PT-BR and EN) to ensure all three locale shortcuts are present everywhere relevant:
  - `docs/eng/commands.md` and `docs/pt-br/comandos.md`: new sections for `:all`, `:eng`, and `:pt-br`.
  - `docs/eng/running-tests.md` and `docs/pt-br/executando-testes.md`: locale shortcuts block restored and expanded.
  - `docs/eng/troubleshooting.md` and `docs/pt-br/solucao-de-problemas.md`: three new commands added to useful commands list.
  - `docs/eng/api-testing.md` and `docs/pt-br/testes-de-api.md`: worker+locale examples added.
  - `docs/eng/api-swapi-tests.md` and `docs/pt-br/detalhes-api-swapi.md`: per-locale worker variants added.
  - `docs/eng/how-to-implement-api-tests-from-scratch.md` and `docs/pt-br/como-implementar-testes-api-do-zero.md`: worker+locale examples included.
  - `README.md`: locale shortcuts added to Quick Start (EN and PT-BR).

## 2026-05-05 (part 8)

### Changed

- Refactored `locators/` directory to separate concerns by type:
  - Browser UI selectors moved to `ui/locators/` (checkout, login, products, register)
  - API endpoints moved to `api/endpoints/` (api-swapi)
- Updated all import statements across:
  - `steps/web/{eng,pt-br}/*.step.ts` (checkout, login, products, register)
  - `pages/login.page.ts`
  - `tests/e2e/login.spec.ts`

### Documentation

- Updated project structure docs (EN/PT-BR) to reflect new `ui/locators/` and `api/endpoints/` layout.
- Updated how-to guides (EN/PT-BR) with new locator subdirectory paths in code examples and checklists.
- Updated API testing docs (EN/PT-BR) to reference `api/endpoints/api-swapi.endpoint.ts`.

## 2026-05-05 (part 7)

### Changed

- Refactored Cucumber feature-parallel script layout to clarify orchestration boundaries:
  - `scripts/run-cucumber-features-parallel.mjs` -> `scripts/cucumber/run-features-parallel.mjs`
  - `scripts/parallel_exec/*` -> `scripts/cucumber/parallel/*`
- Updated internal imports in the feature-parallel entrypoint to match the new folder structure.

### Documentation

- Updated project structure docs (EN/PT-BR) to reflect the new `scripts/cucumber/parallel` layout.

## 2026-05-05 (part 6)

### Added

- Added `scripts/open-maximized.sh`: detects installed browser (Chrome → Chromium → Firefox → xdg-open fallback) and opens URLs maximized via `--start-maximized` / `--maximized`.

### Changed

- `allure:open` and `allure:serve` now set `BROWSER='bash scripts/open-maximized.sh'` so the Allure report opens in a maximized browser window.
- Moved Chromium X11 enforcement from shell env vars to `playwright.config.ts` project launch args (`--ozone-platform=x11`).
- Removed `OZONE_PLATFORM=x11` and `WAYLAND_DISPLAY=` from headed test scripts (`test:pw:headed:video`, `test:cucumber:headed:video`, `test:cucumber:workers:headed:video`): Firefox uses Wayland natively; Chromium is forced to X11 via the config arg.
- Reordered `package.json` scripts alphabetically.

### Fixed

- Fixed Chromium headed launch failure: `--ozone-platform=x11` must be in launch `args`, not the shell environment.
- Fixed Firefox headed launch failure: clearing `WAYLAND_DISPLAY` in the shell broke XWayland (`:1` depends on the Wayland compositor); Firefox now runs via its native Wayland support.

### Documentation

- Updated reporting docs (EN/PT-BR) to document maximized browser behavior.
- Updated configuration docs (EN/PT-BR) to mention `--ozone-platform=x11` in Chromium launch args.
- Added troubleshooting entry #14 (EN/PT-BR): headed Chromium and Firefox browser launch failures on Wayland.

## 2026-05-05 (part 5)

### Added

- Added full-suite scripts with video and verbose output:
  - `test:all:video:prompt`
  - `test:all:headless:video:prompt`
  - `test:all:video` (alias)

### Changed

- Updated `allure:serve` to filter recurring Wayland warning noise, matching the behavior already used in `allure:open`.
- Moved Chromium-specific launch argument (`--disable-blink-features=AutomationControlled`) to the Chromium project only.

### Fixed

- Fixed intermittent Firefox login failures caused by non-deterministic submit behavior on the login form.
- Hardened login flow with layered submit fallback and stronger assertions for account URL and error alerts.

### Documentation

- Updated running-tests and troubleshooting documentation in English and Portuguese to include:
  - full-suite test commands
  - zsh autocorrect workaround
  - Firefox login stability notes
  - Allure Wayland/X11 behavior notes

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
  - `ui/locators/login.locator.ts`, `ui/locators/register.locator.ts`, `ui/locators/products.locator.ts`, `ui/locators/checkout.locator.ts`
  - **NEW:** `api/endpoints/api-swapi.endpoint.ts` — SWAPI endpoints and film properties
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
  - https://automationteststore.com/
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
