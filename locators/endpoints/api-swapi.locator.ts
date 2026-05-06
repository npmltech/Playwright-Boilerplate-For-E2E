/**
 * SWAPI API Locators & Endpoints
 * Star Wars API endpoints and data selectors
 */

export const SWAPI_BASE_URL = 'https://swapi.info';

export const SwapiEndpoints = {
  FILMS: '/api/films',
  PEOPLE: '/api/people',
  PLANETS: '/api/planets',
  STARSHIPS: '/api/starships',
  VEHICLES: '/api/vehicles',
  SPECIES: '/api/species',
} as const;

export const SwapiFilmProperties = {
  title: 'title',
  episodeId: 'episode_id',
  director: 'director',
  producer: 'producer',
  releaseDate: 'release_date',
  characters: 'characters',
  planets: 'planets',
  vehicles: 'vehicles',
  starships: 'starships',
  species: 'species',
  created: 'created',
  edited: 'edited',
  url: 'url',
} as const;
