<p align="center">
  <img src="https://playwright.dev/img/playwright-logo.svg" alt="Playwright" width="220" />
</p>

# Playwright BDD Boilerplate for E2E Testing

A complete boilerplate project for end-to-end testing with Playwright, Cucumber BDD, TypeScript, Allure, and robust reporting.

Um projeto boilerplate completo para testes end-to-end com Playwright, Cucumber BDD, TypeScript, Allure e relatórios robustos.

## Quick Start

```bash
git clone <repository-url>
cd Playwright-Boilerplate-For-E2E
corepack enable
yarn set version 4.14.0
yarn install
yarn playwright install
```

Then create a `.env` file (see [Installation](docs/eng/installation.md)) and run:\
Em seguida, crie o arquivo `.env` (veja [Instalação](docs/pt-br/instalacao.md)) e execute:

```bash
yarn test:api
```

To run the full suite with video and verbose output:

```bash
yarn test:all:video:prompt
```

## Documentation / Documentação

| Topic | English | Português |
|-------|---------|-----------|
| Prerequisites | [Prerequisites](docs/eng/prerequisites.md) | [Pré-requisitos](docs/pt-br/pre-requisitos.md) |
| Installation | [Installation](docs/eng/installation.md) | [Instalação](docs/pt-br/instalacao.md) |
| Project Structure | [Project Structure](docs/eng/project-structure.md) | [Estrutura do Projeto](docs/pt-br/estrutura-do-projeto.md) |
| Configuration | [Configuration](docs/eng/configuration.md) | [Configuração](docs/pt-br/configuracao.md) |
| About Test Store | [About Automation Test Store](docs/eng/about-automation-test-store.md) | — |
| Step File Convention | [Step File Convention](docs/eng/step-file-convention.md) | [Convenção de Steps](docs/pt-br/convencao-de-steps.md) |
| API Testing | [API Testing](docs/eng/api-testing.md) | [Testes de API](docs/pt-br/testes-de-api.md) |
| API SWAPI Details | [API SWAPI Tests](docs/eng/api-swapi-tests.md) | — |
| Running Tests | [Running Tests](docs/eng/running-tests.md) | [Executando Testes](docs/pt-br/executando-testes.md) |
| Tagging Strategy | [Tagging Strategy](docs/eng/tagging-strategy.md) | [Estratégia de Tags](docs/pt-br/estrategia-de-tags.md) |
| Reporting | [Reporting](docs/eng/reporting.md) | [Relatórios](docs/pt-br/relatorios.md) |
| Changelog | [Changelog](docs/eng/changelog.md) | [Changelog](docs/pt-br/changelog.md) |
| MCP Workflow Notes | [MCP Workflow Notes](docs/eng/mcp-workflow.md) | — |
| Troubleshooting | [Troubleshooting](docs/eng/troubleshooting.md) | [Solução de Problemas](docs/pt-br/solucao-de-problemas.md) |
