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

- `locators/endpoints/api-swapi.locator.ts` — Endpoints e propriedades de resposta centralizados

### Cenários de teste

- Obter lista de filmes Star Wars com sucesso
- Validar estrutura de dados de filme com `Esquema do Cenário` + `Exemplos`
- Validar a resposta completa de filmes SWAPI contra um JSON Schema usando AJV

### Executar testes de API

```bash
# Locale padrão (pt-br)
yarn test:api

# Português
yarn test:api:pt-br

# Inglês
yarn test:api:eng
```
