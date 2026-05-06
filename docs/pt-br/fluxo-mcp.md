# Notas do Fluxo MCP

Este repositório foi desenvolvido com um fluxo agêntico com orquestração de ferramentas no estilo MCP:

## Descoberta de contexto

- Busca de arquivos e leituras direcionadas de config, pages, steps e docs

## Ciclo seguro de mudança

- Edições pequenas com patch e diagnóstico após cada atualização

## Verificação em runtime

- Execução de testes focada em cenários/specs impactados

## Remapeamento de seletores

- Inspeção da página-alvo para mapear locators estáveis no novo site

## Fortalecimento de estabilidade

- Inclusão de esperas explícitas e checks de page-ready antes de screenshots/assertions

Esse processo está refletido no código final e no guia de troubleshooting em [solucao-de-problemas.md](./solucao-de-problemas.md).

## Como utilizar este fluxo

Use esta sequência sempre que precisar implementar ou estabilizar uma mudança:

1. Descubra o contexto primeiro:
   - Identifique arquivos impactados (config, scripts, pages, steps, docs)
   - Leia apenas os trechos necessários para a tarefa atual
2. Aplique edições focadas:
   - Prefira mudanças pequenas e de baixo risco
   - Mantenha seletores e assertions explícitos e estáveis
3. Valide rapidamente:
   - Rode primeiro apenas os testes impactados
   - Expanda para suítes maiores depois da validação local
4. Documente e commite:
   - Atualize docs/changelog para mudanças de comportamento
   - Use commits semânticos agrupados por assunto

## Comandos práticos

### Contexto e diagnóstico

```bash
git status --short
rg "padrao_a_buscar" .
yarn lint
```

### Validação em runtime

```bash
yarn test:pw:headed:video
yarn test:cucumber:no-workers:headless:video
yarn test:api
```

### Relatórios

```bash
yarn allure:generate
yarn allure:open
yarn allure:server:report
```

### Fluxo de commit

```bash
git add -A
git commit -m "type(scope): mensagem semântica concisa"
```

## Benefícios e aplicabilidade

- Ciclos de debug mais rápidos ao validar primeiro apenas o comportamento impactado
- Menor risco de regressão com mudanças pequenas e isoladas
- Melhor rastreabilidade com commits semânticos e docs sincronizados
- Onboarding mais fácil porque as decisões do fluxo ficam explícitas e repetíveis
- Funciona muito bem em suítes mistas UI + API, onde seletores, hooks e relatórios são interdependentes
