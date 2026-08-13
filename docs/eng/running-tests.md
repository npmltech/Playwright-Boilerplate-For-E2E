# Running Tests

## Playwright tests (without Cucumber, with video)

**Headed mode:**

```bash
yarn test:pw:headed:video
```

**Headless mode:**

```bash
yarn test:pw:headless:video
```

## Run all tests (Playwright + Cucumber + API, with video and prompt output)

There's no longer a single script that chains the whole suite. Run the phases directly:

**Headed mode (recommended for local validation):**

```bash
yarn test:pw:headed:video
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 FEATURE_LOCALE=pt-br bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 FEATURE_LOCALE=eng bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"
yarn test:api
```

**Headless mode (CI-friendly):**

```bash
yarn test:pw:headless:video
yarn test:cucumber:workers:headless:video:all
yarn test:api
```

If your zsh shell asks to autocorrect test -> tests, run with:

```bash
unsetopt correct correctall && yarn test:pw:headless:video
```

## Cucumber tests (with video, step output always printed)

### Without workers (serial execution)

- Headed mode:

  ```bash
  CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 bash scripts/cucumber-runner.sh verbose
  ```

- Headless mode:

  ```bash
  yarn test:cucumber:headless:video
  ```

- Locale shortcuts (serial, headless):

  ```bash
  # Brazilian Portuguese
  yarn test:cucumber:headless:video:pt-br

  # English only
  yarn test:cucumber:headless:video:eng
  ```

- Locale shortcuts (serial, headed):

  ```bash
  # Brazilian Portuguese
  FEATURE_LOCALE=pt-br CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 bash scripts/cucumber-runner.sh verbose

  # English only
  FEATURE_LOCALE=eng CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 bash scripts/cucumber-runner.sh verbose
  ```

### With workers (parallel scenario execution)

- Headed mode (default 4 workers):

  ```bash
  CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"
  ```

- Headless mode (default 4 workers):

  ```bash
  CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=1 bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"
  ```

- Custom worker count:

  ```bash
  CUCUMBER_PARALLEL=6 CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 bash scripts/cucumber-runner.sh verbose --parallel "$CUCUMBER_PARALLEL"
  CUCUMBER_PARALLEL=6 CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=1 bash scripts/cucumber-runner.sh verbose --parallel "$CUCUMBER_PARALLEL"
  ```

- Locale shortcuts (headless + workers):

  ```bash
  # Brazilian Portuguese
  CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=1 FEATURE_LOCALE=pt-br bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"

  # English only
  CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=1 FEATURE_LOCALE=eng bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"

  # All locales (pt-br + eng)
  yarn test:cucumber:workers:headless:video:all
  ```

## API tests only

```bash
# Default locale (pt-br)
yarn test:api

# Portuguese (explicit)
FEATURE_LOCALE=pt-br yarn test:api

# English
FEATURE_LOCALE=eng yarn test:api
```

## Debug & inspection

**Playwright debug mode:**

```bash
playwright test --config=config/playwright.config.ts --debug
```

**Playwright HTML report:**

```bash
yarn test:report
```

## Cucumber report summary

After running Cucumber (one locale or multiple locales), generate a merged summary:

```bash
yarn report:cucumber:summary
```

Useful options:

```bash
yarn report:cucumber:summary --input cucumber-reports/cucumber-report-eng.json
yarn report:cucumber:summary --input cucumber-reports --output .tmp/custom-summary.json
```

## Environment variables

| Variable            | Default | Description                                              |
| ------------------- | ------- | -------------------------------------------------------- |
| `FEATURE_LOCALE`    | `pt-br` | Selects feature and step locale (`pt-br` or `eng`)       |
| `CUCUMBER_VIDEO`    | `1`     | Enable (`1`) or disable (`0`) video recording            |
| `CUCUMBER_HEADLESS` | `1`     | Run headless (`1`) or headed (`0`)                       |
| `CUCUMBER_PARALLEL` | `4`     | Number of parallel workers                               |
| `PW_VIDEO_MODE`     | —       | Playwright video mode (`on`, `off`, `retain-on-failure`) |
