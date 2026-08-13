import { expect } from '@playwright/test';
import type { CustomWorld } from '../../../support/world';
import { registerLocator } from '../../../ui/locators/register.locator';
import { HooksHelper } from '../../../support/helpers/hooks-helpers';

export function uniqueSuffix() {
  return `${Date.now()}${Math.floor(Math.random() * 10_000)}`;
}

export async function selectCountryAndZone(
  world: CustomWorld,
  countryValue: string
) {
  // Selecting the country fires the site's own jQuery handler, which reloads
  // the zone <select>'s entire content via `.load(...rt=common/zone...)`.
  // If we select a zone before that AJAX call resolves, the late response
  // overwrites the select and silently discards our selection - producing
  // "Please select a region / state!" even though a zone was picked.
  // Racing the response wait against the select action (rather than polling
  // zone options.count() alone) closes that window.
  await Promise.all([
    world.page.waitForResponse((response) =>
      response.url().includes('rt=common/zone')
    ),
    world.page
      .locator(registerLocator.countrySelect)
      .selectOption(countryValue),
  ]);

  await selectValidZone(world);
}

export async function selectValidZone(world: CustomWorld) {
  const zoneOptions = world.page.locator(
    `${registerLocator.zoneSelect} option`
  );

  await expect
    .poll(async () => zoneOptions.count(), {
      message: 'Zone options did not load after country selection',
      timeout: HooksHelper.cucumberTimeoutMs,
    })
    .toBeGreaterThan(1);

  const selected = await world.page.evaluate((selector) => {
    const select = document.querySelector(selector) as HTMLSelectElement | null;
    if (!select) return false;

    for (const option of Array.from(select.options)) {
      const value = option.value?.trim();
      if (!value || value === '0' || value.toUpperCase() === 'FALSE') continue;
      option.selected = true;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    return false;
  }, registerLocator.zoneSelect);

  expect(selected, 'No valid zone option found for the selected country').toBe(
    true
  );
}
