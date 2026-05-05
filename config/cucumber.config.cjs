const featureLocale = process.env.FEATURE_LOCALE || 'pt-br';
const stepsByLocale = `./steps/**/${featureLocale}/**/*.step.ts`;

module.exports = {
  default: {
    require: ['./support/world.ts', './support/hooks.ts', stepsByLocale],
    requireModule: ['tsx/cjs'],
    format: [
      'json:./allure-results/cucumber-report.json',
      '@cucumber/pretty-formatter',
    ],
    paths: [`features/**/${featureLocale}/**/*.feature`],
  },
};
