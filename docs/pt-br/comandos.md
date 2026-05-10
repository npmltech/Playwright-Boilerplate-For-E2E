# Referência de Comandos

Todos os comandos disponíveis no `package.json`, organizados por categoria.

---

## Relatórios Allure

### `yarn allure:generate`

Gera o relatório HTML estático do Allure a partir dos arquivos coletados em `allure-results/`. Limpa qualquer relatório anterior antes de gerar. O resultado é escrito em `allure-report/`.

```bash
yarn allure:generate
```

### `yarn allure:open`

Abre o último relatório Allure gerado (`allure-report/`) no browser com a janela maximizada. Suprime ruído relacionado ao Wayland no Linux sem esconder erros reais.

```bash
yarn allure:open
```

### `yarn allure:serve`

Gera e serve um relatório Allure ao vivo a partir de `allure-results/` diretamente no browser. Útil quando você quer visualizar resultados sem manter uma pasta gerada separada. Também suprime ruído do Wayland no Linux.

```bash
yarn allure:serve
```

### `yarn allure:server:report`

Atalho que encadeia `allure:generate` e depois `allure:serve`. Gera o relatório e o abre imediatamente no browser em um único comando.

```bash
yarn allure:server:report
```

---

## Formatação de Código

### `yarn format`

Formata todos os arquivos do projeto usando o Prettier. Reescreve os arquivos no lugar.

```bash
yarn format
```

### `yarn format:check`

Verifica se todos os arquivos estão de acordo com as regras de formatação do Prettier sem escrever nenhuma alteração. Encerra com código de erro se algum arquivo não estiver formatado corretamente. Útil em CI.

```bash
yarn format:check
```

### `yarn format:features`

Formata apenas os arquivos `.feature` no diretório `features/` usando o Prettier com o plugin Gherkin.

```bash
yarn format:features
```

### `yarn format:features:check`

Verifica a formatação apenas dos arquivos `.feature` sem aplicar alterações. Útil em CI para validar a formatação Gherkin.

```bash
yarn format:features:check
```

### `yarn format:lint`

Executa `lint:fix` primeiro e depois `format`. Aplica tanto as correções automáticas do ESLint quanto a formatação do Prettier em uma única passagem.

```bash
yarn format:lint
```

---

## Lint

### `yarn lint`

Executa o ESLint em todos os arquivos `.ts`, `.tsx` e `.js` do projeto. Reporta os problemas sem corrigir automaticamente.

```bash
yarn lint
```

### `yarn lint:fix`

Executa o ESLint com a flag `--fix`. Corrige automaticamente todos os problemas de lint com correção automática disponível em arquivos `.ts`, `.tsx` e `.js`.

```bash
yarn lint:fix
```

---

## Testes — Suíte Completa

### `yarn test:all:headless:video:prompt`

Executa a suíte completa de testes em modo **headless** com gravação de vídeo habilitada. Roda o Playwright primeiro e depois o Cucumber, exibindo um rótulo para cada fase.

```bash
yarn test:all:headless:video:prompt
```

### `yarn test:all:video`

Alias de `test:all:video:prompt`. Executa a suíte completa em modo **headed** com gravação de vídeo.

```bash
yarn test:all:video
```

### `yarn test:all:video:prompt`

Executa a suíte completa de testes em modo **headed** com gravação de vídeo. Roda o Playwright primeiro e depois o Cucumber, exibindo um rótulo para cada fase.

```bash
yarn test:all:video:prompt
```

---

## Testes — API

### `yarn test:api`

Executa apenas os testes de API (marcados com `@api`) usando o Cucumber em modo headless sem vídeo. Usa o locale definido em `FEATURE_LOCALE` (padrão do `.env`).

```bash
yarn test:api
```

### `yarn test:api:eng`

Executa os testes de API (marcados com `@api`) usando o locale em inglês (`FEATURE_LOCALE=eng`), headless, sem vídeo.

```bash
yarn test:api:eng
```

### `yarn test:api:pt-br`

Executa os testes de API (marcados com `@api`) usando o locale em português do Brasil (`FEATURE_LOCALE=pt-br`), headless, sem vídeo.

```bash
yarn test:api:pt-br
```

---

## Testes — Cucumber

### `yarn test:cucumber:headed:video`

Executa a suíte completa do Cucumber em modo de browser **headed** com gravação de vídeo habilitada. Usa saída verbosa.

```bash
yarn test:cucumber:headed:video
```

### `yarn test:cucumber:headless:video`

Executa a suíte completa do Cucumber em modo de browser **headless** com gravação de vídeo habilitada. Usa saída verbosa.

```bash
yarn test:cucumber:headless:video
```

### `yarn test:cucumber:no-workers:headed:video`

Alias de `test:cucumber:headed:video`. Executa o Cucumber em modo **headed** com vídeo, single-threaded (sem workers paralelos).

```bash
yarn test:cucumber:no-workers:headed:video
```

### `yarn test:cucumber:no-workers:headless:video`

Alias de `test:cucumber:headless:video`. Executa o Cucumber em modo **headless** com vídeo, single-threaded (sem workers paralelos).

