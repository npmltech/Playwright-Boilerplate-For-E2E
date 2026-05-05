# Tagging Strategy

## Current tag examples in web feature files

- Cucumber tags: `@login`, `@authentication`, `@smoke`, `@regression`
- Allure labels as tags:
  - `@allure.label.severity:critical`
  - `@allure.label.severity:normal`
  - `@allure.label.suite:Login`
  - `@allure.label.feature:Authentication`

## Current tag examples in register feature

- Cucumber tags: `@register`, `@authentication`, `@smoke`, `@regression`
- Allure labels as tags:
  - `@allure.label.severity:critical`
  - `@allure.label.severity:normal`
  - `@allure.label.suite:Cadastro`
  - `@allure.label.suite:RecuperacaoSenha`
  - `@allure.label.feature:Authentication`

## API test tags

- `@api` — All API tests (also skips browser bootstrap in hooks)
- `@swapi` — SWAPI-specific tests
- `@smoke` — Smoke test (basic validation)

## Filtering by tag

```bash
# Run smoke tests only
yarn test:cucumber:no-workers:headless:video --tags "@smoke"

# Run regression tests only
yarn test:cucumber:no-workers:headless:video --tags "@regression"

# Exclude smoke tests
yarn test:cucumber:no-workers:headless:video --tags "not @smoke"

# Run login tests
yarn test:cucumber:no-workers:headless:video --tags "@login"

# Run register tests
yarn test:cucumber:no-workers:headless:video --tags "@register"

# Run API tests only
yarn test:api

# Combine tags
yarn test:cucumber:no-workers:headless:video --tags "@api and @smoke"
```
