<p align="center">
  <img src="https://playwright.dev/img/playwright-logo.svg" alt="Playwright" width="220" />
</p>

# Playwright BDD Boilerplate for E2E Testing

### eng

A production-ready boilerplate for end-to-end quality engineering with Playwright, Cucumber BDD, TypeScript, and a reporting stack designed for real execution at scale.

### pt-br

Um boilerplate pronto para produção em engenharia de qualidade end-to-end com Playwright, Cucumber BDD, TypeScript e uma esteira de relatórios pensada para execução real em escala.

## Key Outcomes / Resultados-Chave

### eng

- Release confidence: stable E2E + API flows with consistent execution patterns for CI and local runs.
- Traceability: BDD scenarios, Allure evidence, and consolidated summary artifacts aligned to the same execution context.
- Faster diagnosis: colorized terminal summary, per-step evidence, and aggregated reporting reduce investigation time.

### pt-br

- Confiança de release: fluxos E2E + API estáveis com padrões consistentes para execução local e CI.
- Rastreabilidade: cenários BDD, evidências no Allure e artefatos consolidados de summary no mesmo contexto de execução.
- Menor tempo de diagnóstico: resumo colorido no terminal, evidências por step e visão agregada aceleram a análise de falhas.

## Why This Boilerplate Stands Out / Diferenciais do Boilerplate

### eng

- Allure as the central reporting hub: consolidates execution evidence, screenshots, step history, and run context in one place.
- Robust multi-source reporting: supports locale files, worker outputs, and merged terminal summaries without losing visibility.
- BDD clarity with operational resilience: human-readable scenarios with execution modes for serial, parallel, locale-scoped, and Docker runs.
- Report continuity by design: fallback behavior prevents complete reporting loss when only legacy JSON is available.

### pt-br

- Allure como hub central de relatórios: consolida evidências de execução, screenshots, histórico de steps e contexto de run em um único lugar.
- Relatórios robustos de múltiplas fontes: suporta arquivos por locale, saídas por worker e resumo consolidado no terminal sem perder visibilidade.
- Clareza de BDD com resiliência operacional: cenários legíveis com modos de execução serial, paralelo, por locale e em Docker.
- Continuidade de relatórios por design: comportamento de fallback evita perda total de relatório quando apenas o JSON legado está disponível.

## Reporting Strategy / Estratégia de Relatórios

### eng

Reporting is treated as a first-class layer in this project, not an afterthought:

- Allure provides the aggregated and navigable quality view across runs.
- Cucumber JSON/HTML outputs provide raw and locale-specific execution detail.
- `yarn report:cucumber:summary` provides fast feedback in terminal plus JSON artifact output for automation flows.

### pt-br

Relatórios são tratados como camada de primeira classe neste projeto, não como complemento:

- O Allure entrega a visão agregada e navegável de qualidade entre execuções.
- As saídas JSON/HTML do Cucumber entregam detalhe bruto e por locale da execução.
- `yarn report:cucumber:summary` entrega feedback rápido no terminal e artefato JSON para fluxos de automação.

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

## Cucumber Summary / Resumo Cucumber

### eng

Generate a human-friendly summary from Cucumber JSON reports:

```bash
yarn report:cucumber:summary
```

The summary includes:

- colored terminal output (status, counters, failures)
- Test Run timestamp in `dd.mm.yyyy hh:mm`
- merged totals across locale files (`cucumber-report-pt-br.json` + `cucumber-report-eng.json`)
- recursive discovery support for worker reports (for example `cucumber-reports/worker-1/*.json`)

If locale or worker report files are not found yet, the command falls back to legacy `cucumber-report.json`.
To generate a full combined summary across both locales:

```bash
yarn test:cucumber:workers:headless:video:all
yarn report:cucumber:summary
```

Optional input/output:

```bash
yarn report:cucumber:summary --input cucumber-reports/cucumber-report-eng.json
yarn report:cucumber:summary --input cucumber-reports --output .tmp/custom-summary.json
```

### pt-br

Gere um resumo amigável dos relatórios JSON do Cucumber:

```bash
yarn report:cucumber:summary
```

O resumo inclui:

- saída colorida no terminal (status, contadores, falhas)
- timestamp de execução em `dd.mm.aaaa hh:mm`
- totais mesclados entre arquivos por locale (`cucumber-report-pt-br.json` + `cucumber-report-eng.json`)
- suporte a descoberta recursiva de relatórios de worker (exemplo: `cucumber-reports/worker-1/*.json`)

Se os arquivos por locale ou worker ainda não existirem, o comando usa fallback para `cucumber-report.json`.
Para gerar um resumo completo consolidado dos dois locales:

```bash
yarn test:cucumber:workers:headless:video:all
yarn report:cucumber:summary
```

Entrada/saída opcionais:

```bash
yarn report:cucumber:summary --input cucumber-reports/cucumber-report-eng.json
yarn report:cucumber:summary --input cucumber-reports --output .tmp/custom-summary.json
```

### eng — Docker commands (with video evidence)

```bash
# Build container images
yarn docker:build

# Clean generated artifacts safely
yarn docker:clean

# Run full suite in Docker (Playwright + Cucumber PT-BR + ENG)
yarn docker:test:all:video

# Run Playwright tests in Docker with video
yarn docker:test:pw:video

# Run Cucumber tests in Docker with video (PT-BR)
yarn docker:test:cucumber:video:pt-br

# Run Cucumber tests in Docker with video (ENG)
yarn docker:test:cucumber:video:eng

# Run API tests in Docker
yarn docker:test:api:video

# Start all containers (interactive)
yarn docker:up

# Stop and remove containers
yarn docker:down

# View live logs
yarn docker:logs

# Run any docker-compose command
yarn docker:compose ps
```

### pt-br — Comandos Docker (com vídeos de evidência)

```bash
# Construir imagens do container
yarn docker:build

# Limpar artefatos gerados com segurança
yarn docker:clean

# Executar suíte completa no Docker (Playwright + Cucumber PT-BR + ENG)
yarn docker:test:all:video

# Executar testes Playwright no Docker com vídeo
yarn docker:test:pw:video

# Executar testes Cucumber no Docker com vídeo (PT-BR)
yarn docker:test:cucumber:video:pt-br

# Executar testes Cucumber no Docker com vídeo (ENG)
yarn docker:test:cucumber:video:eng

# Executar testes de API no Docker
yarn docker:test:api:video

# Iniciar todos os containers (interativo)
yarn docker:up

# Parar e remover containers
yarn docker:down

# Ver logs em tempo real
yarn docker:logs

# Executar qualquer comando docker-compose
yarn docker:compose ps
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
| Docker                           | [Docker Guide](docs/eng/docker.md)                                                                             | [Guia de Docker](docs/pt-br/docker.md)                                                                   |
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
