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

function getApiResponse(world: CustomWorld): SwapiFilm[] | null {
  return (world.apiResponse as SwapiFilm[] | null) ?? null;
}

Given('I access the SWAPI films API', async function (this: CustomWorld) {
  this.getColorizedLog('cyan')('Accessing the SWAPI films API...');
});

When(
  'I make a GET request to {string}',
  async function (this: CustomWorld, endpoint: string) {
    this.getColorizedLog('cyan')(
      `Making GET request to: https://swapi.info${endpoint}`
    );

    try {
      const response = await fetch(`https://swapi.info${endpoint}`);
      this.apiStatus = response.status;
      this.apiResponse = (await response.json()) as SwapiFilm[];

      this.getColorizedLog('green')(
        `Response received with status ${this.apiStatus}`
      );
    } catch (error) {
      this.getColorizedLog('red')(`Request error: ${error}`);
      throw error;
    }
  }
);

Then(
  'the response should have status {int}',
  async function (this: CustomWorld, expectedStatus: number) {
    if (this.apiStatus !== expectedStatus) {
      this.getColorizedLog('red')(
        `Expected status: ${expectedStatus}, but got: ${this.apiStatus}`
      );
      throw new Error(
        `Status mismatch: expected ${expectedStatus}, got ${this.apiStatus}`
      );
    }
    this.getColorizedLog('green')(`Status ${expectedStatus} confirmed`);
  }
);

Then(
  'the response should contain an array of films',
  async function (this: CustomWorld) {
    const swapiResponse = getApiResponse(this);
    if (!swapiResponse || !Array.isArray(swapiResponse)) {
      this.getColorizedLog('red')(
        'Response does not contain a valid films array'
      );
      throw new Error('Response does not contain a valid films array');
    }
    this.getColorizedLog('green')(
      `Films array found with ${swapiResponse.length} films`
    );
  }
);

Then(
  'the array should have more than {int} films',
  async function (this: CustomWorld, minCount: number) {
    const swapiResponse = getApiResponse(this);
    if (!swapiResponse || swapiResponse.length <= minCount) {
      this.getColorizedLog('red')(
        `Expected more than ${minCount} films, but found ${swapiResponse?.length ?? 0}`
      );
      throw new Error(
        `Expected more than ${minCount} films, got ${swapiResponse?.length ?? 0}`
      );
    }
    this.getColorizedLog('green')(
      `Array contains ${swapiResponse.length} films (more than ${minCount})`
    );
  }
);

Then(
  'each film should have required properties',
  async function (this: CustomWorld) {
    const swapiResponse = getApiResponse(this);
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
        `Missing required properties: ${missingProps.join(', ')}`
      );
      throw new Error(
        `Missing required properties: ${missingProps.join(', ')}`
      );
    }

    this.getColorizedLog('green')('All films have required properties');
  }
);

Then(
  'the first film should have property {string}',
  async function (this: CustomWorld, property: string) {
    const swapiResponse = getApiResponse(this);
    const firstFilm = swapiResponse?.[0];
    const value = firstFilm?.[property];
    if (value === null || value === undefined || value === '') {
      this.getColorizedLog('red')(
        `First film does not have property: ${property}`
      );
      throw new Error(`First film does not have property: ${property}`);
    }
    this.getColorizedLog('green')(`First film ${property}: ${value}`);
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
  'the response should match the SWAPI films JSON Schema',
  async function (this: CustomWorld) {
    const swapiResponse = getApiResponse(this);
    if (!swapiResponse) {
      throw new Error('No response available to validate');
    }

    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(swapiFilmSchema);
    const valid = validate(swapiResponse);

    if (!valid) {
      const errors = ajv.errorsText(validate.errors);
      this.getColorizedLog('red')(`JSON Schema validation failed:\n${errors}`);
      throw new Error(`JSON Schema validation failed: ${errors}`);
    }

    this.getColorizedLog('green')(
      `JSON Schema validation passed for ${swapiResponse.length} films`
    );
  }
);
