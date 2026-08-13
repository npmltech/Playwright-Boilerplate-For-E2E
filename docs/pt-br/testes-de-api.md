# Testes de API

## SWAPI (Star Wars API)

O projeto inclui testes de API para a Star Wars API (https://swapi.info).

Para documentação completa incluindo detalhes do endpoint, schema de resposta e validação AJV:
→ [Detalhes da API SWAPI — guia detalhado (pt-br)](./detalhes-api-swapi.md)

### Arquivos de feature

- `features/api/pt-br/api-swapi.feature` — Cenários em português (`# language: pt`)
- `features/api/eng/api-swapi.feature` — Cenários em inglês (`# language: en`)

### Steps

- `steps/api/pt-br/api-swapi.step.ts` — Implementação dos steps em português
- `steps/api/eng/api-swapi.step.ts` — Implementação dos steps em inglês

### Locators & endpoints

- `api/endpoints/api-swapi.endpoint.ts` — Endpoints e propriedades de resposta centralizados

### Cenários de teste

- Obter lista de filmes Star Wars com sucesso
- Validar estrutura de dados de filme com `Esquema do Cenário` + `Exemplos`
- Validar a resposta completa de filmes SWAPI contra um JSON Schema usando AJV

### Executar testes de API

```bash
# Locale padrão (pt-br)
yarn test:api

# Português
FEATURE_LOCALE=pt-br yarn test:api

# Inglês
FEATURE_LOCALE=eng yarn test:api

# Com workers paralelos (pt-br)
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=1 FEATURE_LOCALE=pt-br bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}" --tags "@api"

# Com workers paralelos (inglês)
CUCUMBER_VIDEO=1 CUCUMBER_HEADLESS=1 FEATURE_LOCALE=eng bash scripts/cucumber-runner.sh verbose --parallel "${CUCUMBER_PARALLEL:-4}" --tags "@api"

# Com workers paralelos (todos os locales)
yarn test:cucumber:workers:headless:video:all --tags "@api"
```
