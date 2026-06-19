# Estrutura do Projeto

```text
Playwright-Boilerplate-For-E2E/
├── config/
│   ├── cucumber.config.cjs
│   ├── cucumber.config.js.deprecated
│   ├── environments/
│   │   ├── production.ts
│   │   └── staging.ts
│   ├── kill-port.js
│   ├── patch-playwright-websocket.js
│   ├── playwright.config.ts
│   ├── routes.ts
│   └── start-server-if-free.js
├── container/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── docker-entrypoint.sh
├── data/
│   └── users.ts
├── docs/
│   ├── eng/
│   │   ├── about-automation-test-store.md
│   │   ├── api-swapi-tests.md
│   │   ├── api-testing.md
│   │   ├── changelog.md
│   │   ├── configuration.md
│   │   ├── how-to-implement-api-tests-from-scratch.md
│   │   ├── how-to-implement-web-browser-tests-from-scratch.md
│   │   ├── installation.md
│   │   ├── mcp-workflow.md
│   │   ├── prerequisites.md
│   │   ├── project-structure.md
│   │   ├── reporting.md
│   │   ├── running-tests.md
│   │   ├── step-file-convention.md
│   │   ├── tagging-strategy.md
│   │   └── troubleshooting.md
│   └── pt-br/
│       ├── changelog.md
│       ├── como-implementar-testes-api-do-zero.md
│       ├── como-implementar-testes-web-browser-do-zero.md
│       ├── configuracao.md
│       ├── convencao-de-steps.md
│       ├── detalhes-api-swapi.md
│       ├── estrategia-de-tags.md
│       ├── estrutura-do-projeto.md
│       ├── executando-testes.md
│       ├── fluxo-mcp.md
│       ├── instalacao.md
│       ├── pre-requisitos.md
│       ├── relatorios.md
│       ├── sobre-automation-test-store.md
│       ├── solucao-de-problemas.md
│       └── testes-de-api.md
├── features/
│   ├── api/
│   │   ├── eng/
│   │   │   └── api-swapi.feature          # language: en
│   │   └── pt-br/
│   │       └── api-swapi.feature          # language: pt
│   └── web/
│       ├── eng/
│       │   ├── login.feature
│       │   ├── register.feature
│       │   ├── products.feature
│       │   └── checkout.feature
│       └── pt-br/
│           ├── login.feature
│           ├── register.feature
│           ├── products.feature
│           └── checkout.feature
├── locators/
│   ├── web-elements/
│   │   ├── login.locator.ts
│   │   ├── register.locator.ts
│   │   ├── products.locator.ts
│   │   └── checkout.locator.ts
│   └── endpoints/
│       └── api-swapi.locator.ts
├── pages/
│   ├── base.page.ts
│   └── login.page.ts
├── scripts/
│   ├── cucumber-runner.sh
│   ├── cucumber/
│   │   ├── run-features-parallel.mjs
│   │   └── parallel/
│   │       ├── feature-runner.mjs
│   │       ├── file-discovery.mjs
│   │       ├── import-args-builder.mjs
│   │       ├── parallel-feature-executor.mjs
│   │       └── report-directory-manager.mjs
│   ├── exclude-some-artifacts.sh
│   ├── clean-artifacts.sh
│   ├── cucumber-report-summary.cjs
│   └── open-maximized.sh
├── steps/
│   ├── api/
│   │   ├── eng/
│   │   │   └── api-swapi.step.ts
│   │   └── pt-br/
│   │       └── api-swapi.step.ts
│   └── web/
│       ├── eng/
│       │   ├── checkout.step.ts
│       │   ├── login.step.ts
│       │   ├── products.step.ts
│       │   └── register.step.ts
│       └── pt-br/
│           ├── checkout.step.ts
│           ├── login.step.ts
│           ├── products.step.ts
│           └── register.step.ts
├── support/
│   ├── hooks.ts
│   ├── helpers/
│   │   └── hooks-helpers.ts
│   ├── utils/
│   │   └── color-utils.ts
│   └── world.ts
├── tests/
│   └── e2e/
│       └── login.spec.ts
├── reports/
├── allure-results/
├── allure-report/
├── cucumber-reports/
│   ├── cucumber-report-pt-br.json
│   ├── cucumber-report-eng.json
│   ├── cucumber-report-pt-br.html
│   └── cucumber-report-eng.html
├── test-results/
├── .env
├── .gitignore
├── .prettierrc
├── .yarn/
├── .yarnrc.yml
├── eslint.config.ts
├── LICENSE
├── package.json
├── tsconfig.json
├── yarn.lock
└── README.md
```
