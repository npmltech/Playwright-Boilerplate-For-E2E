# Configuração

## Variáveis de Ambiente

```properties
BASE_URL=https://automationteststore.com/
USERNAME=tester_champion
PASSWORD=123123
```

## Configuração do Playwright

Configuração atual em `config/playwright.config.ts`:

- Usa `BASE_URL` do arquivo `.env`
- Executa projetos Chromium e Firefox
- Aplica args de launch exclusivos do Chromium (`--disable-blink-features=AutomationControlled`, `--ozone-platform=x11`) apenas no projeto Chromium
- Coleta screenshot, trace e vídeo em falhas/retentativas
- Usa webServer local somente quando `BASE_URL` aponta para localhost

## Configuração do Cucumber

Configuração atual em `config/cucumber.config.cjs`:

- Importa world, hooks e arquivos de steps
- Carrega steps via glob `steps/**/${FEATURE_LOCALE}/**/*.step.ts` (orientado por locale)
- Executa features de `features/**/${FEATURE_LOCALE}/**/*.feature`
- Produz saída JSON + pretty + Allure
