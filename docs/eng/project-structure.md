# Project Structure

```text
Playwright-Boilerplate-For-E2E/
├── config/
│   ├── playwright.config.ts
│   ├── cucumber.config.cjs
│   ├── cucumber.config.js.deprecated
│   ├── routes.ts
│   ├── environments/
│   ├── kill-port.js
│   ├── patch-playwright-websocket.js
│   └── start-server-if-free.js
├── data/
│   └── users.ts
├── docs/
│   ├── eng/
│   │   ├── prerequisites.md
│   │   ├── installation.md
│   │   ├── project-structure.md
│   │   ├── configuration.md
│   │   ├── about-automation-test-store.md
│   │   ├── step-file-convention.md
│   │   ├── api-testing.md
│   │   ├── api-swapi-tests.md
│   │   ├── running-tests.md
│   │   ├── tagging-strategy.md
│   │   ├── reporting.md
│   │   ├── changelog.md
│   │   ├── mcp-workflow.md
│   │   └── troubleshooting.md
│   └── pt-br/
│       ├── pre-requisitos.md
│       ├── instalacao.md
│       ├── estrutura-do-projeto.md
│       ├── configuracao.md
│       ├── convencao-de-steps.md
│       ├── testes-de-api.md
│       ├── executando-testes.md
│       ├── estrategia-de-tags.md
│       ├── relatorios.md
│       ├── changelog.md
│       └── solucao-de-problemas.md
├── features/
│   ├── api/
│   │   ├── eng/
│   │   │   └── api-swapi.feature          # language: en
│   │   └── pt-br/
│   │       └── api-swapi.feature          # language: pt
│   └── web/
│       ├── eng/
│       │   ├── login.feature              # language: en
│       │   ├── register.feature
│       │   ├── products.feature
│       │   └── checkout.feature
│       └── pt-br/
│           ├── login.feature              # language: pt
│           ├── register.feature
│           ├── products.feature
│           └── checkout.feature
├── locators/
│   ├── login.locator.ts
│   ├── register.locator.ts
│   ├── products.locator.ts
│   ├── checkout.locator.ts
│   └── api-swapi.locator.ts
├── pages/
│   ├── base.page.ts
│   └── login.page.ts
├── scripts/
│   ├── cucumber-runner.sh
│   ├── run-cucumber-features-parallel.mjs
│   ├── exclude-some-artifacts.sh
│   ├── clean-artifacts.sh
│   └── parallel_exec/
│       ├── feature-runner.mjs
│       ├── file-discovery.mjs
│       ├── import-args-builder.mjs
│       ├── parallel-feature-executor.mjs
│       └── report-directory-manager.mjs
├── steps/
│   ├── api/
│   │   ├── eng/
│   │   │   └── api-swapi.step.ts
│   │   └── pt-br/
│   │       └── api-swapi.step.ts
│   └── web/
│       ├── eng/
│       │   ├── login.step.ts
│       │   ├── register.step.ts
│       │   ├── products.step.ts
│       │   └── checkout.step.ts
│       └── pt-br/
│           ├── login.step.ts
│           ├── register.step.ts
│           ├── products.step.ts
│           └── checkout.step.ts
├── support/
│   ├── hooks.ts
│   ├── world.ts
│   ├── helpers/
│   │   └── hooks-helpers.ts
│   └── utils/
│       └── color-utils.ts
├── tests/
│   └── e2e/
│       └── login.spec.ts
├── reports/
├── allure-results/
├── allure-report/
├── cucumber-reports/
├── test-results/
├── .env
├── package.json
└── README.md
```
