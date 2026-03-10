module.exports = {
    default: {
        require: [
            './support/world.ts',
            './support/hooks.ts',
            './steps/login.step.ts',
        ],
        requireModule: ['tsx/cjs'],
        format: [
            'json:./allure-results/cucumber-report.json',
            '@cucumber/pretty-formatter',
        ],
        paths: ['features/**/*.feature'],
    },
};