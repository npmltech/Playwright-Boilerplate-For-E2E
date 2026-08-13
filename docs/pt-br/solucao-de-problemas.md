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

- Use `yarn allure:generate && yarn allure:serve` para gerar e servir o relatório localmente
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
- Exposto como `yarn test:prepare` (antes também disponível sob o alias `docker:clean`, removido por ser um comando idêntico com outro nome)

Verificação:

- Execute `yarn test:prepare`
- Confirme que `allure-results/`, `test-results/`, `cucumber-reports/` e `reports/` não existem mais após a limpeza

Fallback:

- Se o ambiente ainda exigir intervenção manual:
  - `sudo rm -rf allure-results test-results cucumber-reports reports allure-report cucumber-report.html cucumber-report.json cucumber.log`
  - Execute `yarn test:prepare` novamente para confirmar que a validação de limpeza passou

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
- `docker compose -f container/docker-compose.yml run --rm -e FEATURE_LOCALE=pt-br cucumber`
- `docker compose -f container/docker-compose.yml run --rm -e FEATURE_LOCALE=eng cucumber`
- `yarn docker:up`
- `yarn test:prepare`

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

## 13) Explicit waits causando instabilidade na sincronização UI

Sintoma:

- Instabilidade com variação de velocidade do browser/rede
- Falhas intermitentes perto de sleeps fixos ou waits genéricos de carregamento

Causa observada:

- Uso de waits explícitos como:
  - `page.waitForTimeout(...)`
  - `page.waitForLoadState(...)`
  - `page.waitForFunction(...)`
  - `waitForURL(...)` direto em trechos não determinísticos

Correção aplicada:

- Sincronização refatorada para assertions/polling orientados a estado:
  - `expect(locator).toBeVisible()`
  - `expect(page).toHaveURL(...)`
  - `expect.poll(...)` para carregamento dinâmico de opções
- Isso reduziu acoplamento temporal e melhorou comportamento determinístico entre browsers.

## 14) Cucumber mostra 20 cenários enquanto Allure mostra 40

Sintoma:

- Totais do Allure indicam execução dos dois locales (por exemplo 40 cenários)
- `cucumber-report.json` mostra apenas um locale (por exemplo 20 cenários)

Causa observada:

- O output legado do runner escrevia os dois locales no mesmo nome de arquivo JSON, e a segunda execução sobrescrevia a primeira.

Correção aplicada:

- Runner agora grava arquivos por locale:
  - `cucumber-report-pt-br.json`
  - `cucumber-report-eng.json`
- Adicionado comando de resumo consolidado:
  - `yarn report:cucumber:summary`

Observações:

- Se os arquivos por locale ainda não existirem, o comando de summary usa fallback para `cucumber-report.json` legado e exibe aviso.
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

## 15) Teste de login no Firefox falha — steps após o submit são pulados

Sintoma:

- `should show error with wrong credentials` falha no Firefox mas passa no Chromium.
- O alerta de erro nunca é encontrado; o teste expira após 15 s.
- O snapshot da página mostra o formulário preenchido mas sem alerta de erro visível.

Causa observada:

- `loginExpectingError()` chamava `submitButton.first().click({ force: true })`. O Firefox não dispara o evento `submit` do formulário quando o clique é forçado — o foco permanecia no campo de senha e o POST nunca era enviado.
- `toHaveURL(/rt=account\/login/)` passava imediatamente porque a URL já correspondia antes do envio, então o código avançava para verificar o alerta de erro antes que ele aparecesse.

Correção aplicada:

- Removido `{ force: true }` do clique no submit em `pages/login.page.ts` — o botão é visível e acionável, cliques forçados eram desnecessários.
- Adicionado `await this.page.waitForLoadState('domcontentloaded')` após o clique para garantir que a resposta do servidor seja recebida antes de verificar o alerta de erro.

Verificação:

- `yarn test:pw:headless:video` — todos os testes Playwright passam no Chromium e no Firefox.

## 16) Steps do Cucumber pulados após navegação — timeout no `page.goto`

