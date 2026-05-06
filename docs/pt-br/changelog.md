# Registro de Alterações

Todas as mudanças relevantes neste projeto estão documentadas neste arquivo.

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
  - Seletores de UI browser movidos para `locators/web-elements/` (checkout, login, products, register)
  - Endpoints de API movidos para `locators/endpoints/` (api-swapi)
- Atualizados todos os imports nos arquivos afetados:
  - `steps/web/{eng,pt-br}/*.step.ts` (checkout, login, products, register)
  - `pages/login.page.ts`
  - `tests/e2e/login.spec.ts`

### Documentação

- Documentação da estrutura do projeto (EN/PT-BR) atualizada para refletir o novo layout `locators/web-elements/` e `locators/endpoints/`.
- Guias how-to (EN/PT-BR) atualizados com os novos caminhos de subpasta de locators em exemplos de código e checklists.
- Documentação de testes de API (EN/PT-BR) atualizada para referenciar `locators/endpoints/api-swapi.locator.ts`.

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
  - `login.locator.ts`, `register.locator.ts`, `products.locator.ts`, `checkout.locator.ts`
  - **NOVO:** `api-swapi.locator.ts` — Endpoints do SWAPI e propriedades de filmes
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
