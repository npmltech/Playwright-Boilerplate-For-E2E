#!/bin/bash

mkdir -p allure-results
mkdir -p cucumber-reports

# Use "verbose" mode to print step-by-step execution and full exception stacks.
# Use "quiet" mode for CI-friendly minimal output.
EXTRA_ARGS=""
STDOUT_FORMAT="--format @cucumber/pretty-formatter"
VERBOSE_ENV=""
FEATURE_LOCALE="${FEATURE_LOCALE:-pt-br}"
MODE="$1"
if [ "$MODE" = "verbose" ]; then
  shift
  # Pretty formatter prints each scenario/step; summary + backtrace shows clear failure details.
  STDOUT_FORMAT="--format @cucumber/pretty-formatter --format summary"
  EXTRA_ARGS="--backtrace"
  VERBOSE_ENV="CUCUMBER_VERBOSE=1 CUCUMBER_COLOR=1 FORCE_COLOR=1"
elif [ "$MODE" = "quiet" ]; then
  shift
  # CI-friendly mode: only summary, no step-by-step output.
  STDOUT_FORMAT="--format summary"
  EXTRA_ARGS="--backtrace"
fi

FILTER_ARGS=("$@")
STEP_IMPORT_GLOB="steps/**/${FEATURE_LOCALE}/**/*.step.ts"
  
  env $VERBOSE_ENV NODE_OPTIONS='--import tsx/esm' yarn cucumber-js \
    --import support/world.ts \
    --import support/hooks.ts \
    --import "$STEP_IMPORT_GLOB" \
    $STDOUT_FORMAT \
    --format html:cucumber-reports/cucumber-report.html \
    --format json:cucumber-reports/cucumber-report.json \
    --format ./node_modules/allure-cucumberjs/dist/esm/reporter.js \
    --format-options '{"resultsDir":"./allure-results"}' \
    "${FILTER_ARGS[@]}" \
    $EXTRA_ARGS \
    "features/**/${FEATURE_LOCALE}/**/*.feature" 2>&1 | tee cucumber-reports/cucumber.log