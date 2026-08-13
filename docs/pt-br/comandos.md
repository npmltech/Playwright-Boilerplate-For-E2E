# Referência de Comandos

Todos os comandos disponíveis no `package.json`, organizados por categoria. A superfície de scripts foi reduzida para 20 comandos essenciais; combinações menos comuns estão documentadas abaixo como comandos crus que você pode executar diretamente (ou passar `--tags`, `FEATURE_LOCALE`, etc. inline).

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

Para gerar e servir em um único passo (antes `allure:server:report`):

```bash
yarn allure:generate && yarn allure:serve
```

### `yarn report:cucumber:summary`

Gera um resumo compacto e colorido a partir dos relatórios JSON do Cucumber. Por padrão, procura recursivamente em `cucumber-reports/` arquivos por locale (por exemplo `cucumber-report-pt-br.json` e `cucumber-report-eng.json`) e saídas de worker (por exemplo `worker-1/*.json`) para mesclar os totais.

Quando os arquivos por locale/worker não existem, o comando usa fallback para o legado `cucumber-report.json` e exibe aviso, indicando que os totais podem representar apenas um locale. Para gerar o consolidado completo, execute antes `yarn test:cucumber:workers:headless:video:all`.

```bash
yarn report:cucumber:summary

# Opcional: resumir um arquivo específico
yarn report:cucumber:summary --input cucumber-reports/cucumber-report-eng.json

# Opcional: resumir todos os arquivos de um diretório customizado
yarn report:cucumber:summary --input cucumber-reports --output .tmp/cucumber-report-summary.json
```

---

## Formatação de Código

### `yarn format`

Formata todos os arquivos do projeto usando o Prettier, incluindo arquivos `.feature` (o plugin Gherkin está registrado globalmente em `.prettierrc`, então não existe mais um comando `format:features` separado). Reescreve os arquivos no lugar.

```bash
yarn format
```

### `yarn format:check`

Verifica se todos os arquivos — incluindo `.feature` — estão de acordo com as regras de formatação do Prettier sem escrever nenhuma alteração. Encerra com código de erro se algum arquivo não estiver formatado corretamente. Útil em CI.

```bash
yarn format:check
```

Para rodar as correções automáticas do ESLint e a formatação do Prettier juntas em uma única passagem (antes `format:lint`):

```bash
yarn lint:fix && yarn format
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

## Testes — Preparação

### `yarn test:prepare`

Executa a limpeza pré-teste via `scripts/clean-artifacts.sh` e valida que os caminhos de artefatos gerados foram realmente removidos. Todos os scripts de teste chamam isso automaticamente antes de executar, mas você também pode invocar diretamente quando necessário.

```bash
yarn test:prepare
```

---

## Testes — Suíte Completa

Não existe mais um único script que encadeia a suíte inteira com um rótulo por fase. Execute as três fases diretamente:

```bash
# Headless + vídeo
yarn test:pw:headless:video
yarn test:cucumber:workers:headless:video:all
yarn test:api

# Headed + vídeo
yarn test:pw:headed:video
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 FEATURE_LOCALE=pt-br bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 FEATURE_LOCALE=eng bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"
yarn test:api
```

---

## Testes — API

### `yarn test:api`

Executa apenas os testes de API (marcados com `@api`) usando o Cucumber em modo headless sem vídeo. Usa o locale definido em `FEATURE_LOCALE` (padrão do `.env`).

```bash
yarn test:api
```

Para um locale específico, sobrescreva `FEATURE_LOCALE` inline (antes `test:api:eng` / `test:api:pt-br`):

```bash
FEATURE_LOCALE=eng yarn test:api
FEATURE_LOCALE=pt-br yarn test:api
```

---

## Testes — Cucumber

### `yarn test:cucumber:headless:video`

Executa a suíte completa do Cucumber em modo de browser **headless** com gravação de vídeo habilitada, usando o locale de `FEATURE_LOCALE` (padrão do `.env`). Usa saída verbosa.

```bash
yarn test:cucumber:headless:video
```

### `yarn test:cucumber:headless:video:pt-br`

Executa a suíte Cucumber em modo **headless** com vídeo, usando o locale Português do Brasil (`FEATURE_LOCALE=pt-br`).

```bash
yarn test:cucumber:headless:video:pt-br
```

### `yarn test:cucumber:headless:video:eng`

Executa a suíte Cucumber em modo **headless** com vídeo, usando o locale inglês (`FEATURE_LOCALE=eng`).

```bash
yarn test:cucumber:headless:video:eng
```

### Modo headed

Não existe mais um script dedicado para Cucumber headed; execute o comando subjacente diretamente (`CUCUMBER_HEADLESS=1` em `test:cucumber:headless:video` está fixo em `package.json`, então exportar `CUCUMBER_HEADLESS=0` antes não vai sobrescrever — chame o script do runner diretamente):

```bash
# Locale padrão, headed, com vídeo
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 bash scripts/cucumber-runner.sh verbose

