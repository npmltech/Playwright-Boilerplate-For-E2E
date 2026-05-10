#!/bin/sh
set -e

# Ensure output directories exist and are writable from the host.
for dir in allure-results cucumber-reports reports reports/playwright test-results test-results/playwright; do
  mkdir -p "$dir"
done

chmod -R 777 allure-results cucumber-reports reports test-results

exec "$@"