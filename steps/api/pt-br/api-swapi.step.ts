import { Given, When, Then } from '@cucumber/cucumber';
import Ajv from 'ajv';
import { type CustomWorld } from '../../../support/world';

interface SwapiFilm {
  title?: string;
  episode_id?: number;
  director?: string;
  producer?: string;
  release_date?: string;
  [key: string]: unknown;
}

let swapiResponse: SwapiFilm[] | null = null;
let responseStatus: number | null = null;

Given('eu acesso a API SWAPI de filmes', async function (this: CustomWorld) {
  this.getColorizedLog('cyan')('Acessando a API SWAPI de filmes...');
});

When(
  'faço uma requisição GET para {string}',
  async function (this: CustomWorld, endpoint: string) {
    this.getColorizedLog('cyan')(
      `Fazendo requisição GET para: https://swapi.info${endpoint}`
    );

    try {
      const response = await fetch(`https://swapi.info${endpoint}`);
      responseStatus = response.status;
      swapiResponse = (await response.json()) as SwapiFilm[];

      this.getColorizedLog('green')(
        `Resposta recebida com status ${responseStatus}`
      );
    } catch (error) {
      this.getColorizedLog('red')(`Erro na requisição: ${error}`);
      throw error;
    }
  }
);

Then(
  'a resposta deve ter status {int}',
  async function (this: CustomWorld, expectedStatus: number) {
    if (responseStatus !== expectedStatus) {
      this.getColorizedLog('red')(
        `Status esperado: ${expectedStatus}, mas recebeu: ${responseStatus}`
      );
      throw new Error(
        `Status mismatch: expected ${expectedStatus}, got ${responseStatus}`
      );
    }
    this.getColorizedLog('green')(`Status ${expectedStatus} confirmado`);
  }
);

Then(
  'a resposta deve conter um array de filmes',
  async function (this: CustomWorld) {
    if (!swapiResponse || !Array.isArray(swapiResponse)) {
      this.getColorizedLog('red')(
        'A resposta não contém um array de filmes válido'
      );
      throw new Error('Response does not contain a valid films array');
    }
    this.getColorizedLog('green')(
      `Array de filmes encontrado com ${swapiResponse.length} filmes`
    );
  }
);

Then(
  'o array deve ter mais de {int} filmes',
  async function (this: CustomWorld, minCount: number) {
    if (!swapiResponse || swapiResponse.length <= minCount) {
      this.getColorizedLog('red')(
        `Esperado mais de ${minCount} filmes, mas encontrou ${swapiResponse?.length ?? 0}`
      );
      throw new Error(
        `Expected more than ${minCount} films, got ${swapiResponse?.length ?? 0}`
      );
    }
    this.getColorizedLog('green')(
      `Array contém ${swapiResponse.length} filmes (mais de ${minCount})`
    );
  }
);

Then(
  'cada filme deve ter as propriedades obrigatórias',
  async function (this: CustomWorld) {
    if (!swapiResponse) {
      throw new Error('No films array found');
    }

    const requiredProps = [
      'title',
      'episode_id',
      'director',
      'producer',
      'release_date',
    ];
    const missingProps = [];

    for (const film of swapiResponse) {
      for (const prop of requiredProps) {
        if (
          !(prop in film) ||
          film[prop] === null ||
          film[prop] === undefined
        ) {
          missingProps.push(`${film.title || 'Unknown'}.${prop}`);
        }
      }
    }

    if (missingProps.length > 0) {
      this.getColorizedLog('red')(
        `Propriedades obrigatórias faltando: ${missingProps.join(', ')}`
      );
      throw new Error(
        `Missing required properties: ${missingProps.join(', ')}`
      );
    }

    this.getColorizedLog('green')(
      'Todos os filmes têm as propriedades obrigatórias'
    );
  }
);

Then(
  'o primeiro filme deve ter a propriedade {string}',
  async function (this: CustomWorld, propriedade: string) {
    const firstFilm = swapiResponse?.[0];
    const value = firstFilm?.[propriedade];
    if (value === null || value === undefined || value === '') {
      this.getColorizedLog('red')(
        `Primeiro filme não tem a propriedade: ${propriedade}`
      );
      throw new Error(`Primeiro filme não tem a propriedade: ${propriedade}`);
    }
    this.getColorizedLog('green')(`Primeiro filme ${propriedade}: ${value}`);
  }
);

const swapiFilmSchema = {
  type: 'array',
  minItems: 1,
  items: {
    type: 'object',
    required: ['title', 'episode_id', 'director', 'producer', 'release_date'],
    properties: {
      title: { type: 'string', minLength: 1 },
      episode_id: { type: 'integer', minimum: 1 },
      director: { type: 'string', minLength: 1 },
      producer: { type: 'string', minLength: 1 },
      release_date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
      opening_crawl: { type: 'string' },
      characters: { type: 'array', items: { type: 'string' } },
      planets: { type: 'array', items: { type: 'string' } },
      starships: { type: 'array', items: { type: 'string' } },
      vehicles: { type: 'array', items: { type: 'string' } },
      species: { type: 'array', items: { type: 'string' } },
      created: { type: 'string' },
      edited: { type: 'string' },
      url: { type: 'string' },
    },
    additionalProperties: true,
  },
};

Then(
  'a resposta deve corresponder ao JSON Schema de filmes SWAPI',
  async function (this: CustomWorld) {
    if (!swapiResponse) {
      throw new Error('Nenhuma resposta disponível para validar');
    }

    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(swapiFilmSchema);
    const valid = validate(swapiResponse);

    if (!valid) {
      const errors = ajv.errorsText(validate.errors);
      this.getColorizedLog('red')(`Validação JSON Schema falhou:\n${errors}`);
      throw new Error(`Validação JSON Schema falhou: ${errors}`);
    }

    this.getColorizedLog('green')(
      `Validação JSON Schema passou para ${swapiResponse.length} filmes`
    );
  }
);
