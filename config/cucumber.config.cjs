const featureLocale = process.env.FEATURE_LOCALE || 'pt-br';

module.exports = {
  default: {
    require: [
      './support/world.ts',
      './support/hooks.ts',
      `./steps/web/${featureLocale}/**/*.step.ts`,
      `./steps/api/${featureLocale}/**/*.step.ts`,
    ],
    requireModule: ['tsx/cjs'],
    format: [
      'json:./allure-results/cucumber-report.json',
      '@cucumber/pretty-formatter',
    ],
    paths: [
      `features/web/${featureLocale}/**/*.feature`,
      `features/api/${featureLocale}/**/*.feature`,
    ],
  },
};
