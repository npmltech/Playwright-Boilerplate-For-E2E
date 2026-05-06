<p align="center">
  <img src="https://playwright.dev/img/playwright-logo.svg" alt="Playwright" width="220" />
</p>

# Playwright BDD Boilerplate for E2E Testing

### eng

A complete boilerplate project for end-to-end testing with Playwright, Cucumber BDD, TypeScript, Allure, and robust reporting.

### pt-br

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

### eng

Then create a `.env` file (see [Installation](docs/eng/installation.md)) and run:

### pt-br

Em seguida, crie o arquivo `.env` (veja [Instalação](docs/pt-br/instalacao.md)) e execute:

```bash
yarn test:api
```

### eng

To run the full suite with video and verbose output:

### pt-br

Para executar a suíte completa com vídeo e output declarativo:

```bash
yarn test:all:video:prompt
```

### eng — Locale shortcuts (headless + workers)

```bash
# Brazilian Portuguese
yarn test:cucumber:workers:headless:video:pt-br

# English only
yarn test:cucumber:workers:headless:video:eng

# All locales (pt-br + eng)
yarn test:cucumber:workers:headless:video:all
```

### pt-br — Atalhos por locale (headless + workers)

```bash
# Português do Brasil
yarn test:cucumber:workers:headless:video:pt-br

# Apenas inglês
yarn test:cucumber:workers:headless:video:eng

# Todos os locales (pt-br + eng)
yarn test:cucumber:workers:headless:video:all
```

## Documentation / Documentação

| Topic                            | English                                                                                                        | Português                                                                                                |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Languages & Libraries            | [Languages and Libraries](docs/eng/languages-and-libraries.md)                                                 | [Linguagens e Bibliotecas](docs/pt-br/linguagens-e-bibliotecas.md)                                       |
| Commands Reference               | [Commands Reference](docs/eng/commands.md)                                                                     | [Referência de Comandos](docs/pt-br/comandos.md)                                                         |
| Prerequisites                    | [Prerequisites](docs/eng/prerequisites.md)                                                                     | [Pré-requisitos](docs/pt-br/pre-requisitos.md)                                                           |
| Installation                     | [Installation](docs/eng/installation.md)                                                                       | [Instalação](docs/pt-br/instalacao.md)                                                                   |
| Project Structure                | [Project Structure](docs/eng/project-structure.md)                                                             | [Estrutura do Projeto](docs/pt-br/estrutura-do-projeto.md)                                               |
| Configuration                    | [Configuration](docs/eng/configuration.md)                                                                     | [Configuração](docs/pt-br/configuracao.md)                                                               |
| About Test Store                 | [About Automation Test Store](docs/eng/about-automation-test-store.md)                                         | [Sobre a Automation Test Store](docs/pt-br/sobre-automation-test-store.md)                               |
| Step File Convention             | [Step File Convention](docs/eng/step-file-convention.md)                                                       | [Convenção de Steps](docs/pt-br/convencao-de-steps.md)                                                   |
| API Testing                      | [API Testing](docs/eng/api-testing.md)                                                                         | [Testes de API](docs/pt-br/testes-de-api.md)                                                             |
| API SWAPI Details                | [API SWAPI Tests](docs/eng/api-swapi-tests.md)                                                                 | [Detalhes da API SWAPI](docs/pt-br/detalhes-api-swapi.md)                                                |
| Implement API Tests from Scratch | [How to Implement API Tests from Scratch](docs/eng/how-to-implement-api-tests-from-scratch.md)                 | [Como Implementar Testes de API do Zero](docs/pt-br/como-implementar-testes-api-do-zero.md)              |
| Implement Web Tests from Scratch | [How to Implement Web/Browser Tests from Scratch](docs/eng/how-to-implement-web-browser-tests-from-scratch.md) | [Como Implementar Testes Web/Browser do Zero](docs/pt-br/como-implementar-testes-web-browser-do-zero.md) |
| Running Tests                    | [Running Tests](docs/eng/running-tests.md)                                                                     | [Executando Testes](docs/pt-br/executando-testes.md)                                                     |
| Tagging Strategy                 | [Tagging Strategy](docs/eng/tagging-strategy.md)                                                               | [Estratégia de Tags](docs/pt-br/estrategia-de-tags.md)                                                   |
| Reporting                        | [Reporting](docs/eng/reporting.md)                                                                             | [Relatórios](docs/pt-br/relatorios.md)                                                                   |
| Changelog                        | [Changelog](docs/eng/changelog.md)                                                                             | [Changelog](docs/pt-br/changelog.md)                                                                     |
| MCP Workflow Notes               | [MCP Workflow Notes](docs/eng/mcp-workflow.md)                                                                 | [Notas do Fluxo MCP](docs/pt-br/fluxo-mcp.md)                                                            |
| Troubleshooting                  | [Troubleshooting](docs/eng/troubleshooting.md)                                                                 | [Solução de Problemas](docs/pt-br/solucao-de-problemas.md)                                               |
