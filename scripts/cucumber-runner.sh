#!/bin/bash

mkdir -p allure-results
  
  NODE_OPTIONS='--import tsx/esm' yarn cucumber-js \
    --import support/world.ts \
    --import support/hooks.ts \
    --import steps/login.step.ts \
    --format @cucumber/pretty-formatter \
    --format html:cucumber-reports/cucumber-report.html \
    --format json:cucumber-reports/cucumber-report.json \
    --format ./node_modules/allure-cucumberjs/dist/esm/reporter.js \
    --format-options '{"resultsDir":"./allure-results"}' \
    features/**/*.feature 2>&1 | tee cucumber-reports/cucumber.log