Sintoma:

- Um step `Given` de navegação lança `page.goto: Timeout 30000ms exceeded, waiting until "load"`.
- Todos os steps seguintes do cenário são reportados como **skipped** (não como falhas).
- Ocorre de forma intermitente, com maior frequência em conexões lentas.

Causa observada:

- `BasePage.navigate()` chamava `page.goto(url)` sem opções, cujo comportamento padrão é `waitUntil: 'load'`.
- O evento `load` aguarda todos os recursos externos — imagens, scripts de CDN, iframes de analytics. Qualquer recurso lento ou sem resposta bloqueia a resolução até o timeout de navegação do Playwright (30 s) ser atingido.
- O timeout do step Cucumber (`CUCUMBER_TIMEOUT_MS`, padrão 60 s) é separado do timeout de navegação do Playwright (padrão 30 s), então mesmo com timeout de step alto o goto ainda expira.

Correção aplicada:

- Alterado `page.goto(url)` para `page.goto(url, { waitUntil: 'domcontentloaded' })` em `pages/base.page.ts`.
- `domcontentloaded` retorna assim que o HTML é completamente analisado, sem aguardar recursos externos.
- As asserções explícitas `toBeVisible()` / `toHaveURL()` em cada método de página confirmam que a página está utilizável antes de o step prosseguir.

Verificação:

- Cenários Cucumber de login, cadastro e navegação rodam sem steps pulados.

## 17) `allure-results/` vazia ao encadear Playwright e Cucumber manualmente

Sintoma:

- `allure-results/` não existe ou está vazia após rodar Playwright seguido de Cucumber.
- A saída do Cucumber também está ausente, mesmo que o Playwright tenha rodado.

Causa observada:

- Se as fases forem encadeadas com `&&` (por exemplo `yarn test:pw:headless:video && yarn test:cucumber:workers:headless:video:all`), quando algum teste do Playwright falha (mesmo um teste intermitente no Firefox) o shell curto-circuita e o Cucumber nunca é executado.
- `allure-results/` só é criada pelo formatter Allure do Cucumber — se o Cucumber não rodar, o diretório nunca é populado.
- Causa secundária (já corrigida): `cucumber-runner.sh` capturava `$?` após o pipe com `tee`, que sempre retorna 0, então a verificação de geração automática do Allure rodava mas o `exit` reportava sucesso mesmo com falha no Cucumber.

Correção aplicada:

- Ao encadear fases manualmente, use `;` em vez de `&&` entre Playwright e Cucumber (veja os exemplos em [Executando Testes](executando-testes.md)) — o Cucumber roda independente do exit code do Playwright.
- `cucumber-runner.sh` usa `PIPESTATUS[0]` (exit code do Cucumber) em vez de `$?` (exit code do tee), propagando-o via `exit $CUCUMBER_EXIT`.

Verificação:

- `allure-results/` é populada e `allure-report/` é gerado automaticamente mesmo quando um ou mais testes Playwright falham, desde que as fases estejam encadeadas com `;`.

## Comandos úteis

```bash
yarn test:pw:headed:video
yarn test:pw:headless:video
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 bash scripts/cucumber-runner.sh verbose
yarn test:cucumber:headless:video
yarn test:cucumber:headless:video:pt-br
yarn test:cucumber:headless:video:eng
FEATURE_LOCALE=pt-br CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 bash scripts/cucumber-runner.sh verbose
FEATURE_LOCALE=eng CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 bash scripts/cucumber-runner.sh verbose
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=0 bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=1 bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=1 FEATURE_LOCALE=pt-br bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=1 FEATURE_LOCALE=eng bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}"
yarn test:cucumber:workers:headless:video:all
yarn test:api
FEATURE_LOCALE=pt-br yarn test:api
FEATURE_LOCALE=eng yarn test:api
yarn allure:generate && yarn allure:serve
yarn allure:serve
./scripts/exclude-some-artifacts.sh
./scripts/clean-artifacts.sh
```
