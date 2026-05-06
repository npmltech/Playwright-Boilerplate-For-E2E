# Testes da API Star Wars (SWAPI)

Este documento descreve os testes de API incluídos neste projeto usando a Star Wars API.

## Visão geral

O projeto inclui testes abrangentes para a Star Wars API (https://swapi.info) para validar recuperação dos filmes, estrutura dos dados e compatibilidade com JSON Schema.

## Arquivos de teste

### Arquivos de feature

**Português:**

- `features/api/pt-br/api-swapi.feature` - Cenários em português para testes da API SWAPI (`# language: pt`)

**Inglês:**

- `features/api/eng/api-swapi.feature` - English scenarios for SWAPI API tests (`# language: en`)

### Definições de steps

- `steps/api/pt-br/api-swapi.step.ts` - Implementações dos steps em português com tratamento completo de erros
- `steps/api/eng/api-swapi.step.ts` - English step implementations with full error handling

### Locators e configuração

- `locators/endpoints/api-swapi.locator.ts` - Endpoints de API e propriedades de filme centralizados

## Cenários de teste

### 1. Obter lista de filmes Star Wars com sucesso

**EN:** Get Star Wars Films List Successfully

Valida que:

- A API responde com status HTTP 200
- A resposta contém um array de filmes
- O array contém mais de 0 filmes
- Cada filme possui propriedades obrigatórias (title, episode_id, director, producer, release_date)

**Execução:**

```bash
yarn test:cucumber:no-workers:headed:video --tags "@swapi"
```

### 2. Validar estrutura de dados do filme (Esquema do Cenário)

**EN:** Validate Film Data Structure

Usa `Esquema do Cenário` com tabela de `Exemplos` para executar uma verificação parametrizada por propriedade:

| property     |
| ------------ |
| title        |
| episode_id   |
| director     |
| producer     |
| release_date |

Valida que o primeiro filme da resposta possui cada propriedade presente e não vazia.
Um único step definition `o primeiro filme deve ter a propriedade {string}` cobre todas as linhas.

**Execução:**

```bash
yarn test:api
```

### 3. Validar resposta de filmes contra JSON Schema (AJV)

**EN:** Validate Films Response Against JSON Schema

Valida que:

- A resposta é um array no nível raiz
- Cada objeto de filme corresponde ao schema esperado da SWAPI
- As propriedades obrigatórias possuem os tipos corretos
- `release_date` segue o padrão `YYYY-MM-DD`

Notas de implementação:

- Usa `ajv` para validação de JSON Schema
- Coleta todos os erros de schema com `allErrors: true`
- Falha o cenário com um resumo dos erros de validação quando algum item é inválido

**Execução:**

```bash
yarn test:api
```

## Executando testes de API

### Todos os testes (UI + API)

```bash
yarn test:cucumber:no-workers:headed:video
```

### Somente testes SWAPI

```bash
yarn test:cucumber:no-workers:headed:video --tags "@swapi"
```

### Somente testes de API (qualquer API)

```bash
yarn test:cucumber:no-workers:headless:video --tags "@api"

# Atalhos
yarn test:api
yarn test:api:pt-br
yarn test:api:eng
```

### Modo específico

```bash
# Headless
yarn test:cucumber:no-workers:headless:video --tags "@swapi"

# Com workers paralelos
yarn test:cucumber:workers:headless:video --tags "@swapi"
CUCUMBER_PARALLEL=4 yarn test:cucumber:workers:headless:video --tags "@swapi"

# Com workers paralelos (locale inglês)
yarn test:cucumber:workers:headless:video:eng --tags "@swapi"

# Com workers paralelos (todos os locales)
yarn test:cucumber:workers:headless:video:all --tags "@swapi"
```

## Endpoint da API

**Base URL:** https://swapi.info

**Endpoint:** /api/films

**Método:** GET

**Exemplo de resposta:**

```json
[
  {
    "title": "A New Hope",
    "episode_id": 4,
    "release_date": "1977-05-25",
    "director": "George Lucas",
    "producer": "Gary Kurtz, Rick McCallum",
    "characters": ["https://swapi.info/api/people/1/"],
    "planets": ["https://swapi.info/api/planets/1/"],
    "vehicles": ["https://swapi.info/api/vehicles/4/"],
    "starships": ["https://swapi.info/api/starships/2/"],
    "species": ["https://swapi.info/api/species/1/"],
    "created": "2014-12-10T14:23:09.469298Z",
    "edited": "2015-04-17T10:50:46.259765Z",
    "url": "https://swapi.info/api/films/1/"
  }
]
```

## Propriedades obrigatórias

Cada filme na resposta deve ter:

- `title` (string) - Título do filme
- `episode_id` (number) - Número do episódio
- `director` (string) - Nome(s) do diretor
- `producer` (string) - Nome(s) do produtor
- `release_date` (string) - Data de lançamento no formato YYYY-MM-DD

## Validação por JSON Schema

O cenário com AJV valida a resposta completa contra um schema que exige:

- resposta como array no nível raiz
- pelo menos um item de filme
- campos obrigatórios: `title`, `episode_id`, `director`, `producer`, `release_date`
- `episode_id` como inteiro
- `release_date` no formato `YYYY-MM-DD`
- arrays opcionais da SWAPI como `characters`, `planets`, `starships`, `vehicles` e `species`

Pacotes relevantes:

- `ajv` - Validador JSON Schema usado nos steps da API SWAPI
- `@cucumber/messages` - Peer dependency explícita exigida por pacotes de formatter/reporting em instalações Yarn 4

## Tratamento de erros

Os testes incluem tratamento abrangente de erros:

- Erros de rede são capturados e logados
- Divergências de status code são reportadas de forma clara
- Propriedades ausentes são identificadas por filme e nome da propriedade
- Falhas de validação de schema incluem detalhes agregados dos erros AJV
- Todos os erros incluem saída colorida no console para facilitar debug

## Saída da execução

Ao executar os testes de API, você verá logs coloridos:

- Mensagens azuis para acesso e chamadas de API
- Mensagens verdes para validações com sucesso
- Mensagens vermelhas para falhas
- Mensagens ciano para requisições HTTP

Exemplo:

```
🎬 Acessando a API SWAPI de filmes...
📡 Fazendo requisição GET para: https://swapi.info/api/films
✓ Resposta recebida com status 200
✓ Array de filmes encontrado com 6 filmes
✓ Todos os filmes têm as propriedades obrigatórias
✓ Título do primeiro filme: A New Hope
```

## Tags

- `@api` - Todos os testes de API
- `@swapi` - Testes específicos da SWAPI
- `@smoke` - Teste de fumaca (validacao basica)

Combine tags para filtrar:

```bash
yarn test:cucumber:no-workers:headed:video --tags "@api and @smoke"
```
