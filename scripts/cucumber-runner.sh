# Run cucumber and search everywhere for allure files
mkdir -p allure-results

NODE_OPTIONS='--import tsx/esm' yarn cucumber-js \
  --require ./support/world.ts \
  --require ./support/hooks.ts \
  --require './steps/**/*.ts' \
  --require-module tsx/cjs \
  --format ./node_modules/allure-cucumberjs/dist/cjs/reporter.js \
  --format-options '{"resultsDir":"./allure-results"}' \
  --format @cucumber/pretty-formatter \
  features/**/*.feature

# Search everywhere for generated files
find . -name "*-result.json" 2>/dev/null | grep -v node_modules
find . -name "*-container.json" 2>/dev/null | grep -v node_modules
find . -name "allure-results" 2>/dev/null | grep -v node_modules