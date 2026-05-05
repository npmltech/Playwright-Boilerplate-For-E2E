# Estratégia de Tags

## Tags atuais em features web

- Tags Cucumber: `@login`, `@authentication`, `@smoke`, `@regression`
- Labels Allure como tags:
  - `@allure.label.severity:critical`
  - `@allure.label.severity:normal`
  - `@allure.label.suite:Login`
  - `@allure.label.feature:Authentication`

## Tags em features de registro

- Tags Cucumber: `@register`, `@authentication`, `@smoke`, `@regression`
- Labels Allure como tags:
  - `@allure.label.severity:critical`
  - `@allure.label.severity:normal`
  - `@allure.label.suite:Cadastro`
  - `@allure.label.suite:RecuperacaoSenha`
  - `@allure.label.feature:Authentication`

## Tags de testes de API

- `@api` — Todos os testes de API (também pula bootstrap do browser nos hooks)
- `@swapi` — Testes específicos de SWAPI
- `@smoke` — Teste smoke (validação básica)

## Filtrando por tag

```bash
# Apenas testes smoke
yarn test:cucumber:no-workers:headless:video --tags "@smoke"

# Apenas testes de regressão
yarn test:cucumber:no-workers:headless:video --tags "@regression"

# Excluir testes smoke
yarn test:cucumber:no-workers:headless:video --tags "not @smoke"

# Testes de login
yarn test:cucumber:no-workers:headless:video --tags "@login"

# Testes de registro
yarn test:cucumber:no-workers:headless:video --tags "@register"

# Apenas testes de API
yarn test:api

# Combinar tags
yarn test:cucumber:no-workers:headless:video --tags "@api and @smoke"
```
