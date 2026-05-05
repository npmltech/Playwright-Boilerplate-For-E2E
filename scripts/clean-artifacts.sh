#!/usr/bin/env sh
set -eu

# Remove generated test/report artifacts from the project root.

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$REPO_ROOT"

echo "Removing generated artifacts..."
rm -rf \
  allure-report \
  allure-results \
  cucumber-reports \
  reports \
  test-results \
  cucumber-report.html \
  cucumber-report.json \
  cucumber.log

echo "Done. Generated artifacts were removed."
