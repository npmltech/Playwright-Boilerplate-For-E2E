#!/usr/bin/env sh
set -eu

# Remove generated test/report artifacts from the project root.

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST_UID="$(id -u)"
HOST_GID="$(id -g)"

cleanup_with_docker() {
  docker run --rm --network host -u root \
    -v "$REPO_ROOT":/repo \
    -w /repo \
    mcr.microsoft.com/playwright:v1.59.0-noble \
    sh -lc "rm -rf \
      allure-report \
      allure-results \
      cucumber-reports \
      reports \
      test-results \
      cucumber-report.html \
      cucumber-report.json \
      cucumber.log && \
      mkdir -p allure-results cucumber-reports reports test-results && \
      chown -R $HOST_UID:$HOST_GID allure-results cucumber-reports reports test-results && \
      chmod -R u+rwX allure-results cucumber-reports reports test-results"
}

cd "$REPO_ROOT"

echo "Removing generated artifacts..."

if command -v docker >/dev/null 2>&1; then
  cleanup_with_docker
else
  rm -rf \
    allure-report \
    allure-results \
    cucumber-reports \
    reports \
    test-results \
    cucumber-report.html \
    cucumber-report.json \
    cucumber.log
fi

echo "Done. Generated artifacts were removed."
