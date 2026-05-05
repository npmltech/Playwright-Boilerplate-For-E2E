# Instalacao + Configuracao Inicial

Este guia foi feito para ser pratico e ja inclui os passos essenciais de configuracao, para voce sair do clone para a primeira execucao com sucesso sem trocar de documento o tempo todo.

Para detalhes avancados, veja [configuracao.md](./configuracao.md).

## 1) Clonar repositorio

```bash
git clone <repository-url>
cd Playwright-Boilerplate-For-E2E
```

## 2) Habilitar Corepack e definir versao do Yarn

Use Corepack para garantir a versao esperada do Yarn no workspace.

```bash
corepack enable
corepack prepare yarn@4.14.0 --activate
yarn set version 4.14.0
```

Se preferir usar a versao estavel mais recente do Yarn:

```bash
yarn set version stable
```

Verifique:

```bash
yarn --version
```

## 3) Instalar dependencias e browsers do Playwright

```bash
yarn install
yarn playwright install
```

## 4) Criar `.env` (configuracao base)

Crie ou atualize o `.env` na raiz do projeto:

```properties
BASE_URL=https://automationteststore.com/
USERNAME=tester_champion
PASSWORD=123123
FEATURE_LOCALE=pt-br
```

O que cada variavel controla:

- `BASE_URL`: URL base da aplicacao usada por Playwright e hooks
- `USERNAME` / `PASSWORD`: credenciais dos cenarios de login
- `FEATURE_LOCALE`: locale para descoberta de features/steps no Cucumber (`pt-br` ou `eng`)

## 5) Entenda o comportamento de runtime (ja configurado)

Nao e necessario alterar isso para iniciar, mas e importante conhecer:

- Playwright (`config/playwright.config.ts`):
	- Usa `BASE_URL` do `.env`
	- Executa Chromium e Firefox
	- Aplica args apenas no Chromium: `--disable-blink-features=AutomationControlled`, `--ozone-platform=x11`
	- Coleta screenshot/trace/video em falhas/retentativas
- Cucumber (`config/cucumber.config.cjs`):
	- Carrega steps por locale: `steps/**/${FEATURE_LOCALE}/**/*.step.ts`
	- Carrega features por locale: `features/**/${FEATURE_LOCALE}/**/*.feature`
	- Gera saida pretty/json/allure

## 6) Primeira execucao (ordem recomendada)

Rode API primeiro (feedback rapido), depois UI:

```bash
yarn test:api
yarn test:pw:headed:video
```

Rodar fluxo completo (Playwright + Cucumber):

```bash
yarn test:all:video:prompt
```

## 7) Geracao de relatorio

```bash
yarn allure:server:report
```

Notas uteis:

- `allure:open` / `allure:serve` abrem o browser com janela maximizada
- O ruído de warning Wayland e filtrado nos scripts sem esconder falhas reais

## 8) Troubleshooting rapido

- Prompt de autocorrecao do zsh (`test` -> `tests`):

	```bash
	unsetopt correct correctall
	```

- Se login falhar de forma intermitente no Firefox, mantenha o fallback em camadas do page object (ja implementado)
- Se browser headed falhar no Linux/Wayland, mantenha os defaults atuais (Chromium forçado para X11 via launch args; Firefox com Wayland nativo)
