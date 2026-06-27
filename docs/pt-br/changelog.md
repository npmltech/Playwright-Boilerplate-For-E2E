# Registro de Alterações

Todas as mudanças relevantes neste projeto estão documentadas neste arquivo.

## 2026-06-27

### Adicionado

- `steps/web/shared/checkout.helpers.ts`: novo módulo compartilhado centralizando todas as funções auxiliares de checkout (`ensureLoggedIn`, `openCheckoutFromCart`, `proceedToConfirmPage`, `ensureProductInCart`) — elimina mais de 120 linhas de lógica duplicadas entre os arquivos de steps de checkout pt-br e eng. Ambos os arquivos de locale agora importam desta única fonte.
- `steps/web/shared/register.helpers.ts`: novo módulo compartilhado com `uniqueSuffix()` e `selectValidZone()` — elimina a duplicação entre os arquivos de steps de registro dos dois locales.

### Alterado

- **`test:all:headless:video:prompt`** e **`test:all:video:prompt`** agora executam **3 fases** em vez de 2: `[1/3] Playwright` → `[2/3] Cucumber PT-BR` → `[3/3] Cucumber ENG`. Antes, a fase Cucumber rodava apenas o locale definido em `FEATURE_LOCALE` (o que estivesse no `.env`), pulando silenciosamente o outro locale.
- **`test:cucumber:workers:headless:video:all`** refatorado: único `test:prepare` no início, depois invoca `cucumber-runner.sh` diretamente com `;` entre os locales para que o ENG sempre rode mesmo quando o PT-BR falha, e os resultados do Allure do PT-BR não são apagados antes de o ENG rodar (antes, o wrapper `:run` do segundo locale disparava um segundo `test:prepare`, deletando o output do PT-BR).
- **`scripts/cucumber-runner.sh`** agora escreve arquivos de relatório com o locale no nome (`cucumber-report-{FEATURE_LOCALE}.json`, `cucumber-report-{FEATURE_LOCALE}.html`, `cucumber-{FEATURE_LOCALE}.log`) em vez de um único `cucumber-report.json` e `cucumber.log` sobreescrevível. O comando `yarn report:cucumber:summary` já esperava esses nomes por locale e agora recebe o consolidado completo automaticamente.
- **`pages/login.page.ts` — `login()`**: removido `{ force: true }` do clique no submit (o Firefox não dispara o evento de submissão do formulário em cliques forçados); `.catch(() => {})` silenciosos em `waitUntilLoggedIn()` substituídos por `waitForLoadState('domcontentloaded')` explícito após cada tentativa de fallback, seguido de um `waitUntilLoggedIn()` final que lança um erro significativo caso o login nunca tenha ocorrido.
- **`steps/web/pt-br/login.step.ts`**, **`steps/web/eng/login.step.ts`**: removida a chamada `waitForElementVisible()` do step `When` de esqueci-a-senha — esse método assertoa `accountContainer` (widget pós-login), que não existe na página de recuperação de senha, fazendo o step sempre expirar.
- **`steps/web/pt-br/register.step.ts`**, **`steps/web/eng/register.step.ts`**:
  - Removida a segunda chamada redundante a `selectValidZone()` no final de cada step de preenchimento.
  - Removidos `countrySelect.selectOption('30')` e `selectValidZone()` do step de submit — re-selecionar o país no submit disparava um evento `change` que resetava o dropdown de zona, desfazendo silenciosamente a seleção feita no step de preenchimento.
  - Removido o `console.log` de debug esquecido no step de submit do arquivo pt-br.
  - `waitForFunction` agora passa `successFlags` junto ao `successPattern`, reconstruindo o regex no browser como `new RegExp(successPattern, successFlags)` para preservar as flags do `routePatterns.registerSuccess` original.
  - Ambos os arquivos agora importam `uniqueSuffix` e `selectValidZone` de `steps/web/shared/register.helpers.ts`.
