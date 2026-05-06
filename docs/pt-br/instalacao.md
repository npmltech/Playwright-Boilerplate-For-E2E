# Instalação + Configuração Inicial

Este guia foi feito para ser prático e já inclui os passos essenciais de configuração, para você sair do clone para a primeira execução com sucesso sem trocar de documento o tempo todo.

Para detalhes avançados, veja [configuracao.md](./configuracao.md).

## 1) Clonar repositório

```bash
git clone <repository-url>
cd Playwright-Boilerplate-For-E2E
```

## 2) Habilitar Corepack e definir versão do Yarn

Use Corepack para garantir a versão esperada do Yarn no workspace.

```bash
corepack enable
corepack prepare yarn@4.14.0 --activate
yarn set version 4.14.0
```

Se preferir usar a versão estável mais recente do Yarn:

```bash
yarn set version stable
```

Verifique:

```bash
yarn --version
```

## 3) Instalar dependências e browsers do Playwright

```bash
yarn install
yarn playwright install
```

## 4) Criar `.env` (configuração base)

Crie ou atualize o `.env` na raiz do projeto:

```properties
BASE_URL=https://automationteststore.com/
USERNAME=tester_champion
PASSWORD=123123
FEATURE_LOCALE=pt-br
```

O que cada variável controla:

- `BASE_URL`: URL base da aplicação usada por Playwright e hooks
- `USERNAME` / `PASSWORD`: credenciais dos cenários de login
- `FEATURE_LOCALE`: locale para descoberta de features/steps no Cucumber (`pt-br` ou `eng`)

## 5) Entenda o comportamento de runtime (já configurado)

Não é necessário alterar isso para iniciar, mas é importante conhecer:

- Playwright (`config/playwright.config.ts`):
  - Usa `BASE_URL` do `.env`
  - Executa Chromium e Firefox
  - Aplica args apenas no Chromium: `--disable-blink-features=AutomationControlled`, `--ozone-platform=x11`
  - Coleta screenshot/trace/video em falhas/retentativas
- Cucumber (`config/cucumber.config.cjs`):
  - Carrega steps por locale: `steps/**/${FEATURE_LOCALE}/**/*.step.ts`
  - Carrega features por locale: `features/**/${FEATURE_LOCALE}/**/*.feature`
  - Gera saída pretty/json/allure

## 6) Primeira execução (ordem recomendada)

Rode API primeiro (feedback rápido), depois UI:

```bash
yarn test:api
yarn test:pw:headed:video
```

Rodar fluxo completo (Playwright + Cucumber):

```bash
yarn test:all:video:prompt
```

## 7) Geração de relatório

```bash
yarn allure:server:report
```

Notas úteis:

- `allure:open` / `allure:serve` abrem o browser com janela maximizada
- O ruído de warning Wayland é filtrado nos scripts sem esconder falhas reais

## 8) Troubleshooting rápido

- Prompt de autocorreção do zsh (`test` -> `tests`):

  ```bash
  unsetopt correct correctall
  ```

- Se login falhar de forma intermitente no Firefox, mantenha o fallback em camadas do page object (já implementado)
- Se browser headed falhar no Linux/Wayland, mantenha os defaults atuais (Chromium forçado para X11 via launch args; Firefox com Wayland nativo)
