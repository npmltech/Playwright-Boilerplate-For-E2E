# Como Implementar Testes de API do Zero

Este guia mostra como criar um teste de API completo neste projeto: Feature, Steps e configuração de URL.

## 1. Entenda a estrutura usada no projeto

Para testes de API, este boilerplate usa:

- Features por idioma em `features/api/<locale>/`
- Steps por idioma em `steps/api/<locale>/`
- Endpoints centralizados em `locators/endpoints/`

Exemplo de locale:

- `pt-br` (padrão)
- `eng`

## 2. Configure a URL da API

Escolha onde sua API base será definida.

Opção recomendada neste projeto:

1. Crie/atualize variável no `.env`:

```properties
API_BASE_URL=https://sua-api.com
```

2. Centralize endpoint no locator da API (ou crie um novo):

```ts
// locators/endpoints/minha-api.locator.ts
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
@api
@smoke
@minha_api
Funcionalidade: API Minha API

  Cenário: Consultar health da API com sucesso
    Dado que eu preparo a requisição para o endpoint de health
    Quando eu envio a requisição GET
    Então o status da resposta deve ser 200
```

Boas práticas:

- Use tags para filtro (`@api`, `@smoke`, `@minha_api`)
- Mantenha cenários pequenos e objetivos
- Nomeie o cenário com o comportamento esperado

## 4. Crie os Steps

Crie o arquivo em `steps/api/pt-br/minha-api.step.ts`:

```ts
import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { minhaApiLocator } from '../../../locators/endpoints/minha-api.locator';

let response: Response | undefined;
let url = '';

Given('que eu preparo a requisição para o endpoint de health', function () {
  url = `${minhaApiLocator.baseUrl}${minhaApiLocator.endpoints.health}`;
});

When('eu envio a requisição GET', async function () {
  response = await fetch(url, { method: 'GET' });
});

Then('o status da resposta deve ser {int}', function (statusEsperado: number) {
  assert.ok(response, 'Resposta não foi recebida');
  assert.equal(response.status, statusEsperado);
});
```

Boas práticas:

- Sempre validar se houve resposta antes de usar `response.status`
- Centralizar URL e endpoints em locator/config
- Evitar lógica de negócio dentro da Feature

## 5. Execute os testes

Rodar apenas API:

```bash
yarn test:api
```

Rodar API em pt-br:

```bash
yarn test:api:pt-br
```

Rodar API em inglês com workers:

```bash
yarn test:cucumber:workers:headless:video:eng --tags "@api"
```

Rodar API em todos os locales com workers:

```bash
yarn test:cucumber:workers:headless:video:all --tags "@api"
```

Filtrar por tag específica:

```bash
yarn test:cucumber:no-workers:headless:video --tags "@minha_api"
```

## 6. Expandir para validação de payload

Depois de validar status code, adicione:

- Validação de campos obrigatórios
- Validação de tipos
- Validação por JSON Schema com AJV

Padrão recomendado:

1. Ler `await response.json()`
2. Validar shape básico
3. Validar contrato com AJV para evitar regressão silenciosa

## 7. Checklist rápido

- Feature criada em `features/api/<locale>/`
- Steps criados em `steps/api/<locale>/`
- URL base em `.env`
- Endpoint centralizado em `locators/endpoints/`
- Tags adicionadas para filtro
- Execução validada com comando de API
