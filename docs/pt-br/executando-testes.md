# Executando Testes

## Testes Playwright (sem Cucumber, com vídeo)

**Modo headed:**

```bash
yarn test:pw:headed:video
```

**Modo headless:**

```bash
yarn test:pw:headless:video
```

## Executar todos os testes (Playwright + Cucumber + API, com vídeo e saída detalhada)

Não existe mais um único script que encadeia a suíte inteira. Execute as fases diretamente:

**Modo headed (recomendado para validação local):**

```bash
yarn test:pw:headed:video
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 FEATURE_LOCALE=pt-br bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 FEATURE_LOCALE=eng bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"
yarn test:api
```

**Modo headless (ideal para CI):**

```bash
yarn test:pw:headless:video
yarn test:cucumber:workers:headless:video:all
yarn test:api
```

Se o zsh pedir autocorreção de test -> tests, execute com:

```bash
unsetopt correct correctall && yarn test:pw:headless:video
```

## Testes Cucumber (com vídeo, output sempre impresso)

### Sem workers (execução serial)

- Modo headed:

  ```bash
  CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 bash scripts/cucumber-runner.sh verbose
  ```

- Modo headless:

  ```bash
  yarn test:cucumber:headless:video
  ```

- Atalhos por locale (sem workers, headless):

  ```bash
  # Português do Brasil
  yarn test:cucumber:headless:video:pt-br

  # Apenas inglês
  yarn test:cucumber:headless:video:eng
  ```

- Atalhos por locale (sem workers, headed):

  ```bash
  # Português do Brasil
  FEATURE_LOCALE=pt-br CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 bash scripts/cucumber-runner.sh verbose

  # Apenas inglês
  FEATURE_LOCALE=eng CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 bash scripts/cucumber-runner.sh verbose
  ```

### Com workers (execução paralela de cenários)

- Modo headed (padrão 4 workers):

  ```bash
  CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"
  ```

- Modo headless (padrão 4 workers):

  ```bash
  CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=1 bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"
  ```

- Número de workers customizado:

  ```bash
  CUCUMBER_PARALLEL=6 CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 bash scripts/cucumber-runner.sh verbose --parallel "$CUCUMBER_PARALLEL"
  CUCUMBER_PARALLEL=6 CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=1 bash scripts/cucumber-runner.sh verbose --parallel "$CUCUMBER_PARALLEL"
  ```

- Atalhos por locale (headless + workers):

  ```bash
  # Português do Brasil
  CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=1 FEATURE_LOCALE=pt-br bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"

  # Apenas inglês
  CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=1 FEATURE_LOCALE=eng bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"

  # Todos os locales (pt-br + eng)
  yarn test:cucumber:workers:headless:video:all
  ```

## Apenas testes de API

```bash
# Locale padrão (pt-br)
yarn test:api

# Português (explícito)
FEATURE_LOCALE=pt-br yarn test:api

# Inglês
FEATURE_LOCALE=eng yarn test:api
```

## Debug & inspeção

**Modo debug do Playwright:**

```bash
playwright test --config=config/playwright.config.ts --debug
```

**Relatório HTML do Playwright:**

```bash
yarn test:report
```

## Resumo de relatório Cucumber

Após rodar o Cucumber (um locale ou múltiplos locales), gere um resumo consolidado:

```bash
yarn report:cucumber:summary
```

Opções úteis:

```bash
yarn report:cucumber:summary --input cucumber-reports/cucumber-report-eng.json
yarn report:cucumber:summary --input cucumber-reports --output .tmp/custom-summary.json
```

## Variáveis de ambiente

| Variável            | Padrão  | Descrição                                                   |
| ------------------- | ------- | ----------------------------------------------------------- |
| `FEATURE_LOCALE`    | `pt-br` | Seleciona locale de features e steps (`pt-br` ou `eng`)     |
| `CUCUMBER_VIDEO`    | `1`     | Habilitar (`1`) ou desabilitar (`0`) gravação de vídeo      |
| `CUCUMBER_HEADLESS` | `1`     | Executar headless (`1`) ou headed (`0`)                     |
| `CUCUMBER_PARALLEL` | `4`     | Número de workers paralelos                                 |
| `PW_VIDEO_MODE`     | —       | Modo de vídeo Playwright (`on`, `off`, `retain-on-failure`) |
