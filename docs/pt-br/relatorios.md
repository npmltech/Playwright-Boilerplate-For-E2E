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
yarn allure:open        # Abre relatório no browser padrão, maximizado
yarn allure:serve       # Serve relatório em localhost:8080 (sem auto-abertura)
```

`allure:open` e `allure:serve` usam `scripts/open-maximized.sh` como launcher do browser, portanto o relatório abre em janela maximizada. O script detecta o browser disponível (Chrome → Chromium → Firefox → fallback xdg-open) e passa `--start-maximized` (ou `--maximized` para Firefox).

### Linux / ambientes headless

Em ambientes Linux sem sessão desktop, use `allure:serve` que não tenta abrir um browser:

```bash
yarn allure:serve
```

`allure:serve` e `allure:open` filtram o ruído comum de warnings do Wayland na saída, preservando falhas reais do comando.

## Capturas de tela por step

Em `support/hooks.ts`, cada step Cucumber captura e anexa um screenshot após verificações de page-ready.

Screenshots são incluídos automaticamente nos relatórios Allure e anexados a cada step de cenário.
