import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from '../../../support/world';
import { BasePage } from '../../../pages/base.page';
import { registerLocator } from '../../../ui/locators/register.locator';
import { routes, routePatterns } from '../../../config/routes';
import { HooksHelper } from '../../../support/helpers/hooks-helpers';
import {
  uniqueSuffix,
  selectValidZone,
} from '../shared/register.helpers';

const notRegisteredEmail = 'nao-cadastrado-e2e@example.com';

Given(
  'que eu estou na página de recuperação de senha',
  async function (this: CustomWorld) {
    const basePage = new BasePage(this.page, this);
    await basePage.navigate(routes.forgottenPassword);
    await expect(
      this.page.locator(registerLocator.forgottenForm)
    ).toBeVisible();
  }
);

When(
  'eu solicito recuperação com e-mail não cadastrado',
  async function (this: CustomWorld) {
    await this.page
      .locator(registerLocator.forgottenEmailInput)
      .fill(notRegisteredEmail);
    await this.page
      .locator(registerLocator.forgottenContinueButton)
      .first()
      .click();
  }
);

Then(
  'eu devo ver uma mensagem informando que o e-mail não foi encontrado',
  async function (this: CustomWorld) {
    await expect(this.page.locator(registerLocator.errorAlert)).toContainText(
      /not found|not in our records|nao encontrado/i
    );
  }
);

Given('que eu estou na página de cadastro', async function (this: CustomWorld) {
  const basePage = new BasePage(this.page, this);
  await basePage.navigate(routes.register);
  await expect(this.page.locator(registerLocator.accountForm)).toBeVisible();
});

When(
  'eu preencho os dados obrigatórios válidos',
  async function (this: CustomWorld) {
    const suffix = uniqueSuffix();

    await this.page.locator(registerLocator.firstNameInput).fill('Teste');
    await this.page.locator(registerLocator.lastNameInput).fill('Automacao');
    await this.page
      .locator(registerLocator.emailInput)
      .fill(`teste.${suffix}@example.com`);
    await this.page.locator(registerLocator.telephoneInput).fill('11999999999');
    await this.page
      .locator(registerLocator.address1Input)
      .fill('Rua Teste, 123');
    await this.page.locator(registerLocator.cityInput).fill('Sao Paulo');
    await this.page.locator(registerLocator.countrySelect).selectOption('30');
    await selectValidZone(this);
    await this.page.locator(registerLocator.postcodeInput).fill('01000');
    await this.page
      .locator(registerLocator.loginNameInput)
      .fill(`user${suffix}`);
    await this.page
      .locator(registerLocator.passwordInput)
      .fill('SenhaForte@123');
    await this.page
      .locator(registerLocator.confirmPasswordInput)
      .fill('SenhaForte@123');
    await this.page.locator(registerLocator.agreeCheckbox).check();
  }
);

When(
  'eu preencho os dados obrigatórios válidos sem aceitar os termos',
  async function (this: CustomWorld) {
    const suffix = uniqueSuffix();

    await this.page.locator(registerLocator.firstNameInput).fill('Teste');
    await this.page.locator(registerLocator.lastNameInput).fill('SemTermos');
    await this.page
      .locator(registerLocator.emailInput)
      .fill(`sem.termos.${suffix}@example.com`);
    await this.page.locator(registerLocator.telephoneInput).fill('11988888888');
    await this.page
      .locator(registerLocator.address1Input)
      .fill('Avenida Teste, 456');
    await this.page.locator(registerLocator.cityInput).fill('Sao Paulo');
    await this.page.locator(registerLocator.countrySelect).selectOption('30');
    await selectValidZone(this);
    await this.page.locator(registerLocator.postcodeInput).fill('02000');
    await this.page
      .locator(registerLocator.loginNameInput)
      .fill(`usersemtermos${suffix}`);
    await this.page
      .locator(registerLocator.passwordInput)
      .fill('SenhaForte@123');
    await this.page
      .locator(registerLocator.confirmPasswordInput)
      .fill('SenhaForte@123');
  }
);

When('eu envio o formulário de cadastro', async function (this: CustomWorld) {
  await this.page
    .locator(registerLocator.registerContinueButton)
    .first()
    .click();
});

Then(
  'eu devo ver uma mensagem de conta criada com sucesso',
  async function (this: CustomWorld) {
    await this.page.waitForFunction(
      ({ successPattern, successFlags, errorSelector }) => {
        const success = new RegExp(successPattern, successFlags).test(
          window.location.href
        );
        const errorEl = document.querySelector(errorSelector);
        return success || Boolean(errorEl?.textContent?.trim());
      },
      {
        successPattern: routePatterns.registerSuccess.source,
        successFlags: routePatterns.registerSuccess.flags,
        errorSelector: registerLocator.errorAlert,
      },
      { timeout: HooksHelper.cucumberTimeoutMs }
    );

    const currentUrl = this.page.url();
    if (!routePatterns.registerSuccess.test(currentUrl)) {
      const errorText = await this.page
        .locator(registerLocator.errorAlert)
        .first()
        .textContent()
        .catch(() => null);
      throw new Error(
        `Cadastro nao chegou na pagina de sucesso. URL: ${currentUrl}. Alerta: ${errorText ?? 'nenhum'}`
      );
    }

    await expect(
      this.page.locator(registerLocator.mainContainer)
    ).toContainText(/your account has been created|conta criada/i, {
      timeout: HooksHelper.cucumberTimeoutMs,
    });
  }
);

Then(
  'eu devo ver uma mensagem de erro sobre aceite dos termos',
  async function (this: CustomWorld) {
    await expect(this.page.locator(registerLocator.errorAlert)).toContainText(
      /agree|privacy policy|termos/i
    );
  }
);
