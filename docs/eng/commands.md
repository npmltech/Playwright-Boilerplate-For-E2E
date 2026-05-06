# Commands Reference

All available commands from `package.json`, organized by category.

---

## Allure Reports

### `yarn allure:generate`

Generates the static Allure HTML report from the collected result files in `allure-results/`. Cleans any previous report before generating. Output is written to `allure-report/`.

```bash
yarn allure:generate
```

### `yarn allure:open`

Opens the last generated Allure report (`allure-report/`) in the browser with a maximized window. Suppresses Wayland-related noise on Linux without hiding real errors.

```bash
yarn allure:open
```

### `yarn allure:serve`

Generates and serves a live Allure report from `allure-results/` directly in the browser. Useful when you want to view results without keeping a separate generated folder. Also suppresses Wayland noise on Linux.

```bash
yarn allure:serve
```

### `yarn allure:server:report`

Shortcut that chains `allure:generate` and then `allure:serve`. Generates the report and immediately opens it in the browser in one command.

```bash
yarn allure:server:report
```

---

## Code Formatting

### `yarn format`

Formats all files in the project using Prettier. Rewrites files in-place.

```bash
yarn format
```

### `yarn format:check`

Checks whether all files comply with Prettier formatting rules without writing any changes. Exits with a non-zero code if any file is not formatted correctly. Useful in CI.

```bash
yarn format:check
```

### `yarn format:features`

Formats only `.feature` files in the `features/` directory using Prettier with the Gherkin plugin.

```bash
yarn format:features
```

### `yarn format:features:check`

Checks formatting of `.feature` files only, without writing changes. Useful in CI to validate Gherkin formatting.

```bash
yarn format:features:check
```

### `yarn format:lint`

Runs `lint:fix` first and then `format`. Applies both ESLint auto-fixes and Prettier formatting in one pass.

```bash
yarn format:lint
```

---

## Linting

### `yarn lint`

Runs ESLint on all `.ts`, `.tsx`, and `.js` files in the project. Reports problems without auto-fixing.

```bash
yarn lint
```

### `yarn lint:fix`

Runs ESLint with the `--fix` flag. Automatically fixes all auto-fixable lint issues in `.ts`, `.tsx`, and `.js` files.

```bash
yarn lint:fix
```

---

## Tests — Full Suite

### `yarn test:all:headless:video:prompt`

Runs the full test suite in **headless** mode with video recording enabled. Runs Playwright first, then Cucumber, printing a labeled prompt for each phase.

```bash
yarn test:all:headless:video:prompt
```

### `yarn test:all:video`

Alias for `test:all:video:prompt`. Runs the full suite in **headed** mode with video recording.

```bash
yarn test:all:video
```

### `yarn test:all:video:prompt`

Runs the full test suite in **headed** mode with video recording. Runs Playwright first, then Cucumber, printing a labeled prompt for each phase.

```bash
yarn test:all:video:prompt
```

---

## Tests — API

### `yarn test:api`

Runs only API tests (tagged `@api`) using Cucumber in headless mode without video. Uses the locale defined in `FEATURE_LOCALE` (default from `.env`).

```bash
yarn test:api
```

### `yarn test:api:eng`

Runs API tests (tagged `@api`) using the English locale (`FEATURE_LOCALE=eng`), headless, without video.

```bash
yarn test:api:eng
```

### `yarn test:api:pt-br`

Runs API tests (tagged `@api`) using the Brazilian Portuguese locale (`FEATURE_LOCALE=pt-br`), headless, without video.

```bash
yarn test:api:pt-br
```

---

## Tests — Cucumber

### `yarn test:cucumber:headed:video`

Runs the full Cucumber suite in **headed** browser mode with video recording enabled. Uses verbose output.

```bash
yarn test:cucumber:headed:video
```

### `yarn test:cucumber:headless:video`

Runs the full Cucumber suite in **headless** browser mode with video recording enabled. Uses verbose output.

```bash
yarn test:cucumber:headless:video
```

### `yarn test:cucumber:no-workers:headed:video`

Alias for `test:cucumber:headed:video`. Runs Cucumber **headed** with video, single-threaded (no parallel workers).

```bash
yarn test:cucumber:no-workers:headed:video
```

### `yarn test:cucumber:no-workers:headless:video`

Alias for `test:cucumber:headless:video`. Runs Cucumber **headless** with video, single-threaded (no parallel workers).

```bash
yarn test:cucumber:no-workers:headless:video
```

### `yarn test:cucumber:workers:headed:video`

Runs Cucumber in **headed** mode with video and **parallel workers**. The number of workers defaults to 4 and can be overridden with `CUCUMBER_PARALLEL`.

```bash
yarn test:cucumber:workers:headed:video
# or with custom worker count:
CUCUMBER_PARALLEL=8 yarn test:cucumber:workers:headed:video
```

### `yarn test:cucumber:workers:headless:video`

Runs Cucumber in **headless** mode with video and **parallel workers**. The number of workers defaults to 4 and can be overridden with `CUCUMBER_PARALLEL`.

```bash
yarn test:cucumber:workers:headless:video
# or with custom worker count:
CUCUMBER_PARALLEL=8 yarn test:cucumber:workers:headless:video
```

---

## Tests — Playwright

### `yarn test:debug`

Opens Playwright in interactive **debug mode** (Playwright Inspector). Lets you step through test execution and inspect selectors in real time.

```bash
yarn test:debug
```

### `yarn test:pw:headed:video`

Runs only the Playwright (non-Cucumber) tests in **headed** mode with video recording enabled. Uses the list reporter.

```bash
yarn test:pw:headed:video
```

### `yarn test:pw:headless:video`

Runs only the Playwright (non-Cucumber) tests in **headless** mode with video recording enabled. Uses the list reporter.

```bash
yarn test:pw:headless:video
```

### `yarn test:report`

Opens the last Playwright HTML report using the built-in `show-report` server on port `9324`.

```bash
yarn test:report
```

---

## Tag Filtering

Any Cucumber command accepts `--tags` to filter scenarios. Examples:

```bash
# Run only smoke tests
yarn test:cucumber:no-workers:headless:video --tags "@smoke"

# Run only SWAPI tests
yarn test:cucumber:no-workers:headless:video --tags "@swapi"

# Exclude smoke tests
yarn test:cucumber:no-workers:headless:video --tags "not @smoke"

# Combine filters
yarn test:cucumber:no-workers:headless:video --tags "@api and @smoke"
```
