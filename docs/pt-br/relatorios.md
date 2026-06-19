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

## Relatórios JSON do Cucumber e resumo consolidado

A execucao atual do Cucumber grava arquivos por locale em `cucumber-reports/`:

- `cucumber-report-pt-br.json`
- `cucumber-report-eng.json`
- arquivos HTML correspondentes (`cucumber-report-pt-br.html`, `cucumber-report-eng.html`)

Isso evita sobrescrita de relatório quando os dois locales rodam em sequência.

### Gerar resumo consolidado no terminal

```bash
yarn report:cucumber:summary
```

O resumo inclui:

- totais mesclados de todos os arquivos por locale encontrados
- contadores de status coloridos
- destaque de falhas (quando houver)
- timestamp `Test Run` no formato `dd.mm.aaaa hh:mm`
- arquivo JSON de saída em `.tmp/cucumber-report-summary.json`

### Entrada/saída opcionais

```bash
# Arquivo único
yarn report:cucumber:summary --input cucumber-reports/cucumber-report-eng.json

# Diretório customizado + saída customizada
yarn report:cucumber:summary --input cucumber-reports --output .tmp/custom-summary.json
```

### Comportamento de fallback legado

Se os arquivos por locale ainda não existirem, o comando usa fallback para `cucumber-report.json` e exibe aviso. Nesse cenário, os totais podem representar apenas um locale.
