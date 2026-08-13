# Commands Reference

All available commands from `package.json`, organized by category. The script surface was trimmed to 20 core commands; less common combinations are documented below as raw commands you can run directly (or pass `--tags`, `FEATURE_LOCALE`, etc. inline).

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

To generate and serve in one step (previously `allure:server:report`):

```bash
yarn allure:generate && yarn allure:serve
```

### `yarn report:cucumber:summary`

Builds a concise, colorized summary from Cucumber JSON reports. By default it searches recursively in `cucumber-reports/` for locale files (for example `cucumber-report-pt-br.json`, `cucumber-report-eng.json`) and worker outputs (for example `worker-1/*.json`) and merges totals across them.

When locale/worker files are not found, it falls back to legacy `cucumber-report.json` and prints a warning so you know totals may represent only one locale. To generate a complete merged report first run `yarn test:cucumber:workers:headless:video:all`.

```bash
yarn report:cucumber:summary

# Optional: summarize a specific report file
yarn report:cucumber:summary --input cucumber-reports/cucumber-report-eng.json

# Optional: summarize all report files from a custom directory
yarn report:cucumber:summary --input cucumber-reports --output .tmp/cucumber-report-summary.json
```

---

## Code Formatting

### `yarn format`

Formats all files in the project using Prettier, including `.feature` files (the Gherkin plugin is registered globally in `.prettierrc`, so there's no separate `format:features` command). Rewrites files in-place.

```bash
yarn format
```

### `yarn format:check`

Checks whether all files — including `.feature` files — comply with Prettier formatting rules without writing any changes. Exits with a non-zero code if any file is not formatted correctly. Useful in CI.

```bash
yarn format:check
```

To run ESLint auto-fixes and Prettier formatting together in one pass (previously `format:lint`):

```bash
yarn lint:fix && yarn format
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

## Tests — Preparation

### `yarn test:prepare`

Runs pre-test cleanup via `scripts/clean-artifacts.sh` and validates that generated artifact paths were actually removed. All test scripts call this automatically before running, but you can also invoke it directly when needed.

```bash
yarn test:prepare
```

---

## Tests — Full Suite

There's no longer a single script that chains the whole suite with a labeled prompt. Run the three phases directly:

```bash
# Headless + video
yarn test:pw:headless:video
yarn test:cucumber:workers:headless:video:all
yarn test:api

# Headed + video
yarn test:pw:headed:video
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 FEATURE_LOCALE=pt-br bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 FEATURE_LOCALE=eng bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"
yarn test:api
```

---

## Tests — API

### `yarn test:api`

Runs only API tests (tagged `@api`) using Cucumber in headless mode without video. Uses the locale defined in `FEATURE_LOCALE` (default from `.env`).

```bash
yarn test:api
```

For a specific locale, override `FEATURE_LOCALE` inline (previously `test:api:eng` / `test:api:pt-br`):

```bash
FEATURE_LOCALE=eng yarn test:api
FEATURE_LOCALE=pt-br yarn test:api
```

---

## Tests — Cucumber

### `yarn test:cucumber:headless:video`

Runs the full Cucumber suite in **headless** browser mode with video recording enabled, using the locale from `FEATURE_LOCALE` (default from `.env`). Uses verbose output.

```bash
yarn test:cucumber:headless:video
```

### `yarn test:cucumber:headless:video:pt-br`

Runs the Cucumber suite **headless** with video, using the Brazilian Portuguese locale (`FEATURE_LOCALE=pt-br`).

```bash
yarn test:cucumber:headless:video:pt-br
```

### `yarn test:cucumber:headless:video:eng`

Runs the Cucumber suite **headless** with video, using the English locale (`FEATURE_LOCALE=eng`).

```bash
yarn test:cucumber:headless:video:eng
```

### Headed mode

There's no dedicated headed Cucumber script anymore; run the underlying command directly (`CUCUMBER_HEADLESS=1` in `test:cucumber:headless:video` is hardcoded in `package.json`, so exporting `CUCUMBER_HEADLESS=0` beforehand won't override it — call the runner script directly instead):

```bash
# Default locale, headed, with video
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 bash scripts/cucumber-runner.sh verbose

# A specific locale, headed, with video
FEATURE_LOCALE=pt-br CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 bash scripts/cucumber-runner.sh verbose
FEATURE_LOCALE=eng CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 bash scripts/cucumber-runner.sh verbose
```

### `yarn test:cucumber:workers:headless:video:all`

Runs the Cucumber suite with parallel workers in **headless** mode with video for **all supported locales**, in sequence (`pt-br` then `eng`). The number of workers defaults to 4 and can be overridden with `CUCUMBER_PARALLEL`.

```bash
yarn test:cucumber:workers:headless:video:all
# or with a custom worker count:
CUCUMBER_PARALLEL=8 yarn test:cucumber:workers:headless:video:all
```

For a single locale with workers, or for headed mode with workers, run the runner script directly:

```bash
# Single locale, headless, with workers
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=1 FEATURE_LOCALE=pt-br bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=1 FEATURE_LOCALE=eng bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"

# Headed, with workers
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"
```

---

## Tests — Playwright

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

For interactive debug mode (Playwright Inspector), run the underlying command directly:

```bash
playwright test --config=config/playwright.config.ts --debug
```

### `yarn test:report`

Opens the last Playwright HTML report using the built-in `show-report` server on port `9324`.

```bash
yarn test:report
```

---

## Docker

Container-based test execution. For detailed information, see [Docker Guide](docker.md).

### `yarn docker:build`

Builds (or rebuilds) Docker container images for all services (playwright, cucumber, api). Run this after updating `package.json` or the Dockerfile.

```bash
yarn docker:build
```

### `yarn docker:up`

Starts all three containers (playwright, cucumber, api) together — this is the equivalent of the old `docker:test:all:video`. Containers remain running until you press `Ctrl+C` or run `docker down`.

```bash
yarn docker:build && yarn docker:up
```

### `yarn docker:down`

Stops and removes all containers and associated networks.

```bash
yarn docker:down
```

To clean up generated artifact directories, use `yarn test:prepare` (previously `docker:clean` ran the identical command under a different name).

For streaming logs, running a single service, or other advanced operations, use `docker compose` directly:

```bash
# Stream logs from all running containers
docker compose -f container/docker-compose.yml logs -f

# Run only the Playwright service (defaults to test:pw:headless:video)
docker compose -f container/docker-compose.yml run --rm playwright

# Run only the Cucumber service for a specific locale
docker compose -f container/docker-compose.yml run --rm -e FEATURE_LOCALE=pt-br cucumber
docker compose -f container/docker-compose.yml run --rm -e FEATURE_LOCALE=eng cucumber

# Run only the API service
docker compose -f container/docker-compose.yml run --rm api

# List running containers / exec into one / view a single service's logs
docker compose -f container/docker-compose.yml ps
docker compose -f container/docker-compose.yml exec playwright /bin/sh
docker compose -f container/docker-compose.yml logs cucumber
```

---

## Tag Filtering

Any Cucumber command accepts `--tags` to filter scenarios. Examples:

```bash
# Run only smoke tests
yarn test:cucumber:headless:video --tags "@smoke"

# Run only SWAPI tests
yarn test:cucumber:headless:video --tags "@swapi"

# Exclude smoke tests
yarn test:cucumber:headless:video --tags "not @smoke"

# Combine filters
yarn test:cucumber:headless:video --tags "@api and @smoke"
```
