# API Testing

## SWAPI (Star Wars API) Tests

The project includes API tests for the Star Wars API (https://swapi.info).

For full documentation including endpoint details, response schema, and AJV validation:
→ [API SWAPI Tests — detailed guide](./api-swapi-tests.md)

### Feature files

- `features/api/pt-br/api-swapi.feature` — Portuguese scenarios (`# language: pt`)
- `features/api/eng/api-swapi.feature` — English scenarios (`# language: en`)

### Step definitions

- `steps/api/pt-br/api-swapi.step.ts` — Portuguese API step implementations
- `steps/api/eng/api-swapi.step.ts` — English API step implementations

### Locators & endpoints

- `api/endpoints/api-swapi.endpoint.ts` — Centralized API endpoints and response properties

### Test scenarios

- Get Star Wars films list successfully
- Validate film data structure with `Scenario Outline` + `Examples`
- Validate the full SWAPI films response against a JSON Schema using AJV

### Running API tests

```bash
# All tests including API
yarn test:cucumber:headless:video

# Only SWAPI tests
yarn test:cucumber:headless:video --tags "@swapi"

# Only API tests
yarn test:cucumber:headless:video --tags "@api"

# API only (default locale)
yarn test:api

# API only in Portuguese
FEATURE_LOCALE=pt-br yarn test:api

# API only in English
FEATURE_LOCALE=eng yarn test:api

# API with parallel workers (Portuguese)
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=1 FEATURE_LOCALE=pt-br bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}" --tags "@api"

# API with parallel workers (English)
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=1 FEATURE_LOCALE=eng bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}" --tags "@api"

# API with parallel workers (all locales)
yarn test:cucumber:workers:headless:video:all --tags "@api"
```
