# Configuração (Prática)

Este arquivo complementa [instalacao.md](./instalacao.md) e foca no que configurar, por que isso importa e como validar cada ajuste.

## 1) Variáveis de ambiente (`.env`)

Baseline recomendado:

```properties
BASE_URL=https://automationteststore.com/
TEST_USERNAME=tester_champion
TEST_PASSWORD=123123
FEATURE_LOCALE=pt-br
```

Significado:

- `BASE_URL`: URL base da aplicação para navegação Playwright/helpers
- `TEST_USERNAME` / `TEST_PASSWORD`: credenciais usadas nos cenários de login
- `FEATURE_LOCALE`: locale para carga de feature/step (`pt-br` ou `eng`)

## 2) Configuração do Playwright (`config/playwright.config.ts`)

Comportamento atual:

- Carrega `BASE_URL` do `.env`
- Executa dois projetos: Chromium e Firefox
- Args do Chromium:
  - `--disable-blink-features=AutomationControlled`
  - `--ozone-platform=x11`
- Firefox sem override forçado de X11 (suporte Wayland nativo)
- Artefatos:
  - `screenshot: only-on-failure`
  - `trace: on-first-retry`
  - `video`: controlado por `PW_VIDEO_MODE`

Comando para validar:

```bash
yarn test:pw:headed:video
```

## 3) Configuração do Cucumber (`config/cucumber.config.cjs`)

Comportamento atual:

- Imports:
  - `support/world.ts`
  - `support/hooks.ts`
  - steps por locale
- Descoberta de steps:
  - `steps/**/${FEATURE_LOCALE}/**/*.step.ts`
- Descoberta de features:
  - `features/**/${FEATURE_LOCALE}/**/*.feature`
- Saídas:
  - Pretty formatter
  - Relatório JSON
  - Allure

Comando para validar:

```bash
yarn test:cucumber:headless:video
```

## 4) Comportamento de scripts que impacta configuração

- Execute `test:pw:headed:video` e depois as fases do Cucumber para rodar Playwright antes do Cucumber (veja [Executando Testes](executando-testes.md))
- `allure:open` e `allure:serve` usam script de browser maximizado
- Ruído de warnings Wayland é filtrado nos scripts de Allure

## 5) Fluxo recomendado de configuração

1. Ajuste `.env`
2. Rode `yarn test:api`
3. Rode `yarn test:pw:headed:video`
4. Rode `CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 FEATURE_LOCALE=pt-br bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"` e depois com `FEATURE_LOCALE=eng`
5. Abra relatório com `yarn allure:generate && yarn allure:serve`

## 6) Erros comuns e prevenção

- `BASE_URL` incorreta:
  - Use a raiz do site (`https://automationteststore.com/`), não a rota de login
- Locale incorreto:
  - Para features em inglês, defina `FEATURE_LOCALE=eng`
- Interrupção por autocorreção do zsh:
  - `unsetopt correct correctall`