- **`support/hooks.ts` — `AfterStep`**: screenshot capturado apenas quando `status !== 'PASSED'`. Antes era tirada uma screenshot após cada step independente do resultado, gerando N anexos PNG por cenário verde e adicionando vários segundos de overhead em suítes longas.
- **`support/helpers/hooks-helpers.ts` — `getStepKeyword()`**: agora usa um `WeakMap` para cachear o `Map<stepId, keyword>` por documento Gherkin. Antes realizava uma varredura aninhada O(filhos × steps) em cada chamada de `BeforeStep` e `AfterStep`; agora O(1) por consulta após a primeira chamada por documento.
- Todos os arquivos de steps (`login`, `register`, `checkout`, `products` — ambos os locales): removida a expressão local `const cucumberTimeoutMs = Number(process.env.CUCUMBER_TIMEOUT_MS ?? 60_000)` que estava copiada em 8 arquivos; todos agora importam e referenciam `HooksHelper.cucumberTimeoutMs`.
- **`steps/web/pt-br/checkout.step.ts`**, **`steps/web/eng/checkout.step.ts`**: reescritos para importar de `steps/web/shared/checkout.helpers.ts`; wrapper local `waitForPageReady()` removido em favor de `BasePage.waitForPageLoad()` usado dentro do módulo compartilhado.
- **Dependências atualizadas** — 14 pacotes incrementados (mantendo `@cucumber/cucumber` em 12.7.0 aguardando migração para v13):

  | Pacote | Antes | Depois |
  |---|---|---|
  | `@playwright/test` | ^1.59.0 | ^1.61.1 |
  | `allure-cucumberjs` | 3.6.0 | 3.10.1 |
  | `allure-js-commons` | 3.6.0 | 3.10.1 |
  | `allure-commandline` | ^2.38.1 | ^2.43.0 |
  | `prettier-plugin-gherkin` | ^3.1.3 | ^4.0.0 |
  | `@types/node` | ^25.5.0 | ^26.0.0 |
  | `eslint` | ^10.1.0 | ^10.5.0 |
  | `typescript-eslint` | ^8.58.0 | ^8.62.0 |
  | `typescript` | ^6.0.2 | ^6.0.3 |
  | `tsx` | ^4.21.0 | ^4.22.4 |
  | `prettier` | ^3.8.1 | ^3.8.4 |
  | `globals` | ^17.4.0 | ^17.7.0 |
  | `jiti` | ^2.6.1 | ^2.7.0 |
  | `dotenv` | ^17.3.1 | ^17.4.2 |

  Browsers do Playwright reinstalados (`yarn playwright install`) após o caminho binário mudar de `firefox-1490` para `firefox-1532`.

### Corrigido

- **Step de esqueci-a-senha sempre expirava**: `waitForElementVisible()` assertava `accountContainer` (widget pós-login) após navegar para a página de recuperação, onde esse elemento nunca existe.
- **Dropdown de zona do registro resetava silenciosamente entre steps**: o step de submit re-selecionava o país, disparando um evento `change` que limpava a seleção de zona feita no step de preenchimento.
- **`login()` engolia falhas reais de submissão**: `.catch(() => {})` em `waitUntilLoggedIn()` descartava erros de redirecionamento falhado, permitindo que o código continuasse tentando com um formulário potencialmente enviado duas vezes e apresentando um timeout genérico na linha errada.
- **`waitForFunction` descartava flags do regex**: `new RegExp(source)` no contexto do browser omitia as flags do objeto `RegExp` original, podendo causar falsos negativos em URLs que só correspondem com flags como `i` (case-insensitive).
- **`test:all:*` rodava apenas um locale**: a fase Cucumber executava com o `FEATURE_LOCALE` ativo no `.env`, pulando silenciosamente os cenários do outro locale.
- **`test:cucumber:workers:headless:video:all` apagava os resultados Allure do PT-BR antes do ENG rodar**: o wrapper `:run` do ENG chamava `test:prepare`, que deletava `allure-results/` incluindo o output do PT-BR coletado na fase anterior.

### Documentação

- `docs/eng/project-structure.md`, `docs/pt-br/estrutura-do-projeto.md`: adicionado diretório `steps/web/shared/` com `checkout.helpers.ts` e `register.helpers.ts`.
- `docs/eng/reporting.md`, `docs/pt-br/relatorios.md`: adicionada seção "Geração automática após execuções Cucumber" explicando que `cucumber-runner.sh` gera `allure-report/` automaticamente ao fim de cada execução; `yarn allure:generate` manual não é mais necessário após execuções normais.
- `docs/eng/troubleshooting.md`, `docs/pt-br/solucao-de-problemas.md`: adicionadas entradas #15 (Firefox `force: true` impede submissão do formulário), #16 (steps do Cucumber pulados por timeout de `page.goto` em páginas lentas), #17 (`allure-results/` vazia porque `&&` bloqueava o Cucumber quando o Playwright falhava); seção "Comandos úteis" atualizada com 4 novos atalhos de locale sem workers.

## 2026-06-23

### Corrigido

- **Steps do login sendo pulados após submit do formulário no Firefox**: `loginExpectingError()` em `pages/login.page.ts` usava `click({ force: true })` no botão de submit. O Firefox não dispara o submit do formulário quando o clique é forçado — o foco permanece no campo de senha e o POST nunca é enviado. Como a URL já correspondia a `/rt=account/login/` antes do envio, `toHaveURL` passava imediatamente e a asserção do alerta de erro expirava após 15 s. Corrigido removendo `force: true` e adicionando `waitForLoadState('domcontentloaded')` após o clique, para que o método aguarde a resposta do servidor antes de verificar o alerta.

