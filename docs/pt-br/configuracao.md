# Configuracao (Pratica)

Este arquivo complementa [instalacao.md](./instalacao.md) e foca no que configurar, por que isso importa e como validar cada ajuste.

## 1) Variaveis de ambiente (`.env`)

Baseline recomendado:

```properties
BASE_URL=https://automationteststore.com/
USERNAME=tester_champion
PASSWORD=123123
FEATURE_LOCALE=pt-br
```

Significado:

- `BASE_URL`: URL base da aplicacao para navegacao Playwright/helpers
- `USERNAME` / `PASSWORD`: credenciais usadas nos cenarios de login
- `FEATURE_LOCALE`: locale para carga de feature/step (`pt-br` ou `eng`)

## 2) Configuracao do Playwright (`config/playwright.config.ts`)

Comportamento atual:

- Carrega `BASE_URL` do `.env`
- Executa dois projetos: Chromium e Firefox
- Args do Chromium:
  - `--disable-blink-features=AutomationControlled`
  - `--ozone-platform=x11`
- Firefox sem override forcado de X11 (suporte Wayland nativo)
- Artefatos:
  - `screenshot: only-on-failure`
  - `trace: on-first-retry`
  - `video`: controlado por `PW_VIDEO_MODE`

Comando para validar:

```bash
yarn test:pw:headed:video
```

## 3) Configuracao do Cucumber (`config/cucumber.config.cjs`)

Comportamento atual:

- Imports:
  - `support/world.ts`
  - `support/hooks.ts`
  - steps por locale
- Descoberta de steps:
  - `steps/**/${FEATURE_LOCALE}/**/*.step.ts`
- Descoberta de features:
  - `features/**/${FEATURE_LOCALE}/**/*.feature`
- Saidas:
  - Pretty formatter
  - Relatorio JSON
  - Allure

Comando para validar:

```bash
yarn test:cucumber:no-workers:headless:video
```

## 4) Comportamento de scripts que impacta configuracao

- `test:all:video:prompt` executa Playwright primeiro e depois Cucumber
- `allure:open` e `allure:serve` usam script de browser maximizado
- Ruído de warnings Wayland e filtrado nos scripts de Allure

## 5) Fluxo recomendado de configuracao

1. Ajuste `.env`
2. Rode `yarn test:api`
3. Rode `yarn test:pw:headed:video`
4. Rode `yarn test:all:video:prompt`
5. Abra relatorio com `yarn allure:server:report`

## 6) Erros comuns e prevencao

- `BASE_URL` incorreta:
  - Use a raiz do site (`https://automationteststore.com/`), nao a rota de login
- Locale incorreto:
  - Para features em ingles, defina `FEATURE_LOCALE=eng`
- Interrupcao por autocorrecao do zsh:
  - `unsetopt correct correctall`
