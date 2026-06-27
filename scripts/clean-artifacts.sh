#!/usr/bin/env sh
set -eu

# Remove generated test/report artifacts from the project root.

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ARTIFACTS="allure-report allure-results cucumber-reports reports test-results cucumber-report.html cucumber-report.json cucumber.log"

cleanup_with_docker() {
  docker run --rm --network host -u root \
    -v "$REPO_ROOT":/repo \
    -w /repo \
    mcr.microsoft.com/playwright:v1.59.0-noble \
    sh -lc "rm -rf $ARTIFACTS"
}

validate_cleanup() {
  failed=0

  for path in $ARTIFACTS; do
    if [ -e "$path" ]; then
      echo "[cleanup][ERROR] Artifact still exists: $path" >&2
      failed=1
    fi
  done

  if [ "$failed" -ne 0 ]; then
    return 1
  fi

  echo "[cleanup] Validation succeeded: artifacts were removed."
}

cd "$REPO_ROOT"

echo "Removing generated artifacts..."

if command -v docker >/dev/null 2>&1; then
  cleanup_with_docker
else
  rm -rf $ARTIFACTS
fi

validate_cleanup

echo "Done. Generated artifacts were removed and validated."