- **Steps do Cucumber sendo pulados após carregamento lento de página**: `BasePage.navigate()` chamava `page.goto(url)` sem opções, cujo comportamento padrão usa `waitUntil: 'load'`. Esse modo aguarda todos os recursos externos (imagens, scripts de CDN, analytics) antes de resolver. Em conexões lentas, o timeout de navegação do Playwright de 30 s era atingido antes do evento `load` disparar, causando exceção no step `Given` e marcando todos os steps seguintes como **skipped**. Corrigido usando `{ waitUntil: 'domcontentloaded' }`, que retorna assim que o HTML é analisado; as asserções de visibilidade em cada método de página garantem que a página está utilizável.

- **Seleção de zona falhando para países que não o Reino Unido** (`register.step.ts`, PT-BR e ENG): a abordagem anterior usava um XPath apontando para a opção de Cardiff, que só existe na lista de zonas do Reino Unido. Quando o país era definido como Brasil (id `30`), nenhuma opção era encontrada, a zona permanecia sem seleção e o envio do formulário falhava silenciosamente. Substituído por um loop dinâmico sobre `select.options` que seleciona a primeira opção com valor não vazio e não nulo usando `option.selected = true` e disparo do evento `change` — funciona para qualquer país.

- **Seletor `registerLocator.errorAlert` muito restrito**: correspondia apenas a `.alert.alert-error, .alert.alert-danger`, ignorando alertas com apenas a classe `.alert`. Ampliado para `.alert.alert-error, .alert.alert-danger, .alert`, consistente com `loginLocator.errorAlert`.

- **`allure-results/` vazia após `test:all:headless:video:prompt`**: o script encadeava Playwright e Cucumber com `&&`. Quando algum teste do Playwright falhava (por exemplo, o teste de login no Firefox), o encadeamento parava antes de o Cucumber rodar e `allure-results/` nunca era criada. O separador entre Playwright e Cucumber foi alterado para `;` em `test:all:headless:video:prompt` e `docker:test:all:video` — o Cucumber agora sempre roda independente do exit code do Playwright.

- **Geração automática de relatório Allure suprimida por exit code incorreto no `cucumber-runner.sh`**: o runner redirecionava a saída do `cucumber-js` para o `tee`, e `$?` capturava o exit code do `tee` (sempre 0), não do Cucumber. A verificação condicional `if ls allure-results/*-result.json` ainda era executada, mas o `exit` ao final reportava sucesso mesmo quando o Cucumber havia falhado. Corrigido com `PIPESTATUS[0]` para capturar o exit code do Cucumber antes do pipe e `exit $CUCUMBER_EXIT` para propagá-lo corretamente.

- **Vídeo gravado nos testes de API mesmo com `CUCUMBER_VIDEO=0`**: os scripts definiam `CUCUMBER_VIDEO=0` mas chamavam `yarn test:cucumber:headless:video:run`, que substituía a variável de volta para `CUCUMBER_VIDEO=1` internamente. A verificação em `hooks.ts` (`CUCUMBER_VIDEO !== '0'`) sempre recebia `1`. Corrigido fazendo `test:api`, `test:api:pt-br` e `test:api:eng` chamarem `cucumber-runner.sh` diretamente com `CUCUMBER_VIDEO=0` no prefixo, ignorando a substituição.

### Alterado

- **Limpeza agora executa antes de todo script de teste**: `yarn test:prepare` (que executa `scripts/clean-artifacts.sh`) antes era chamado apenas nos scripts sem sufixo `:run` e podia ser ignorado ao executar um script `:run` diretamente. Todos os scripts `:run` agora incluem `yarn test:prepare &&` no início. Os scripts compostos `test:all:*` foram ajustados para chamar os binários do PW e do Cucumber diretamente em vez de delegar a variantes `:run`, de forma que apenas uma limpeza é feita por execução completa (evitando a exclusão de relatórios do Playwright antes de o Cucumber gerar os seus).

- **Scripts do `package.json` reorganizados** em grupos semânticos com ordenação consistente: Qualidade de Código → Infraestrutura → Playwright → Cucumber (sem workers → com workers, headless → headed, variantes por locale) → API → Suítes combinadas → Relatórios Allure → Relatórios Cucumber → Docker.

### Adicionado

- **Atalhos por locale sem workers (headless e headed)**:
  - `test:cucumber:headless:video:pt-br` — sem workers, headless, Português do Brasil
  - `test:cucumber:headless:video:eng` — sem workers, headless, Inglês
  - `test:cucumber:headed:video:pt-br` — sem workers, headed, Português do Brasil
  - `test:cucumber:headed:video:eng` — sem workers, headed, Inglês

  Complementam as variantes por locale com workers já existentes (`test:cucumber:workers:headless:video:pt-br` / `:eng` / `:all`) e preenchem a lacuna para execuções seriais.

## 2026-06-19

### Alterado

- Estratégia de sincronização web refatorada para remover explicit waits e usar assertions orientadas a estado.
- Esperas explícitas foram substituídas nos fluxos afetados (`login`, `register`, `products`, `checkout` e `hooks`) por:
  - `expect(locator).toBeVisible()`
  - `expect(page).toHaveURL(...)`
  - `expect.poll(...)` para dados dinâmicos em dropdown
