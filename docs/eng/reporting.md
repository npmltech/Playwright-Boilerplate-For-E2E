# Reporting

## Allure Report

### Automatic generation after Cucumber runs

`scripts/cucumber-runner.sh` automatically generates `allure-report/` at the end of every Cucumber execution if `allure-results/*-result.json` files are present. You do not need to run `yarn allure:generate` manually after a normal test run — just open the report:

```bash
yarn allure:open
# or view live from allure-results/
yarn allure:serve
```

### Generate and serve (recommended when running reports standalone)

```bash
yarn allure:generate && yarn allure:serve
```

This command generates the Allure HTML report and opens it in an Allure report server on port 8080.

### Individual Allure commands

```bash
yarn allure:generate    # Generate report from allure-results/
yarn allure:open        # Open report in default browser, maximized
yarn allure:serve       # Serve report on localhost:8080 (no auto-open)
```

`allure:open` and `allure:serve` use `scripts/open-maximized.sh` as the browser launcher, so the report opens in a maximized window. The script detects the available browser (Chrome → Chromium → Firefox → xdg-open fallback) and passes `--start-maximized` (or `--maximized` for Firefox).

### Linux / headless environments

On Linux environments without a working desktop session, use `allure:serve` which does not attempt to launch a browser:

```bash
yarn allure:serve
```

`allure:serve` and `allure:open` filter common Wayland warning noise in output, while preserving actual command failures.

## Screenshot attachments by step

In `support/hooks.ts`, each Cucumber step captures and attaches a screenshot after page-ready checks.

Screenshots are included automatically in Allure reports and are attached to each scenario step.

## Cucumber JSON reports and merged summary

Current Cucumber execution writes locale-specific files in `cucumber-reports/`:

- `cucumber-report-pt-br.json`
- `cucumber-report-eng.json`
- matching HTML files (`cucumber-report-pt-br.html`, `cucumber-report-eng.html`)

This avoids report overwrite when running both locales in sequence.

### Generate merged terminal summary

```bash
yarn report:cucumber:summary
```

The summary output includes:

- merged totals across all locale files found
- recursive worker JSON discovery (for example `cucumber-reports/worker-1/*.json`)
- colorized status counters
- failure highlights (when any)
- `Test Run` timestamp formatted as `dd.mm.yyyy hh:mm`
- JSON output file at `.tmp/cucumber-report-summary.json`

### Optional input/output

```bash
# Single report file
yarn report:cucumber:summary --input cucumber-reports/cucumber-report-eng.json

# Custom directory + custom output path
yarn report:cucumber:summary --input cucumber-reports --output .tmp/custom-summary.json
```

### Legacy fallback behavior

If locale or worker-specific files are not found yet, the command falls back to `cucumber-report.json` and prints a warning. In that case totals may reflect only one locale.

To generate a full combined summary:

```bash
yarn test:cucumber:workers:headless:video:all
yarn report:cucumber:summary
```
