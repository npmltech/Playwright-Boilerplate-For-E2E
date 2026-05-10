# Guia de Solução de Problemas

Este arquivo documenta os principais problemas encontrados durante a migração e estabilização, junto com as correções implementadas.

## 0) Carregamento de steps baseado em locale e estrutura de pastas por tipo

Sintoma:

- Steps ficam indefinidos após reorganizar definições em pastas de locale ou tipo

Causa observada:

- O Cucumber importava caminhos fixos que não correspondiam mais à nova estrutura de diretórios

Estrutura atual:

```
features/
  api/<locale>/*.feature
  web/<locale>/*.feature
steps/
  api/<locale>/*.step.ts
  web/<locale>/*.step.ts
```

Correção aplicada:

- Carregamento de steps segue `FEATURE_LOCALE` dinamicamente em ambas as pastas de tipo:
  - `config/cucumber.config.cjs` carrega `./steps/**/${FEATURE_LOCALE}/**/*.step.ts`
  - `scripts/cucumber-runner.sh` importa `steps/**/${FEATURE_LOCALE}/**/*.step.ts`
  - Descoberta de features: `features/**/${FEATURE_LOCALE}/**/*.feature`

Observações:

- Use `FEATURE_LOCALE=pt-br` para features em português (web + api)
- Use `FEATURE_LOCALE=eng` para features em inglês (web + api)
- Todos os arquivos de feature declaram o idioma via `# language: en` ou `# language: pt` na linha 1

## 0.1) Aviso de peer dependency no Yarn 4 para `@cucumber/messages`

Sintoma:

- `YN0002: my-playwright-project@workspace:. doesn't provide @cucumber/messages`
- `YN0086: Some peer dependencies are incorrectly met by your project`

Causa observada:

- `@cucumber/pretty-formatter` e `allure-cucumberjs` requerem `@cucumber/messages` como peer dependency
- Yarn 4 reporta o peer ausente explicitamente durante install ou validação pós-resolução

Correção aplicada:

- Adicionado `@cucumber/messages` em `devDependencies`

Verificação:

- Execute `yarn explain peer-requirements <hash>` para inspecionar a origem do aviso
- Re-execute `yarn install` e confirme que o aviso não aparece mais para `@cucumber/messages`

## 1) Timeout de navegação na página de login

Sintoma:

- Timeout em `page.goto` durante o step Given

Causa observada:

- Interação entre estratégia de espera e timeout do step

Correção aplicada:

- Aumentado timeout efetivo do step Cucumber via hooks
- Melhorado fluxo de navegação/prontidão

## 2) Timeout global não funcionando como esperado

Sintoma:

- Step ainda falhando próximo às janelas de timeout padrão

Causa observada:

- Localização/configuração do timeout não se aplicava como esperado em tempo de execução

Correção aplicada:

- Timeout centralizado no setup Cucumber em nível de hook

## 3) Aviso Allure: no test runtime is found

Sintoma:

- Mensagem: `no test runtime is found. Please check test framework configuration`

Causa observada:

- Uso direto da API de attachment do `allure-js-commons` no contexto Cucumber

Correção aplicada:

- Trocado para a API nativa de attachment do Cucumber nos hooks:
  - `this.attach(buffer, 'image/png')`
- Interceptado corretamente pelo reporter `allure-cucumberjs`

## 4) Aviso Wayland/X11 ao abrir relatório Allure

Sintoma:

- `Failed to connect to Wayland display`
- `The platform failed to initialize`

Causa observada:

- Allure tentou abrir um browser local em sessão Linux sem desktop Wayland funcionando

Correção aplicada:

- Scripts do pacote atualizados para forçar X11 e filtrar ruído de warning na saída
- Serving seguro em headless via:
  - `yarn allure:serve`

Quando usar:

- Use `yarn allure:server:report` para gerar e servir o relatório localmente
- Use `yarn allure:serve` em CI, containers, shells remotos ou sessões Linux sem desktop gráfico
- Use `yarn allure:open` somente após o relatório existir e uma sessão browser desktop estar disponível