- Estabilidade melhorada ao reduzir acoplamento temporal com sleeps fixos (`waitForTimeout`) e waits genéricos (`waitForLoadState`, `waitForFunction`) em steps críticos.

### Adicionado

- Novo comando `report:cucumber:summary` para gerar resumo consolidado e colorido do Cucumber.
- O resumo agora inclui:
  - contadores por status
  - destaque de falhas
  - timestamp `Test Run` no formato `dd.mm.aaaa hh:mm`
  - artefato JSON de saída (`.tmp/cucumber-report-summary.json`)

### Relatórios

- Runner do Cucumber agora grava arquivos por locale para evitar sobrescrita entre execuções:
  - `cucumber-report-pt-br.json` / `cucumber-report-pt-br.html`
  - `cucumber-report-eng.json` / `cucumber-report-eng.html`
- O comando de summary mescla por padrão todos os arquivos `cucumber-report-*.json`.
- Fallback legado mantido: se os arquivos por locale não existirem, o comando lê `cucumber-report.json` e exibe aviso de que os totais podem refletir apenas um locale.

### Documentação

- README, comandos, execução de testes, relatórios, troubleshooting, estrutura do projeto e changelog foram atualizados em inglês e português.

## 2026-05-10

### Adicionado

- Atalhos de comando Docker em `package.json`:
  - `docker:build` — construir imagens do container
  - `docker:clean` — remover artefatos Docker com segurança por meio de um container temporário de limpeza
  - `docker:up` — iniciar todos os containers
  - `docker:down` — parar e remover containers
  - `docker:logs` — visualizar logs dos containers em tempo real
  - `docker:compose` — wrapper genérico para comandos docker-compose
  - `docker:test:pw:video` — executar testes Playwright no Docker com vídeo de evidência
  - `docker:test:cucumber:video:pt-br` — executar testes Cucumber no Docker com vídeo de evidência para Português do Brasil
  - `docker:test:cucumber:video:eng` — executar testes Cucumber no Docker com vídeo de evidência para Inglês
  - `docker:test:api:video` — executar testes de API no Docker
  - `docker:test:all:video` — executar suíte Docker completa (Playwright + Cucumber para `pt-br` e `eng`) com evidência em vídeo

### Alterado

- **Reorganizados artefatos de Docker** em uma pasta dedicada `container/`:
  - Movido `Dockerfile` para `container/Dockerfile`
  - Movido `docker-compose.yml` para `container/docker-compose.yml`
  - Movido `scripts/docker-entrypoint.sh` para `container/docker-entrypoint.sh`
  - Atualizado o path do entrypoint no Dockerfile para referenciar a nova localização
  - Adicionado `network: host` na configuração de build do compose para melhorar confiabilidade
  - Adicionado `network_mode: host` no runtime do compose para evitar falhas de bridge networking
  - Atualizado o comportamento do entrypoint Docker para preparar diretórios de artefatos graváveis em bind mounts

### Documentação

- Atualizado `docs/pt-br/estrutura-do-projeto.md` para refletir a estrutura da pasta `container/`
- Atualizado `README.md` com seção de comandos Docker (EN e PT-BR)
- Adicionados exemplos de uso de Docker na seção Quick Start
- Atualizados o guia de Docker, a referência de comandos, o README e a solução de problemas para cobrir `docker:clean`, `docker:test:cucumber:video:pt-br`, `docker:test:cucumber:video:eng`, `docker:test:all:video`, host networking e recuperação de permissões dos artefatos

## 2026-05-06

### Adicionado

- Novo script `test:cucumber:workers:headless:video:pt-br` em `package.json`: executa a suíte Cucumber com workers em modo headless com vídeo apenas no locale `pt-br` (explícito).
- Três atalhos de locale agora disponibilizados:
  - `test:cucumber:workers:headless:video:pt-br` — apenas português do Brasil
  - `test:cucumber:workers:headless:video:eng` — apenas inglês
  - `test:cucumber:workers:headless:video:all` — todos os locales em sequência

### Documentação

- Auditoria completa de toda a documentação (PT-BR e EN) para garantir que os três atalhos de locale estão presentes em todos os locais relevantes:
  - `docs/pt-br/comandos.md` e `docs/eng/commands.md`: novas seções para `:all`, `:eng` e `:pt-br`.
  - `docs/pt-br/executando-testes.md` e `docs/eng/running-tests.md`: bloco de atalhos por locale restaurado e expandido.
  - `docs/pt-br/solucao-de-problemas.md` e `docs/eng/troubleshooting.md`: três novos comandos na lista de comandos úteis.
  - `docs/pt-br/testes-de-api.md` e `docs/eng/api-testing.md`: exemplos com workers por locale adicionados.
  - `docs/pt-br/detalhes-api-swapi.md` e `docs/eng/api-swapi-tests.md`: variantes de workers por locale adicionadas.
  - `docs/pt-br/como-implementar-testes-api-do-zero.md` e `docs/eng/how-to-implement-api-tests-from-scratch.md`: exemplos com workers por locale incluídos.
  - `README.md`: atalhos por locale adicionados ao Quick Start (PT-BR e EN).

