# Como Implementar Testes Web/Browser do Zero

Este guia mostra como criar um teste web completo neste projeto: Feature, Steps e configuração de URL.

## 1. Entenda a estrutura usada no projeto

Para testes web/browser, este boilerplate usa:

- Features por idioma em `features/web/<locale>/`
- Steps por idioma em `steps/web/<locale>/`
- Page Objects em `pages/`
- Locators centralizados em `locators/web-elements/`

## 2. Configure a URL base do sistema

A URL principal é definida por variável de ambiente.

1. Crie/atualize `.env`:

```properties
BASE_URL=https://seu-site.com/
```

2. O Playwright já consome `BASE_URL` em `config/playwright.config.ts`.

3. Nos steps/pages, navegue usando rotas relativas quando possível.

Exemplo:

```ts
await page.goto('/minha-rota');
```

Isso evita repetir domínio e facilita troca de ambiente.

## 3. Crie a Feature (BDD)

Crie `features/web/pt-br/minha-jornada.feature`:

```gherkin
# language: pt
@web
@smoke
@minha_jornada
Funcionalidade: Minha jornada web

  Cenário: Acessar página inicial e validar elemento principal
    Dado que eu acesso a página inicial
    Então devo ver o título principal da página
```

Boas práticas:

- Cenários orientados a comportamento (não à implementação)
- Tags para execução seletiva
- Linguagem de negócio clara

## 4. Crie locators e page object

### 4.1 Locator

Crie `locators/web-elements/minha-jornada.locator.ts`:

```ts
export const minhaJornadaLocator = {
  tituloPrincipal: 'h1',
};
```

### 4.2 Page Object

Crie `pages/minha-jornada.page.ts`:

```ts
import { expect, type Page } from '@playwright/test';
import { minhaJornadaLocator } from '../locators/web-elements/minha-jornada.locator';

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

Given('que eu acesso a página inicial', async function (this: CustomWorld) {
  const pagina = new MinhaJornadaPage(this.page);
  await pagina.abrirPaginaInicial();
});

Then(
  'devo ver o título principal da página',
  async function (this: CustomWorld) {
    const pagina = new MinhaJornadaPage(this.page);
    await pagina.validarTituloPrincipal();
  }
);
```

Boas práticas:

- Steps com lógica mínima (delegar para page object)
- Locators fora do step (arquivo dedicado)
- Assertions no page object para manter padrão

## 6. Execute os testes

Rodar suíte Cucumber web+api:

```bash
yarn test:cucumber:no-workers:headed:video
```

Rodar apenas seu cenário por tag:

```bash
yarn test:cucumber:no-workers:headed:video --tags "@minha_jornada"
```

Rodar em headless:

```bash
yarn test:cucumber:no-workers:headless:video --tags "@minha_jornada"
```

## 7. Checklist rápido

- Feature criada em `features/web/<locale>/`
- Step criado em `steps/web/<locale>/`
- URL base configurada em `.env` (`BASE_URL`)
- Locators centralizados em `locators/web-elements/`
- Page object criado em `pages/`
- Tags adicionadas para execução seletiva
