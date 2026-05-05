# Notas do Fluxo MCP

Este repositorio foi desenvolvido com um fluxo agentico com orquestracao de ferramentas no estilo MCP:

## Descoberta de contexto

- Busca de arquivos e leituras direcionadas de config, pages, steps e docs

## Ciclo seguro de mudanca

- Edicoes pequenas com patch e diagnostico apos cada atualizacao

## Verificacao em runtime

- Execucao de testes focada em cenarios/specs impactados

## Remapeamento de seletores

- Inspecao da pagina-alvo para mapear locators estaveis no novo site

## Fortalecimento de estabilidade

- Inclusao de esperas explicitas e checks de page-ready antes de screenshots/assertions

Esse processo esta refletido no codigo final e no guia de troubleshooting em [solucao-de-problemas.md](./solucao-de-problemas.md).

## Como utilizar este fluxo

Use esta sequencia sempre que precisar implementar ou estabilizar uma mudanca:

1. Descubra o contexto primeiro:
   - Identifique arquivos impactados (config, scripts, pages, steps, docs)
   - Leia apenas os trechos necessarios para a tarefa atual
2. Aplique edicoes focadas:
   - Prefira mudancas pequenas e de baixo risco
   - Mantenha seletores e assertions explicitos e estaveis
3. Valide rapidamente:
   - Rode primeiro apenas os testes impactados
   - Expanda para suites maiores depois da validacao local
4. Documente e comite:
   - Atualize docs/changelog para mudancas de comportamento
   - Use commits semanticos agrupados por assunto

## Comandos praticos

### Contexto e diagnostico

```bash
git status --short
rg "padrao_a_buscar" .
yarn lint
```

### Validacao em runtime

```bash
yarn test:pw:headed:video
yarn test:cucumber:no-workers:headless:video
yarn test:api
```

### Relatorios

```bash
yarn allure:generate
yarn allure:open
yarn allure:server:report
```

### Fluxo de commit

```bash
git add -A
git commit -m "type(scope): mensagem semantica concisa"
```

## Beneficios e aplicabilidade

- Ciclos de debug mais rapidos ao validar primeiro apenas o comportamento impactado
- Menor risco de regressao com mudancas pequenas e isoladas
- Melhor rastreabilidade com commits semanticos e docs sincronizados
- Onboarding mais facil porque as decisoes do fluxo ficam explicitas e repetiveis
- Funciona muito bem em suites mistas UI + API, onde seletores, hooks e relatorios sao interdependentes