## 2026-05-05 (parte 8)

### Alterado

- Refatorada a pasta `locators/` para separar por tipo de artefato:
  - Seletores de UI browser movidos para `ui/locators/` (checkout, login, products, register)
  - Endpoints de API movidos para `api/endpoints/` (api-swapi)
- Atualizados todos os imports nos arquivos afetados:
  - `steps/web/{eng,pt-br}/*.step.ts` (checkout, login, products, register)
  - `pages/login.page.ts`
  - `tests/e2e/login.spec.ts`

### Documentação

- Documentação da estrutura do projeto (EN/PT-BR) atualizada para refletir o novo layout `ui/locators/` e `api/endpoints/`.
- Guias how-to (EN/PT-BR) atualizados com os novos caminhos de subpasta de locators em exemplos de código e checklists.
- Documentação de testes de API (EN/PT-BR) atualizada para referenciar `api/endpoints/api-swapi.endpoint.ts`.

## 2026-05-05 (parte 7)

### Alterado

- Refatorada a estrutura dos scripts de paralelismo por feature do Cucumber para explicitar os limites de orquestração:
  - `scripts/run-cucumber-features-parallel.mjs` -> `scripts/cucumber/run-features-parallel.mjs`
  - `scripts/parallel_exec/*` -> `scripts/cucumber/parallel/*`
- Imports internos do entrypoint de execução paralela atualizados para a nova estrutura de pastas.

### Documentação

- Documentação da estrutura do projeto (EN/PT-BR) atualizada para refletir o novo layout `scripts/cucumber/parallel`.

## 2026-05-05 (parte 6)

### Adicionado

- Adicionado `scripts/open-maximized.sh`: detecta o browser instalado (Chrome → Chromium → Firefox → fallback xdg-open) e abre URLs maximizadas via `--start-maximized` / `--maximized`.

### Alterado

- `allure:open` e `allure:serve` agora definem `BROWSER='bash scripts/open-maximized.sh'` para que o relatório Allure abra em browser maximizado.
- Forçamento X11 do Chromium movido de variáveis de ambiente shell para args de launch no `playwright.config.ts` (`--ozone-platform=x11`).
- Removidos `OZONE_PLATFORM=x11` e `WAYLAND_DISPLAY=` dos scripts de testes headed (`test:pw:headed:video`, `test:cucumber:headed:video`, `test:cucumber:workers:headed:video`): Firefox usa Wayland nativamente; Chromium é forçado ao X11 via arg na config.
- Scripts do `package.json` reordenados alfabeticamente.

### Corrigido

- Corrigida falha de launch headed do Chromium: `--ozone-platform=x11` precisa estar nos `args` de launch, não no ambiente shell.
- Corrigida falha de launch headed do Firefox: limpar `WAYLAND_DISPLAY` no shell quebrava o XWayland (`:1` depende do compositor Wayland); Firefox agora usa suporte Wayland nativo.

### Documentação

- Atualizada documentação de relatórios (EN/PT-BR) para documentar comportamento de browser maximizado.
- Atualizada documentação de configuração (EN/PT-BR) para mencionar `--ozone-platform=x11` nos args de launch do Chromium.
- Adicionada entrada de troubleshooting #14 (EN/PT-BR): falhas de launch headed do Chromium e Firefox no Wayland.

## 2026-05-05 (parte 5)

### Adicionado

- Adicionados scripts de suíte completa com vídeo e saída verbosa:
  - `test:all:video:prompt`
  - `test:all:headless:video:prompt`
  - `test:all:video` (alias)

### Alterado

- `allure:serve` atualizado para filtrar ruído recorrente de warnings do Wayland, alinhando o comportamento já usado em `allure:open`.
- Argumento específico de Chromium (`--disable-blink-features=AutomationControlled`) movido para o projeto Chromium apenas.

### Corrigido

- Corrigidas falhas intermitentes de login no Firefox causadas por comportamento não determinístico no submit do formulário.
- Fluxo de login reforçado com fallback em camadas para submit e assertions mais robustas para URL de conta e alertas de erro.

### Documentação

- Atualizadas as documentações de execução de testes e troubleshooting em inglês e português para incluir:
  - comandos de suíte completa
  - workaround para autocorreção do zsh
  - notas de estabilidade do login no Firefox
  - notas sobre comportamento Allure com Wayland/X11

## 2026-05-05 (parte 4)

### Adicionado

- Adicionados cenários de validação de schema SWAPI com AJV em ambos os locales de API:
  - `features/api/eng/api-swapi.feature`
  - `features/api/pt-br/api-swapi.feature`
