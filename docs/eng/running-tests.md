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

## Cucumber tests (with video, step output always printed)

### Without workers (serial execution)

- Headed mode:

  ```bash
  yarn test:cucumber:no-workers:headed:video
  ```

- Headless mode:

  ```bash
  yarn test:cucumber:no-workers:headless:video
  ```

### With workers (parallel scenario execution)

- Headed mode (default 4 workers):

  ```bash
  yarn test:cucumber:workers:headed:video
  ```

- Headless mode (default 4 workers):

  ```bash
  yarn test:cucumber:workers:headless:video
  ```

- Custom worker count:

  ```bash
  CUCUMBER_PARALLEL=6 yarn test:cucumber:workers:headed:video
  CUCUMBER_PARALLEL=6 yarn test:cucumber:workers:headless:video
  ```

## API tests only

```bash
# Default locale (pt-br)
yarn test:api

# Portuguese
yarn test:api:pt-br

# English
yarn test:api:eng
```

## Debug & inspection

**Playwright debug mode:**

```bash
yarn test:debug
```

**Playwright HTML report:**

```bash
yarn test:report
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `FEATURE_LOCALE` | `pt-br` | Selects feature and step locale (`pt-br` or `eng`) |
| `CUCUMBER_VIDEO` | `1` | Enable (`1`) or disable (`0`) video recording |
| `CUCUMBER_HEADLESS` | `1` | Run headless (`1`) or headed (`0`) |
| `CUCUMBER_PARALLEL` | `4` | Number of parallel workers |
| `PW_VIDEO_MODE` | — | Playwright video mode (`on`, `off`, `retain-on-failure`) |
