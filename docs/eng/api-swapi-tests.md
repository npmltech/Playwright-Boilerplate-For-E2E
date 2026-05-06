# Star Wars API (SWAPI) Tests

This document describes the API tests included in this project using the Star Wars API.

## Overview

The project includes comprehensive tests for the Star Wars API (https://swapi.info) to validate film data retrieval, structure, and JSON Schema compatibility.

## Test Files

### Feature Files

**Portuguese:**

- `features/api/pt-br/api-swapi.feature` — Cenários em português para testes da API SWAPI (`# language: pt`)

**English:**

- `features/api/eng/api-swapi.feature` — English scenarios for SWAPI API tests (`# language: en`)

### Step Definitions

- `steps/api/pt-br/api-swapi.step.ts` — Portuguese step implementations with full error handling
- `steps/api/eng/api-swapi.step.ts` — English step implementations with full error handling

### Locators & Configuration

- `locators/endpoints/api-swapi.locator.ts` — Centralized API endpoints and film properties

## Test Scenarios

### 1. Get Star Wars Films List Successfully

**PT:** Obter lista de filmes do SWAPI com sucesso

Validates that:

- API responds with HTTP status 200
- Response contains an array of films
- Array contains more than 0 films
- Each film has required properties (title, episode_id, director, producer, release_date)

**Running:**

```bash
yarn test:cucumber:no-workers:headed:video --tags "@swapi"
```

### 2. Validate Film Data Structure (Scenario Outline)

**PT:** Validar estrutura de dados do filme

Uses a `Scenario Outline` with an `Examples` table to run one parameterized check per film property:

| property     |
| ------------ |
| title        |
| episode_id   |
| director     |
| producer     |
| release_date |

Validates that the first film in the response has each property present and non-empty.
A single step definition `the first film should have property {string}` covers all rows.

**Running:**

```bash
yarn test:api
```

### 3. Validate Films Response Against JSON Schema (AJV)

**PT:** Validar resposta de filmes contra JSON Schema

Validates that:

- The response is a top-level array
- Each film object matches the expected SWAPI schema
- Required properties have the correct types
- `release_date` follows the `YYYY-MM-DD` pattern

Implementation notes:

- Uses `ajv` for JSON Schema validation
- Collects all schema errors with `allErrors: true`
- Fails the scenario with a summarized validation error report if any item is invalid

**Running:**

```bash
yarn test:api
```

## Running API Tests

### All tests (UI + API)

```bash
yarn test:cucumber:no-workers:headed:video
```

### Only SWAPI tests

```bash
yarn test:cucumber:no-workers:headed:video --tags "@swapi"
```

### Only API tests (any API)

```bash
yarn test:cucumber:no-workers:headless:video --tags "@api"

# Shortcuts
yarn test:api
yarn test:api:pt-br
yarn test:api:eng
```

### Specific mode

```bash
# Headless
yarn test:cucumber:no-workers:headless:video --tags "@swapi"

# With parallel workers
yarn test:cucumber:workers:headless:video --tags "@swapi"
CUCUMBER_PARALLEL=4 yarn test:cucumber:workers:headless:video --tags "@swapi"

# With parallel workers (Portuguese locale)
yarn test:cucumber:workers:headless:video:pt-br --tags "@swapi"

# With parallel workers (English locale)
yarn test:cucumber:workers:headless:video:eng --tags "@swapi"

# With parallel workers (all locales)
yarn test:cucumber:workers:headless:video:all --tags "@swapi"
```

## API Endpoint

**Base URL:** https://swapi.info

**Endpoint:** `/api/films`

**Method:** GET

**Example Response:**

```json
[
  {
    "title": "A New Hope",
    "episode_id": 4,
    "release_date": "1977-05-25",
    "director": "George Lucas",
    "producer": "Gary Kurtz, Rick McCallum",
    "characters": ["https://swapi.info/api/people/1/"],
    "planets": ["https://swapi.info/api/planets/1/"],
    "vehicles": ["https://swapi.info/api/vehicles/4/"],
    "starships": ["https://swapi.info/api/starships/2/"],
    "species": ["https://swapi.info/api/species/1/"],
    "created": "2014-12-10T14:23:09.469298Z",
    "edited": "2015-04-17T10:50:46.259765Z",
    "url": "https://swapi.info/api/films/1/"
  }
]
```

## Required Properties

Each film in the response must have:

- `title` (string) — Film title
- `episode_id` (number) — Episode number
- `director` (string) — Director name(s)
- `producer` (string) — Producer name(s)
- `release_date` (string) — Release date in YYYY-MM-DD format

## JSON Schema Validation

The AJV scenario validates the full response against a schema that enforces:

- top-level array response
- at least one film entry
- required fields: `title`, `episode_id`, `director`, `producer`, `release_date`
- `episode_id` as integer
- `release_date` matching `YYYY-MM-DD`
- optional SWAPI arrays such as `characters`, `planets`, `starships`, `vehicles`, and `species`

Relevant packages:

- `ajv` — JSON Schema validator used in SWAPI API steps
- `@cucumber/messages` — explicit peer dependency required by formatter/reporting packages in Yarn 4 installs

## Error Handling

The tests include comprehensive error handling:

- Network errors are caught and logged
- Status code mismatches are reported clearly
- Missing properties are identified by film and property name
- Schema validation failures include aggregated AJV error details
- All errors include colorized console output for easy debugging

## Test Execution Output

When running API tests, you'll see colored console output:

- 🎬 Blue messages for API access and requests
- ✓ Green messages for successful validations
- ✗ Red messages for failures
- 📡 Cyan messages for HTTP requests

Example:

```
🎬 Acessando a API SWAPI de filmes...
📡 Fazendo requisição GET para: https://swapi.info/api/films
✓ Resposta recebida com status 200
✓ Array de filmes encontrado com 6 filmes
✓ Todos os filmes têm as propriedades obrigatórias
✓ Título do primeiro filme: A New Hope
```

## Tags

- `@api` — All API tests
- `@swapi` — SWAPI-specific tests
- `@smoke` — Smoke test (basic validation)

Combine tags for filtering:

```bash
yarn test:cucumber:no-workers:headed:video --tags "@api and @smoke"
```