- Adicionada a peer dependency explícita `@cucumber/messages` para atender os requisitos do formatter/reporting no Yarn 4

### Alterado

- Os steps de API SWAPI agora validam o array completo de filmes contra um JSON Schema usando AJV em:
  - `steps/api/eng/api-swapi.step.ts`
  - `steps/api/pt-br/api-swapi.step.ts`
- O manifesto do pacote foi alinhado ao toolchain atual:
  - pacotes usados apenas na execução de testes foram movidos para `devDependencies`
  - dependências e scripts foram reordenados alfabeticamente para manter consistência

### Documentação

- Atualizado `README.md` para refletir setup com Yarn 4 + Corepack, comandos atuais de filtro por tags e o cenário de schema com AJV
- Expandido `README.md` com o fluxo correto de instalação do Yarn para Windows, Linux e macOS, incluindo `yarn set version`
- Atualizado `API_SWAPI_TESTS.md` para documentar a validação por JSON Schema e a peer dependency explícita `@cucumber/messages`
- Atualizado `troubleshooting.md` com orientação sobre peer dependency no Yarn e notas sobre a validação AJV

## 2026-05-05

### Adicionado

- Engine de execução paralela por feature (`scripts/run-cucumber-features-parallel.mjs`) com os módulos:
  - `scripts/parallel_exec/feature-runner.mjs`
  - `scripts/parallel_exec/file-discovery.mjs`
  - `scripts/parallel_exec/import-args-builder.mjs`
  - `scripts/parallel_exec/parallel-feature-executor.mjs`
  - `scripts/parallel_exec/report-directory-manager.mjs`
- Suporte multilíngue para arquivos de feature em `features/eng/` e `features/pt-br/`:
  - `login.feature`, `register.feature`, `products.feature`, `checkout.feature`
  - **NOVO:** `api-swapi.feature` — Testes de integração da API Star Wars (bilíngues)
- Novos arquivos de locators em `locators/`:
  - `ui/locators/login.locator.ts`, `ui/locators/register.locator.ts`, `ui/locators/products.locator.ts`, `ui/locators/checkout.locator.ts`
  - **NOVO:** `api-swapi.endpoint.ts` — Endpoints do SWAPI e propriedades de filmes
- Novos arquivos de definição de steps:
  - `steps/checkout.step.ts`, `steps/products.step.ts`
  - **NOVO:** `steps/api-swapi.step.ts` — Steps de API bilíngues com implementação nativa de Fetch
- `config/routes.ts` para centralizar as constantes de rotas da aplicação.
- Suporte a gravação de vídeo para execuções Cucumber via variáveis de ambiente.
- Modo de vídeo configurável para execuções Playwright via variável `PW_VIDEO_MODE`.
- **NOVO:** Documentação abrangente de testes de API (`API_SWAPI_TESTS.md`)

### Alterado

- **Scripts npm simplificados** — consolidados em 8 comandos de teste principais:
  - `test:pw:headed:video` — testes Playwright, modo headed, com vídeo
  - `test:pw:headless:video` — testes Playwright, modo headless, com vídeo
  - `test:cucumber:no-workers:headed:video` — Cucumber serial, headed, com vídeo
  - `test:cucumber:no-workers:headless:video` — Cucumber serial, headless, com vídeo
  - `test:cucumber:workers:headed:video` — Cucumber paralelo (4 workers por padrão), headed, com vídeo
  - `test:cucumber:workers:headless:video` — Cucumber paralelo, headless, com vídeo
  - Todas as variantes de Cucumber incluem saída verbosa (passos sempre impressos no stdout)
  - Gravação de vídeo sempre ativada nos novos comandos; configurável via `PW_VIDEO_MODE` e `CUCUMBER_VIDEO`
- Relatório Allure unificado:
  - `allure:server:report` — novo comando principal para gerar e servir o relatório em conjunto
  - `allure:serve` — ainda disponível para modo servidor isolado
- **Scripts legados removidos** para reduzir confusão:
  - Removidos: `test:go`, `test:headed`, `cucumber`, `cucumber:headed`, `cucumber:verbose`, `cucumber:quiet`, `cucumber:login`, `cucumber:register`, `cucumber:parallel:scenarios`, `cucumber:parallel:features`, `allure:report`, `allure:report:headless`, `allure:report:headed`
- Suporte de local de feature via variável de ambiente `FEATURE_LOCALE` (padrão: `pt-br`)
- Contagem de workers do Cucumber controlada via `CUCUMBER_PARALLEL` (para execuções serial) e `CUCUMBER_FEATURE_WORKERS` (para execuções feature-paralelo)
- Hooks aprimorados para capturar vídeo em execuções Cucumber quando ativado
- Configuração Playwright agora respeita `PW_VIDEO_MODE` para configuração dinâmica de vídeo
- Configuração Cucumber atualizada para carregar `api-swapi.step.ts`
- `scripts/cucumber-runner.sh` atualizado para importar definições de step de API

