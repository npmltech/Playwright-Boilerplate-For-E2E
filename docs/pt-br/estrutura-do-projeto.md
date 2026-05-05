# Estrutura do Projeto

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
│   ├── eng/                               # Documentação em inglês
│   └── pt-br/                             # Documentação em português
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
│   └── open-maximized.sh
├── steps/
│   ├── api/
│   │   ├── eng/
│   │   │   └── api-swapi.step.ts
│   │   └── pt-br/
│   │       └── api-swapi.step.ts
│   └── web/
│       ├── eng/
│       └── pt-br/
├── support/
│   ├── hooks.ts
│   ├── world.ts
│   ├── helpers/
│   └── utils/
├── tests/
│   └── e2e/
├── reports/
├── allure-results/
├── allure-report/
├── cucumber-reports/
├── test-results/
├── .env
├── package.json
└── README.md
```
