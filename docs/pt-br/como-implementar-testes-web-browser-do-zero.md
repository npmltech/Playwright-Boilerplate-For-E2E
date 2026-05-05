# Como Implementar Testes Web/Browser do Zero

Este guia mostra como criar um teste web completo neste projeto: Feature, Steps e configuracao de URL.

## 1. Entenda a estrutura usada no projeto

Para testes web/browser, este boilerplate usa:

- Features por idioma em `features/web/<locale>/`
- Steps por idioma em `steps/web/<locale>/`
- Page Objects em `pages/`
- Locators centralizados em `locators/`

## 2. Configure a URL base do sistema

A URL principal e definida por variavel de ambiente.

1. Crie/atualize `.env`:

```properties
BASE_URL=https://seu-site.com/
```

2. O Playwright ja consome `BASE_URL` em `config/playwright.config.ts`.

3. Nos steps/pages, navegue usando rotas relativas quando possivel.

Exemplo:

```ts
await page.goto('/minha-rota');
```

Isso evita repetir dominio e facilita troca de ambiente.

## 3. Crie a Feature (BDD)

Crie `features/web/pt-br/minha-jornada.feature`:

```gherkin
# language: pt
@web
@smoke
@minha_jornada
Funcionalidade: Minha jornada web

  Cenario: Acessar pagina inicial e validar elemento principal
    Dado que eu acesso a pagina inicial
    Entao devo ver o titulo principal da pagina
```

Boas praticas:

- Cenarios orientados a comportamento (nao a implementacao)
- Tags para execucao seletiva
- Linguagem de negocio clara

## 4. Crie locators e page object

### 4.1 Locator

Crie `locators/minha-jornada.locator.ts`:

```ts
export const minhaJornadaLocator = {
  tituloPrincipal: 'h1',
};
```

### 4.2 Page Object

Crie `pages/minha-jornada.page.ts`:

```ts
import { expect, type Page } from '@playwright/test';
import { minhaJornadaLocator } from '../locators/minha-jornada.locator';

export class MinhaJornadaPage {
  constructor(private readonly page: Page) {}

  async abrirPaginaInicial() {
    await this.page.goto('/');
  }

  async validarTituloPrincipal() {
    await expect(
      this.page.locator(minhaJornadaLocator.tituloPrincipal).first()
    ).toBeVisible();
  }
}
```

## 5. Crie os Steps

Crie `steps/web/pt-br/minha-jornada.step.ts`:

```ts
import { Given, Then } from '@cucumber/cucumber';
import { MinhaJornadaPage } from '../../../pages/minha-jornada.page';
import type { CustomWorld } from '../../../support/world';

Given('que eu acesso a pagina inicial', async function (this: CustomWorld) {
  const pagina = new MinhaJornadaPage(this.page);
  await pagina.abrirPaginaInicial();
});

Then(
  'devo ver o titulo principal da pagina',
  async function (this: CustomWorld) {
    const pagina = new MinhaJornadaPage(this.page);
    await pagina.validarTituloPrincipal();
  }
);
```

Boas praticas:

- Steps com logica minima (delegar para page object)
- Locators fora do step (arquivo dedicado)
- Assertions no page object para manter padrao

## 6. Execute os testes

Rodar suite Cucumber web+api:

```bash
yarn test:cucumber:no-workers:headed:video
```

Rodar apenas seu cenario por tag:

```bash
yarn test:cucumber:no-workers:headed:video --tags "@minha_jornada"
```

Rodar em headless:

```bash
yarn test:cucumber:no-workers:headless:video --tags "@minha_jornada"
```

## 7. Checklist rapido

- Feature criada em `features/web/<locale>/`
- Step criado em `steps/web/<locale>/`
- URL base configurada em `.env` (`BASE_URL`)
- Locators centralizados em `locators/`
- Page object criado em `pages/`
- Tags adicionadas para execucao seletiva