### Melhorado

- Atualizado support/hooks.ts para suportar gravação de vídeo opcional via variável de ambiente
- Atualizado config/playwright.config.ts para suportar modo de vídeo controlado por variável de ambiente
- Atualizado README.md com:
  - Novos comandos de teste simplificados
  - Estrutura de projeto incluindo features multilíngues, locators e módulos de execução paralela
  - Seção de testes de API com exemplos do SWAPI
  - Exemplos da estratégia de tags atualizados com tags @api e @swapi
- Atualizado README.md para documentar as variáveis de ambiente `FEATURE_LOCALE`, `CUCUMBER_PARALLEL` e `PW_VIDEO_MODE`

### Documentação

- Criado [api-swapi-tests.md](../eng/api-swapi-tests.md) com guia abrangente de testes de API
- Seção "Running Tests" do README.md atualizada com exemplos claros para todos os 8 cenários de teste
- Seção "Reporting" do README.md atualizada para documentar `allure:server:report` como fluxo principal
- Estrutura de projeto do README.md atualizada para incluir features multilíngues, locators, módulos de execução paralela e testes de API
- Índice do README.md atualizado para incluir seção de testes de API
- CHANGELOG.md atualizado para refletir consolidação de scripts, melhorias de gravação de vídeo e adições de testes de API

---

## 2026-05-05 (parte 2)

### Adicionado

- Scripts de atalho `test:api`, `test:api:pt-br` e `test:api:eng` para rodar testes de API sem abrir browser
- Carregamento de steps por locale: steps separados em `steps/eng/` e `steps/pt-br/`
  - `steps/pt-br/login.step.ts`, `register.step.ts`, `products.step.ts`, `checkout.step.ts`, `api-swapi.step.ts`
  - `steps/eng/login.step.ts`, `register.step.ts`, `products.step.ts`, `checkout.step.ts`, `api-swapi.step.ts`
- Removidos arquivos de step mistos no topo (`steps/*.step.ts`)

### Corrigido

- Cenários de API (tag `@api`) não sobem mais instância de browser — `support/hooks.ts` detecta a tag e pula a inicialização do browser
- Corrigido timeout `page.waitForFunction` em cenários de API — verificações de screenshot e prontidão da página só executam quando a página existe e saiu de `about:blank`
- Corrigido formato de resposta do SWAPI: `swapi.info/api/films` retorna array direto, não `{ results: [] }` — interface `SwapiFilm[]` e todos os validadores de resposta atualizados

### Alterado

- `config/cucumber.config.cjs` agora carrega `./steps/${FEATURE_LOCALE}/**/*.step.ts` dinamicamente por locale
- `scripts/cucumber-runner.sh` agora importa steps de `steps/${FEATURE_LOCALE}/**/*.step.ts`
- `support/world.ts` — `getColorizedLog()` estendido para aceitar todas as cores ANSI (`blue`, `green`, `red`, `yellow`) além de `cyan` e `gray`

### Documentação

- Atualizado `troubleshooting.md` com entradas para: carregamento de steps por locale, correção de browser em API, correção de array SWAPI, e comandos úteis atualizados
- Atualizado `API_SWAPI_TESTS.md` com formato de resposta correto (array) e referências dos arquivos de step por locale
- Atualizado `README.md` com estrutura de projeto refletindo as pastas `steps/eng/` e `steps/pt-br/`

---

## 2026-05-05 (parte 3)

### Adicionado

- Todos os arquivos de feature agora declaram o idioma Gherkin via cabeçalho:
  - `# language: en` em todos os arquivos em `features/**/eng/`
  - `# language: pt` em todos os arquivos em `features/**/pt-br/`

### Alterado

- Features e steps reorganizados de pastas de locale planas para hierarquia por tipo:
  - `features/api/<locale>/` — features de API pura
  - `features/web/<locale>/` — features de browser
  - `steps/api/<locale>/` — steps de API pura
  - `steps/web/<locale>/` — steps de browser
- Globs do config e do runner atualizados de `steps/${FEATURE_LOCALE}/**` para `steps/**/${FEATURE_LOCALE}/**`
- Scripts `test:api`, `test:api:pt-br`, `test:api:eng` agora passam `CUCUMBER_VIDEO=0` — sem artefatos de vídeo em execuções de API
- Cenário SWAPI "Validar estrutura de dados do filme" convertido para `Esquema do Cenário` com tabela `Exemplos` (5 propriedades), substituindo 5 steps individuais por um único step parametrizado `o primeiro filme deve ter a propriedade {string}`

### Documentação

- Atualizado `README.md`: árvore de estrutura do projeto e seção de API Testing refletem nova hierarquia `api/` + `web/`
- Atualizado `API_SWAPI_TESTS.md`: caminhos corrigidos e abordagem de Scenario Outline documentada
- Atualizado `troubleshooting.md` §0: expandido para cobrir estrutura de pastas por tipo e globs atualizados

