import { Before, BeforeStep, AfterStep, After } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import { type CustomWorld } from './world';
import { HooksHelper } from './helpers/hooks-helpers';

const isHeadless = process.env.CUCUMBER_HEADLESS !== '0';
const shouldRecordVideo = process.env.CUCUMBER_VIDEO !== '0';
const cucumberVideoDir =
  process.env.CUCUMBER_VIDEO_DIR || 'test-results/videos/cucumber';

Before(
  { timeout: HooksHelper.cucumberTimeoutMs },
  async function (this: CustomWorld, { pickle }) {
    if (HooksHelper.isVerbose) {
      console.log(
        `\n${HooksHelper.colorize(`📋 Cenário: ${pickle.name}`, 'cyan')}`
      );
    }

    const isApiScenario = pickle.tags.some((t) => t.name === '@api');
    if (isApiScenario) return;

    this.browser = await chromium.launch({
      args: [
        '--disable-blink-features=AutomationControlled',
        '--ozone-platform=x11',
      ],
      env: {
        ...process.env,
        OZONE_PLATFORM: 'x11',
        WAYLAND_DISPLAY: '',
      },
      headless: isHeadless,
    });
    this.context = await this.browser.newContext({
      baseURL: process.env.BASE_URL || HooksHelper.defaultBaseUrl,
      ...(shouldRecordVideo ? { recordVideo: { dir: cucumberVideoDir } } : {}),
      userAgent: HooksHelper.botBypassUserAgent,
    });
    this.page = await this.context.newPage();
  }
);

BeforeStep(function ({ pickleStep, gherkinDocument }) {
  if (!HooksHelper.isVerbose) return;

  const keyword = HooksHelper.getStepKeyword(gherkinDocument, pickleStep);
  const stepLine = `${keyword} ${pickleStep.text}`.trim();
  console.log(`\n${HooksHelper.colorize(stepLine, 'blue')}`);
});

AfterStep(async function (
  this: CustomWorld,
  { pickleStep, gherkinDocument, result }
) {
  const keyword = HooksHelper.getStepKeyword(gherkinDocument, pickleStep);
  const stepLine = `${keyword} ${pickleStep.text}`.trim();

  if (this.page) {
    const currentUrl = this.page.url();
    const hasNavigated = currentUrl !== 'about:blank' && currentUrl !== '';

    if (hasNavigated) {
      await this.page.waitForLoadState('load');
      await this.page.waitForFunction(() => {
        const hasVisibleElement = Array.from(
          document.body?.querySelectorAll('*') ?? []
        ).some((el) => {
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return (
            style.visibility !== 'hidden' &&
            style.display !== 'none' &&
            rect.width > 0 &&
            rect.height > 0
          );
        });

        return (
          document.readyState === 'complete' &&
          document.styleSheets.length > 0 &&
          hasVisibleElement
        );
      });
    }

    const screenshot = await this.page.screenshot({ fullPage: false });
    await this.attach(screenshot, 'image/png');
  }

  if (!HooksHelper.isVerbose) return;

  const status = String(result?.status ?? 'UNKNOWN');

  if (status === 'PASSED') {
    console.log(HooksHelper.colorize(`✔ ${stepLine}`, 'green'));
  } else if (status === 'SKIPPED') {
    console.log(HooksHelper.colorize(`? ${stepLine}`, 'yellow'));
  } else if (status === 'PENDING' || status === 'UNDEFINED') {
    console.log(HooksHelper.colorize(`! ${status}: ${stepLine}`, 'yellow'));
  }

  if (result?.exception) {
    console.error(
      `\n${HooksHelper.colorize(`❌ STEP ERROR: ${stepLine}`, 'red')}`
    );
    console.error(HooksHelper.formatException(result.exception));
  }
});

After(
  { timeout: HooksHelper.cucumberTimeoutMs },
  async function (this: CustomWorld, { pickle, result }) {
    if (HooksHelper.isVerbose && result?.exception) {
      console.error(
        `\n${HooksHelper.colorize(`❌ SCENARIO ERROR: ${pickle.name}`, 'red')}`
      );
      console.error(HooksHelper.formatException(result.exception));
    }

    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
  }
);
