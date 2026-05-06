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

- `locators/endpoints/api-swapi.locator.ts` — Centralized API endpoints and response properties

### Test scenarios

- Get Star Wars films list successfully
- Validate film data structure with `Scenario Outline` + `Examples`
- Validate the full SWAPI films response against a JSON Schema using AJV

### Running API tests

```bash
# All tests including API
yarn test:cucumber:no-workers:headless:video

# Only SWAPI tests
yarn test:cucumber:no-workers:headless:video --tags "@swapi"

# Only API tests
yarn test:cucumber:no-workers:headless:video --tags "@api"

# API only (default locale)
yarn test:api

# API only in Portuguese
yarn test:api:pt-br

# API only in English
yarn test:api:eng

# API with parallel workers (Portuguese)
yarn test:cucumber:workers:headless:video:pt-br --tags "@api"

# API with parallel workers (English)
yarn test:cucumber:workers:headless:video:eng --tags "@api"

# API with parallel workers (all locales)
yarn test:cucumber:workers:headless:video:all --tags "@api"
```