---

## 2026-04-02

### Adicionado

- Novo comando de relatório Allure compatível com ambientes headless:
  - `yarn allure:report:headless`

### Documentação

- Atualizado o README.md na seção de relatórios para documentar o fluxo Allure no Linux/headless.
- Expandido o troubleshooting.md com o sintoma de falha no Wayland e quando usar `allure:report:headless` em vez dos comandos que abrem o browser.

### Corrigido

- Melhoria na abertura do relatório Allure no Linux, documentando e preservando os scripts com X11 forçado para ambientes onde o Wayland falha.

---

## 2026-04-01

### Alterado

- Dependências atualizadas para as versões mais recentes:
  - `@playwright/test`: `^1.58.2` → `^1.59.0`
  - `@types/node`: `^25.3.0` → `^25.5.0`
  - `allure-commandline`: `^2.37.0` → `^2.38.1`
  - `eslint`: `^10.0.3` → `^10.1.0`
  - `typescript`: `^5.9.3` → `^6.0.2` _(versão principal — major bump)_
  - `typescript-eslint`: `^8.57.0` → `^8.58.0`

### Documentação

- Revisão geral da documentação para garantir consistência com o estado atual do projeto.
- README.md atualizado com a estrutura do projeto incluindo `register.feature`, `register.step.ts` e todos os arquivos de `config/` (`kill-port.js`, `patch-playwright-websocket.js`, `cucumber.config.js.deprecated`, `environments/`).
- README.md atualizado para documentar `support/helpers/hooks-helpers.ts` e `support/utils/color-utils.ts`.
- Seção de scripts Cucumber do README.md atualizada para incluir `cucumber:headed`, `cucumber:login` e `cucumber:register`.
- Seção de relatórios Allure do README.md atualizada para incluir `allure:report:headed`.
- Seção de estratégia de tags do README.md atualizada para cobrir as tags de `register.feature` e exemplos de labels.
- Corrigidas seções `### Adicionado`, `### Alterado` e `### Corrigido` duplicadas na entrada de 2026-03-31 do CHANGELOG.

---

## 2026-03-31

### Adicionado

- Tags Cucumber e labels Allure nos cenários da feature de login:
  - Tags Cucumber: @login, @authentication, @smoke, @regression
  - Labels Allure via tags: severity, suite, feature
- Capturas de tela por step nos hooks do Cucumber.
- Scripts utilitários para artefatos:
  - `scripts/exclude-some-artifacts.sh`
  - `scripts/clean-artifacts.sh`
- Guia de troubleshooting do projeto:
  - `troubleshooting.md`
- Documentação do alvo de testes Automation Test Store:
  - `about_automationteststore.md`
- Feature file dedicada para registro de usuário:
  - `features/register.feature`
- Novos step definitions para cenários de registro e recuperação de senha:
  - `steps/register.step.ts`
- Scripts de conveniência para executar subconjuntos de features por tag:
  - `cucumber:login`
  - `cucumber:register`

### Alterado

- Alvo de testes migrado para o Automation Test Store.
- `BASE_URL` atualizada para:
  - `https://automationteststore.com/`
- Credenciais atualizadas nos dados padrão de ambiente e usuário:
  - `USERNAME=tester_champion`
  - `PASSWORD=123123`
- Locators e navegação de login remapeados para o formulário do Automation Test Store:
  - `#loginFrm_loginname`
  - `#loginFrm_password`
  - `#loginFrm button[title="Login"]`
- Asserções de sucesso e negativas atualizadas nos steps do Cucumber e na spec do Playwright.
- Execução no Firefox restaurada nos projetos do Playwright.
- Tempo de captura de tela ajustado para aguardar elementos totalmente renderizados.
- README atualizado para refletir o alvo atual, scripts, fluxo de relatórios e notas de fluxo de trabalho.
- Cenários de autenticação não relacionados ao login movidos de `login.feature` para `register.feature`.
- Carregamento do Cucumber atualizado para incluir steps de registro nas configurações ativa e deprecada.
- Importações do runner do Cucumber atualizadas para carregar os step definitions de registro.
- Tratamento de argumentos do script aprimorado para repassar filtros como `--tags`.

### Corrigido

- Aviso de runtime no Allure corrigido usando a API nativa de anexo do Cucumber:
  - `this.attach(buffer, 'image/png')`
- Conflitos de locator em modo estrito corrigidos nas asserções de logout.
- Problema de portabilidade de shell no script de exclusão de artefatos corrigido (compatibilidade POSIX sh).
- Ruído de avisos Wayland/X11 no fluxo de abertura do Allure reduzido.
- Formatação de tag Gherkin inválida em `register.feature` corrigida (remoção de espaços nos valores de tag).

### Documentação

- Documentação do alvo anterior substituída pela documentação atual do Automation Test Store.
- Problemas observados e soluções centralizados em `troubleshooting.md`.