# Um locale específico, headed, com vídeo
FEATURE_LOCALE=pt-br CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 bash scripts/cucumber-runner.sh verbose
FEATURE_LOCALE=eng CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 bash scripts/cucumber-runner.sh verbose
```

### `yarn test:cucumber:workers:headless:video:all`

Executa a suíte Cucumber com workers paralelos em modo **headless** com vídeo para **todos os locales suportados**, em sequência (`pt-br` e depois `eng`). O número de workers padrão é 4 e pode ser sobrescrito com `CUCUMBER_PARALLEL`.

```bash
yarn test:cucumber:workers:headless:video:all
# ou com contagem customizada de workers:
CUCUMBER_PARALLEL=8 yarn test:cucumber:workers:headless:video:all
```

Para um único locale com workers, ou modo headed com workers, execute o script do runner diretamente:

```bash
# Um locale, headless, com workers
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=1 FEATURE_LOCALE=pt-br bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=1 FEATURE_LOCALE=eng bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"

# Headed, com workers
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"
```

---

## Testes — Playwright

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

Para o modo de depuração interativo (Playwright Inspector), execute o comando subjacente diretamente:

```bash
playwright test --config=config/playwright.config.ts --debug
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

Inicia os três containers (playwright, cucumber, api) juntos — equivalente ao antigo `docker:test:all:video`. Os containers permanecem rodando até você pressionar `Ctrl+C` ou executar `docker down`.

```bash
yarn docker:build && yarn docker:up
```

### `yarn docker:down`

Para e remove todos os containers e redes associadas.

```bash
yarn docker:down
```

Para limpar os diretórios de artefatos gerados, use `yarn test:prepare` (antes `docker:clean` executava exatamente o mesmo comando com outro nome).

Para stream de logs, executar um único serviço ou outras operações avançadas, use `docker compose` diretamente:

```bash
# Stream de logs de todos os containers rodando
docker compose -f container/docker-compose.yml logs -f

# Executar apenas o serviço Playwright (padrão: test:pw:headless:video)
docker compose -f container/docker-compose.yml run --rm playwright

# Executar apenas o serviço Cucumber para um locale específico
docker compose -f container/docker-compose.yml run --rm -e FEATURE_LOCALE=pt-br cucumber
docker compose -f container/docker-compose.yml run --rm -e FEATURE_LOCALE=eng cucumber

# Executar apenas o serviço de API
docker compose -f container/docker-compose.yml run --rm api

# Listar containers rodando / executar um comando dentro de um container / ver logs de um serviço específico
docker compose -f container/docker-compose.yml ps
docker compose -f container/docker-compose.yml exec playwright /bin/sh
docker compose -f container/docker-compose.yml logs cucumber
```

---

## Filtro por Tags

Qualquer comando Cucumber aceita `--tags` para filtrar cenários. Exemplos:

```bash
# Executar apenas testes smoke
yarn test:cucumber:headless:video --tags "@smoke"

# Executar apenas testes SWAPI
yarn test:cucumber:headless:video --tags "@swapi"

# Excluir testes smoke
yarn test:cucumber:headless:video --tags "not @smoke"

# Combinar filtros
yarn test:cucumber:headless:video --tags "@api and @smoke"
```
