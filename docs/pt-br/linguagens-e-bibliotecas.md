# Linguagens e Bibliotecas

Este documento descreve as linguagens, frameworks e bibliotecas utilizadas neste projeto, e o papel que cada uma desempenha.

---

## Linguagens

### TypeScript
A linguagem principal do projeto. TypeScript é um superset tipado do JavaScript que compila para JS puro. Oferece verificação estática de tipos, melhor suporte em IDEs e ajuda a detectar bugs em tempo de desenvolvimento e não em tempo de execução. Todos os arquivos de teste, page objects, step definitions e arquivos de configuração são escritos em TypeScript.

### Gherkin
Uma linguagem de texto puro usada para escrever arquivos de feature (`.feature`). Descreve cenários de teste em um formato legível por humanos usando a sintaxe `Dado / Quando / Então`. Funciona como uma ponte entre os requisitos de negócio e os testes automatizados.

---

## Frameworks Principais de Teste

### @playwright/test
O principal framework de testes end-to-end. O Playwright controla navegadores reais (Chromium, Firefox, WebKit) com uma API poderosa para interações, assertivas, interceptação de rede e muito mais. Gerencia o ciclo de vida dos testes, paralelismo, retentativas e reporters embutidos.

### @cucumber/cucumber
Um framework de BDD (Behavior-Driven Development) que interpreta arquivos Gherkin `.feature` e mapeia cada step para step definitions em TypeScript. Permite que cenários escritos em linguagem natural sejam executados como testes automatizados.

---

## Relatórios

### allure-cucumberjs
Camada de integração entre o Cucumber e o motor de relatórios Allure. Coleta os resultados dos testes do Cucumber e os gera no formato Allure.

### allure-js-commons
Utilitários e tipos compartilhados usados internamente pelas integrações do Allure. Fornece a API base para anexar metadados, labels, steps e attachments aos resultados dos testes.

### allure-commandline
Ferramenta de linha de comando usada para gerar (`allure generate`) e servir (`allure serve`) o relatório HTML do Allure a partir dos arquivos de resultado coletados.

---

## Formatadores de Saída

### @cucumber/pretty-formatter
Um formatter do Cucumber que exibe os nomes dos cenários, status dos steps e saída dos testes no terminal em um formato legível e colorido durante a execução.

### @cucumber/messages
Tipos TypeScript e utilitários para trabalhar com o protocolo interno de mensagens do Cucumber. Usado internamente por outros pacotes do Cucumber e pela integração com o Allure.

---

## Validação

### ajv
Um validador de JSON Schema. Usado neste projeto para validar a estrutura das respostas de API contra schemas definidos, garantindo que a API retorne o formato de dados esperado.

---

## Qualidade de Código

### eslint
Uma ferramenta de análise estática que identifica e reporta padrões no código JavaScript/TypeScript. Configurado com regras específicas para TypeScript para garantir estilo consistente e detectar erros comuns.

### typescript-eslint
Plugin e parser do ESLint que permite ao ESLint entender a sintaxe do TypeScript e aplicar regras de lint específicas para TypeScript.

### @eslint/js
Conjunto oficial de regras JavaScript recomendadas do ESLint.

### globals
Fornece listas de variáveis globais conhecidas (globals do browser, do Node.js, etc.) usadas para configurar os ambientes do ESLint sem gerar falsos positivos.

### prettier
Um formatador de código opinativo. Formata automaticamente arquivos TypeScript, JavaScript e de feature para um estilo consistente. Integrado ao ESLint via `eslint-config-prettier`.

### eslint-config-prettier
Desabilita as regras de formatação do ESLint que entrariam em conflito com o Prettier, para que as duas ferramentas funcionem juntas sem produção de saídas contraditórias.

### prettier-plugin-gherkin
Um plugin do Prettier que estende o suporte de formatação automática para arquivos `.feature` escritos em sintaxe Gherkin.

---

## Ambiente e Configuração

### dotenv
Carrega variáveis de ambiente de um arquivo `.env` para o `process.env`. Usado para gerenciar configurações específicas de ambiente, como URLs base e credenciais, sem hardcode nos arquivos fonte.

---

## Runtime e Ferramentas

### tsx
Um executor de TypeScript para Node.js. Permite rodar arquivos `.ts` diretamente sem uma etapa de compilação separada, usado em scripts de configuração e utilitários.

### jiti
Um loader de TypeScript/ESM em runtime para Node.js. Permite importar módulos TypeScript dinamicamente em tempo de execução, útil para carregar arquivos de configuração (ex.: config do Cucumber) como TypeScript nativo.

### typescript
O compilador TypeScript em si (`tsc`). Fornece verificação de tipos, suporte ao language server e compila TypeScript para JavaScript quando necessário.

### @types/node
Definições de tipos TypeScript para os módulos internos do Node.js (ex.: `fs`, `path`, `process`). Permite o uso seguro de tipos das APIs do Node.js no código TypeScript.

---

## Gerenciador de Pacotes

### Yarn (v4 — Berry)
O gerenciador de pacotes usado para instalar e gerenciar todas as dependências do projeto. O Yarn v4 utiliza o modo Plug'n'Play (PnP) ou o linker node_modules e é configurado via `.yarnrc.yml`.
