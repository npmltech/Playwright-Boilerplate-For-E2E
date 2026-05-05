# Testes da API Star Wars (SWAPI)

Este documento descreve os testes de API incluidos neste projeto usando a Star Wars API.

## Visao geral

O projeto inclui testes abrangentes para a Star Wars API (https://swapi.info) para validar recuperacao dos filmes, estrutura dos dados e compatibilidade com JSON Schema.

## Arquivos de teste

### Arquivos de feature

**Portugues:**

- `features/api/pt-br/api-swapi.feature` - Cenarios em portugues para testes da API SWAPI (`# language: pt`)

**Ingles:**

- `features/api/eng/api-swapi.feature` - English scenarios for SWAPI API tests (`# language: en`)

### Definicoes de steps

- `steps/api/pt-br/api-swapi.step.ts` - Implementacoes dos steps em portugues com tratamento completo de erros
- `steps/api/eng/api-swapi.step.ts` - English step implementations with full error handling

### Locators e configuracao

- `locators/api-swapi.locator.ts` - Endpoints de API e propriedades de filme centralizados

## Cenarios de teste

### 1. Obter lista de filmes Star Wars com sucesso

**EN:** Get Star Wars Films List Successfully

Valida que:

- A API responde com status HTTP 200
- A resposta contem um array de filmes
- O array contem mais de 0 filmes
- Cada filme possui propriedades obrigatorias (title, episode_id, director, producer, release_date)

**Execucao:**

```bash
yarn test:cucumber:no-workers:headed:video --tags "@swapi"
```

### 2. Validar estrutura de dados do filme (Esquema do Cenario)

**EN:** Validate Film Data Structure

Usa `Esquema do Cenario` com tabela de `Exemplos` para executar uma verificacao parametrizada por propriedade:

| property     |
| ------------ |
| title        |
| episode_id   |
| director     |
| producer     |
| release_date |

Valida que o primeiro filme da resposta possui cada propriedade presente e nao vazia.
Um unico step definition `o primeiro filme deve ter a propriedade {string}` cobre todas as linhas.

**Execucao:**

```bash
yarn test:api
```

### 3. Validar resposta de filmes contra JSON Schema (AJV)

**EN:** Validate Films Response Against JSON Schema

Valida que:

- A resposta e um array no nivel raiz
- Cada objeto de filme corresponde ao schema esperado da SWAPI
- As propriedades obrigatorias possuem os tipos corretos
- `release_date` segue o padrao `YYYY-MM-DD`

Notas de implementacao:

- Usa `ajv` para validacao de JSON Schema
- Coleta todos os erros de schema com `allErrors: true`
- Falha o cenario com um resumo dos erros de validacao quando algum item e invalido

**Execucao:**

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

### Modo especifico

```bash
# Headless
yarn test:cucumber:no-workers:headless:video --tags "@swapi"

# Com workers paralelos
yarn test:cucumber:workers:headless:video --tags "@swapi"
CUCUMBER_PARALLEL=4 yarn test:cucumber:workers:headless:video --tags "@swapi"
```

## Endpoint da API

**Base URL:** https://swapi.info

**Endpoint:** /api/films

**Metodo:** GET

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

## Propriedades obrigatorias

Cada filme na resposta deve ter:

- `title` (string) - Titulo do filme
- `episode_id` (number) - Numero do episodio
- `director` (string) - Nome(s) do diretor
- `producer` (string) - Nome(s) do produtor
- `release_date` (string) - Data de lancamento no formato YYYY-MM-DD

## Validacao por JSON Schema

O cenario com AJV valida a resposta completa contra um schema que exige:

- resposta como array no nivel raiz
- pelo menos um item de filme
- campos obrigatorios: `title`, `episode_id`, `director`, `producer`, `release_date`
- `episode_id` como inteiro
- `release_date` no formato `YYYY-MM-DD`
- arrays opcionais da SWAPI como `characters`, `planets`, `starships`, `vehicles` e `species`

Pacotes relevantes:

- `ajv` - Validador JSON Schema usado nos steps da API SWAPI
- `@cucumber/messages` - Peer dependency explicita exigida por pacotes de formatter/reporting em instalacoes Yarn 4

## Tratamento de erros

Os testes incluem tratamento abrangente de erros:

- Erros de rede sao capturados e logados
- Divergencias de status code sao reportadas de forma clara
- Propriedades ausentes sao identificadas por filme e nome da propriedade
- Falhas de validacao de schema incluem detalhes agregados dos erros AJV
- Todos os erros incluem saida colorida no console para facilitar debug

## Saida da execucao

Ao executar os testes de API, voce vera logs coloridos:

- Mensagens azuis para acesso e chamadas de API
- Mensagens verdes para validacoes com sucesso
- Mensagens vermelhas para falhas
- Mensagens ciano para requisicoes HTTP

Exemplo:

```
🎬 Acessando a API SWAPI de filmes...
📡 Fazendo requisicao GET para: https://swapi.info/api/films
✓ Resposta recebida com status 200
✓ Array de filmes encontrado com 6 filmes
✓ Todos os filmes tem as propriedades obrigatorias
✓ Titulo do primeiro filme: A New Hope
```

## Tags

- `@api` - Todos os testes de API
- `@swapi` - Testes especificos da SWAPI
- `@smoke` - Teste de fumaca (validacao basica)

Combine tags para filtrar:

```bash
yarn test:cucumber:no-workers:headed:video --tags "@api and @smoke"
```
