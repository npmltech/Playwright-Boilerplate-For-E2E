#!/bin/bash

mkdir -p allure-results
mkdir -p cucumber-reports

# Use "verbose" mode to print step-by-step execution and full exception stacks.
# Use "quiet" mode for CI-friendly minimal output.
EXTRA_ARGS=""
STDOUT_FORMAT="--format pretty"
VERBOSE_ENV=""
FEATURE_LOCALE="${FEATURE_LOCALE:-pt-br}"
MODE="$1"
if [ "$MODE" = "verbose" ]; then
  shift
  # Pretty formatter prints each scenario/step; summary + backtrace shows clear failure details.
  STDOUT_FORMAT="--format pretty --format summary"
  EXTRA_ARGS="--backtrace"
  VERBOSE_ENV="CUCUMBER_VERBOSE=1 CUCUMBER_COLOR=1 FORCE_COLOR=1"
elif [ "$MODE" = "quiet" ]; then
  shift
  # CI-friendly mode: only summary, no step-by-step output.
  STDOUT_FORMAT="--format summary"
  EXTRA_ARGS="--backtrace"
fi

FILTER_ARGS=("$@")

# Retry count: default 1; set CUCUMBER_RETRY=0 to disable.
CUCUMBER_RETRY="${CUCUMBER_RETRY:-1}"
# Fail-fast: default on; set CUCUMBER_FAIL_FAST=0 to let all scenarios run.
CUCUMBER_FAIL_FAST="${CUCUMBER_FAIL_FAST:-1}"

RETRY_ARG="--retry ${CUCUMBER_RETRY}"
FAIL_FAST_ARG=""
[ "$CUCUMBER_FAIL_FAST" = "1" ] && FAIL_FAST_ARG="--fail-fast"

env $VERBOSE_ENV NODE_OPTIONS='--import tsx/esm' yarn cucumber-js \
  --import support/world.ts \
  --import support/hooks.ts \
  --import "steps/web/${FEATURE_LOCALE}/*.step.ts" \
  --import "steps/api/${FEATURE_LOCALE}/*.step.ts" \
  $STDOUT_FORMAT \
  --format html:cucumber-reports/cucumber-report-${FEATURE_LOCALE}.html \
  --format json:cucumber-reports/cucumber-report-${FEATURE_LOCALE}.json \
  --format ./node_modules/allure-cucumberjs/dist/esm/reporter.js:./cucumber-reports/allure-reporter-${FEATURE_LOCALE}.log \
  --format-options '{"resultsDir":"./allure-results"}' \
  "${FILTER_ARGS[@]}" \
  $RETRY_ARG \
  $FAIL_FAST_ARG \
  $EXTRA_ARGS \
  "features/web/${FEATURE_LOCALE}/**/*.feature" \
  "features/api/${FEATURE_LOCALE}/**/*.feature" 2>&1 | tee cucumber-reports/cucumber-${FEATURE_LOCALE}.log

CUCUMBER_EXIT=${PIPESTATUS[0]}

if ls allure-results/*-result.json 1>/dev/null 2>&1; then
  echo ""
  echo "Generating Allure report..."
  node node_modules/allure-commandline/bin/allure generate allure-results --clean -o allure-report
fi

exit $CUCUMBER_EXIT