## 5) Violação de modo strict em locator duplicado

Sintoma:

- `expect(locator).toBeVisible strict mode violation` com múltiplos links de logout

Causa observada:

- Selector matchou várias localizações no DOM

Correção aplicada:

- Narrowed do locator de assertion para visível + primeiro match

## 6) HTML carregado mas UI não totalmente renderizada para screenshots

Sintoma:

- Screenshot capturado antes de CSS/elementos visíveis estarem prontos

Causa observada:

- Timing do screenshot cedo demais no ciclo de vida do step

Correção aplicada:

- Adicionados checks de prontidão antes da captura de screenshot:
  - load state complete
  - readyState complete
  - stylesheets loaded
  - pelo menos um elemento visível presente

## 7) Cenários de API não devem abrir browser/page

Sintoma:

- Cenários API com timeout no fluxo de screenshot/prontidão do hook
- Exemplo de erro: `page.waitForFunction: Timeout 30000ms exceeded`

Causa observada:

- Hooks lançavam browser/context/page para todos os cenários, incluindo testes puramente API (`@api`)

Correção aplicada:

- `support/hooks.ts` agora detecta a tag `@api` no `Before` e pula bootstrap do browser para cenários API
- Screenshot e checks de prontidão UI só executam quando a page existe e navegou

## 8) Shape da resposta SWAPI incorreto

Sintoma:

- Step API falhou com: `Response does not contain a valid films array`

Causa observada:

- Steps esperavam `{ results: [...] }`, mas `https://swapi.info/api/films` retorna um array no nível raiz

Correção aplicada:

- Steps SWAPI agora tratam a resposta como `SwapiFilm[]`
- Validações atualizadas de `swapiResponse.results` para `swapiResponse`

## 8.1) Validação JSON Schema SWAPI com AJV

Sintoma:

- Testes de API apenas verificavam presença de alguns campos e podiam deixar escapar tipos inválidos ou datas malformadas

Causa observada:

- Verificações estruturais limitadas a assertions de existência em vez de contrato schema-level

Correção aplicada:

- Adicionado cenário AJV em ambos os locales para validar a resposta completa de filmes contra um JSON Schema
- O schema obriga campos required, tipagem inteira para `episode_id` e formato `YYYY-MM-DD` para `release_date`

Verificação:

- `FEATURE_LOCALE=pt-br yarn test:api`
- `FEATURE_LOCALE=eng yarn test:api`

## 9) Problema de portabilidade de script no shell local

Sintoma:

- `set: Illegal option -o pipefail`

Causa observada:

- Script executado com sh enquanto usava opções/sintaxe específicas do bash

Correção aplicada:

- Script convertido para sintaxe POSIX sh

## 10) Artefatos ainda visíveis após configuração de ignore

Sintoma:

- Pastas/arquivos ainda presentes localmente após script de exclusão

Causa observada:

- Regras de ignore afetam rastreamento Git, não a existência no sistema de arquivos local

Correção aplicada:

- Adicionado script de limpeza para remover artefatos gerados:
  - `scripts/clean-artifacts.sh`

## 10.1) Permission denied ao remover artefatos gerados pelo Docker

Sintoma:

- `rm: cannot remove 'allure-results/...': Permission denied`
- Erros semelhantes em `test-results/` ou `cucumber-reports/`

Causa observada:

- Algumas execuções do Docker escrevem arquivos bind-mounted de artefato com o mapeamento de usuário da imagem (`uid=1001` / `pwuser`)
- No host, esses arquivos podem não ser removíveis diretamente pelo usuário local

Correção aplicada:

- Adicionado um fluxo de limpeza compatível com Docker em `scripts/clean-artifacts.sh`
- Adicionado `yarn docker:clean` para executar a limpeza por meio de um container temporário com `--network host`

Verificação:

- Execute `yarn docker:clean`
- Confirme que `allure-results/`, `test-results/`, `cucumber-reports/` e `reports/` foram recriados sob o usuário do host

Fallback:

- Se o ambiente ainda exigir intervenção manual:
  - `sudo chown -R "$USER":"$USER" allure-results test-results cucumber-reports reports`
  - `sudo chmod -R u+rwX allure-results test-results cucumber-reports reports`

## 10.2) Bridge networking do Docker não suportado no daemon local

Sintoma:

- `failed to create endpoint ... on network bridge`
- `operation not supported` ao construir ou rodar containers

Causa observada:

- O daemon Docker local não consegue criar as interfaces bridge/veth padrão no ambiente atual

Correção aplicada:

- O build do Docker usa host networking na configuração de build do compose
- O runtime do Docker usa `network_mode: host`
- O container helper de limpeza também usa `--network host`

Verificação:

- `yarn docker:build`
- `yarn docker:test:cucumber:video`
- `yarn docker:test:all:video`
- `yarn docker:clean`

## 11) Migração de target para Automation Test Store

Mudanças aplicadas:

- `BASE_URL` atualizado para rota de login do Automation Test Store
- Locators de login remapeados para seletores `loginFrm`
- Assertions de sucesso/erro atualizadas para comportamento do site alvo
- Projeto Firefox restaurado na config do Playwright

Verificação:

- Feature de login Cucumber passando
- Spec de login Playwright passando

## 12) Cenários de login no Firefox falham de forma intermitente

Sintoma:

- Firefox falha nos cenários de login enquanto Chromium passa
- URL permanece na página de login após preencher credenciais válidas

Causa observada:

- Submit do formulário de login pode ser instável no Firefox com uma única estratégia de envio

Correção aplicada:

- Submit de login reforçado no page object com fallback em camadas:
  - clique no botão de login
  - Enter no campo de senha
  - fallback com submit nativo do formulário
- Robustez de assertions de login aumentada com route patterns centralizados e timeout explícito

## 13) zsh pede autocorreção de test -> tests

Sintoma:

- Comando fica aguardando prompt interativo: correct 'test' to 'tests' [nyae]?

Causa observada:

- Opção de autocorreção do zsh intercepta tokens do comando e pede confirmação

Correção aplicada:

- Desabilitar correção no shell atual antes de rodar scripts de teste:
  - unsetopt correct correctall

## 14) Falha de launch headed do Chromium e Firefox no Wayland

Sintoma:

- Chromium: `Failed to connect to Wayland display` → `The platform failed to initialize. Exiting.`
- Firefox: `Error: no DISPLAY environment variable specified` ou `cannot open display: :1`

Causa observada:

- Definir `OZONE_PLATFORM=x11` como variável de ambiente shell não é propagado para o processo do browser pelo Playwright; o Chromium ainda tenta Wayland e falha.
- Definir `WAYLAND_DISPLAY=` (vazio) no shell faz o XWayland (`:1`) perder o compositor Wayland como backend, causando falha no Firefox ao tentar abrir o display X11.

Correção aplicada:

- Adicionado `--ozone-platform=x11` aos `launchOptions.args` do Chromium em `config/playwright.config.ts` — o Playwright passa isso diretamente ao processo do browser.
- Removidos `OZONE_PLATFORM=x11` e `WAYLAND_DISPLAY=` de todos os scripts de testes headed — o Firefox usa suporte Wayland nativo e não precisa mais desse override.

Verificação:

- `yarn test:pw:headed:video` — todos os 4 testes passam no Chromium e Firefox.

## Comandos úteis

```bash
yarn test:all:video:prompt
yarn test:all:headless:video:prompt
yarn test:cucumber:no-workers:headed:video
yarn test:cucumber:no-workers:headless:video
yarn test:cucumber:workers:headed:video
yarn test:cucumber:workers:headless:video
yarn test:cucumber:workers:headless:video:pt-br
yarn test:cucumber:workers:headless:video:eng
yarn test:cucumber:workers:headless:video:all
yarn test:api
yarn test:api:pt-br
yarn test:api:eng
yarn allure:server:report
yarn allure:serve
./scripts/exclude-some-artifacts.sh
./scripts/clean-artifacts.sh
```
