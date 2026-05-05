# Relatórios

## Relatório Allure

### Gerar e servir (recomendado)

```bash
yarn allure:server:report
```

Este comando gera o relatório HTML Allure e o abre em um servidor Allure na porta 8080.

### Comandos Allure individuais

```bash
yarn allure:generate    # Gera relatório a partir de allure-results/
yarn allure:open        # Abre relatório no browser padrão
yarn allure:serve       # Serve relatório em localhost:8080 (sem auto-abertura)
```

### Linux / ambientes headless

Em ambientes Linux sem sessão desktop, use `allure:serve` que não tenta abrir um browser:

```bash
yarn allure:serve
```

Os scripts do pacote forçam X11 para operações Allure e reduzem falhas de inicialização Wayland no Linux.

## Capturas de tela por step

Em `support/hooks.ts`, cada step Cucumber captura e anexa um screenshot após verificações de page-ready.

Screenshots são incluídos automaticamente nos relatórios Allure e anexados a cada step de cenário.
