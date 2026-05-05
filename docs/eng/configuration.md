# Configuration

## Environment Variables

```properties
BASE_URL=https://automationteststore.com/index.php?rt=account/login
USERNAME=tester_champion
PASSWORD=123123
```

## Playwright Config Highlights

Current setup in `config/playwright.config.ts`:

- Uses `BASE_URL` from `.env`
- Runs Chromium and Firefox projects
- Collects screenshot, trace, and video on failures/retries
- Uses local webServer only when `BASE_URL` points to localhost

## Cucumber Config Highlights

Current setup in `config/cucumber.config.cjs`:

- Imports world, hooks, and step files
- Loads step files via `steps/**/${FEATURE_LOCALE}/**/*.step.ts` glob (locale-driven)
- Runs features from `features/**/${FEATURE_LOCALE}/**/*.feature`
- Produces JSON + pretty output + Allure output
