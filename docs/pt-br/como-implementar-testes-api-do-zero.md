# Como Implementar Testes de API do Zero

Este guia mostra como criar um teste de API completo neste projeto: Feature, Steps e configuracao de URL.

## 1. Entenda a estrutura usada no projeto

Para testes de API, este boilerplate usa:

- Features por idioma em `features/api/<locale>/`
- Steps por idioma em `steps/api/<locale>/`
- Endpoints centralizados em `locators/`

Exemplo de locale:

- `pt-br` (padrao)
- `eng`

## 2. Configure a URL da API

Escolha onde sua API base sera definida.

Opcao recomendada neste projeto:

1. Crie/atualize variavel no `.env`:

```properties
API_BASE_URL=https://sua-api.com
```

2. Centralize endpoint no locator da API (ou crie um novo):

```ts
// locators/minha-api.locator.ts
export const minhaApiLocator = {
  baseUrl: process.env.API_BASE_URL ?? 'https://sua-api.com',
  endpoints: {
    health: '/health',
  },
};
```

Isso evita hardcode repetido em steps.

## 3. Crie a Feature (BDD)

Crie o arquivo em `features/api/pt-br/minha-api.feature`:

```gherkin
# language: pt
@api @smoke @minha_api
Funcionalidade: API Minha API

  Cenario: Consultar health da API com sucesso
    Dado que eu preparo a requisicao para o endpoint de health
    Quando eu envio a requisicao GET
    Entao o status da resposta deve ser 200
```

Boas praticas:

- Use tags para filtro (`@api`, `@smoke`, `@minha_api`)
- Mantenha cenarios pequenos e objetivos
- Nomeie cenario com comportamento esperado

## 4. Crie os Steps

Crie o arquivo em `steps/api/pt-br/minha-api.step.ts`:

```ts
import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { minhaApiLocator } from '../../../locators/minha-api.locator';

let response: Response | undefined;
let url = '';

Given('que eu preparo a requisicao para o endpoint de health', function () {
  url = `${minhaApiLocator.baseUrl}${minhaApiLocator.endpoints.health}`;
});

When('eu envio a requisicao GET', async function () {
  response = await fetch(url, { method: 'GET' });
});

Then('o status da resposta deve ser {int}', function (statusEsperado: number) {
  assert.ok(response, 'Resposta nao foi recebida');
  assert.equal(response.status, statusEsperado);
});
```

Boas praticas:

- Sempre validar se houve resposta antes de usar `response.status`
- Centralizar URL e endpoints em locator/config
- Evitar logica de negocio dentro da Feature

## 5. Execute os testes

Rodar apenas API:

```bash
yarn test:api
```

Rodar API em pt-br:

```bash
yarn test:api:pt-br
```

Filtrar por tag especifica:

```bash
yarn test:cucumber:no-workers:headless:video --tags "@minha_api"
```

## 6. Expandir para validacao de payload

Depois de validar status code, adicione:

- Validacao de campos obrigatorios
- Validacao de tipos
- Validacao por JSON Schema com AJV

Padrao recomendado:

1. Ler `await response.json()`
2. Validar shape basico
3. Validar contrato com AJV para evitar regressao silenciosa

## 7. Checklist rapido

- Feature criada em `features/api/<locale>/`
- Steps criados em `steps/api/<locale>/`
- URL base em `.env`
- Endpoint centralizado em `locators/`
- Tags adicionadas para filtro
- Execucao validada com comando de API