```bash
yarn test:cucumber:no-workers:headless:video
```

### `yarn test:cucumber:workers:headed:video`

Executa o Cucumber em modo **headed** com vídeo e **workers paralelos**. O número de workers padrão é 4 e pode ser sobrescrito com `CUCUMBER_PARALLEL`.

```bash
yarn test:cucumber:workers:headed:video
# ou com contagem customizada de workers:
CUCUMBER_PARALLEL=8 yarn test:cucumber:workers:headed:video
```

### `yarn test:cucumber:workers:headless:video`

Executa o Cucumber em modo **headless** com vídeo e **workers paralelos**. O número de workers padrão é 4 e pode ser sobrescrito com `CUCUMBER_PARALLEL`.

```bash
yarn test:cucumber:workers:headless:video
# ou com contagem customizada de workers:
CUCUMBER_PARALLEL=8 yarn test:cucumber:workers:headless:video
```

### `yarn test:cucumber:workers:headless:video:all`

Executa a suíte Cucumber com workers em modo **headless** com vídeo para **todos os locales suportados**, em sequência (`pt-br` e depois `eng`).

```bash
yarn test:cucumber:workers:headless:video:all
```

### `yarn test:cucumber:workers:headless:video:eng`

Executa a suíte Cucumber com workers em modo **headless** com vídeo apenas no locale em inglês (`FEATURE_LOCALE=eng`).

```bash
yarn test:cucumber:workers:headless:video:eng
```

### `yarn test:cucumber:workers:headless:video:pt-br`

Executa a suíte Cucumber com workers em modo **headless** com vídeo apenas no locale em português do Brasil (`FEATURE_LOCALE=pt-br`).

```bash
yarn test:cucumber:workers:headless:video:pt-br
```

---

## Testes — Playwright

### `yarn test:debug`

Abre o Playwright no modo de **depuração** interativo (Playwright Inspector). Permite percorrer a execução do teste passo a passo e inspecionar seletores em tempo real.

```bash
yarn test:debug
```

### `yarn test:pw:headed:video`

Executa apenas os testes Playwright (não-Cucumber) em modo **headed** com gravação de vídeo habilitada. Usa o reporter de lista.

```bash
yarn test:pw:headed:video
```

### `yarn test:pw:headless:video`

Executa apenas os testes Playwright (não-Cucumber) em modo **headless** com gravação de vídeo habilitada. Usa o reporter de lista.

```bash
yarn test:pw:headless:video
```

### `yarn test:report`

Abre o último relatório HTML do Playwright usando o servidor `show-report` embutido na porta `9324`.

```bash
yarn test:report
```

---

## Docker

Execução de testes baseada em container. Para informações detalhadas, veja [Guia de Docker](docker.md).

### `yarn docker:build`

Constrói (ou reconstrói) imagens de container Docker para todos os serviços (playwright, cucumber, api). Execute após atualizar `package.json` ou o Dockerfile.

```bash
yarn docker:build
```

### `yarn docker:up`

Inicia todos os containers em modo interativo. Os containers permanecem rodando até você pressionar `Ctrl+C` ou executar `docker down`.

```bash
yarn docker:up
```

### `yarn docker:down`

Para e remove todos os containers e redes associadas.

```bash
yarn docker:down
```

### `yarn docker:logs`

Faz stream de logs ao vivo de todos os containers rodando. Pressione `Ctrl+C` para sair.

```bash
yarn docker:logs
```

### `yarn docker:test:pw:video`

Executa testes Playwright dentro do Docker com gravação de vídeo habilitada. Vídeos são salvos em `./reports/playwright/`.

```bash
yarn docker:test:pw:video
```

### `yarn docker:test:cucumber:video`

Executa testes Cucumber dentro do Docker com gravação de vídeo habilitada. Vídeos e relatórios são salvos em `./test-results/` e `./cucumber-reports/`.

```bash
yarn docker:test:cucumber:video
```

### `yarn docker:test:api:video`

Executa testes de API dentro do Docker. Relatórios são salvos em `./allure-results/`.

```bash
yarn docker:test:api:video
```

### `yarn docker:compose`

Wrapper genérico para comandos `docker compose`. Útil para operações avançadas.

```bash
# Listar containers rodando
yarn docker:compose ps

# Executar um comando dentro de um container rodando
yarn docker:compose exec playwright /bin/sh

# Visualizar logs de um serviço específico
yarn docker:compose logs cucumber
```

---

## Filtro por Tags

Qualquer comando Cucumber aceita `--tags` para filtrar cenários. Exemplos:

```bash
# Executar apenas testes smoke
yarn test:cucumber:no-workers:headless:video --tags "@smoke"

# Executar apenas testes SWAPI
yarn test:cucumber:no-workers:headless:video --tags "@swapi"

# Excluir testes smoke
yarn test:cucumber:no-workers:headless:video --tags "not @smoke"

# Combinar filtros
yarn test:cucumber:no-workers:headless:video --tags "@api and @smoke"
```
