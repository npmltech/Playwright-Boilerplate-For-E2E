#!/usr/bin/env sh
set -eu

# Adds generated report artifacts to Git local excludes (.git/info/exclude)
# without modifying the repository .gitignore.

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EXCLUDE_FILE="$REPO_ROOT/.git/info/exclude"
PATTERNS="allure-report/ allure-results/ cucumber-reports/ reports/ test-results/ cucumber-report.html cucumber-report.json cucumber.log"

if [ ! -d "$REPO_ROOT/.git" ]; then
  echo "Error: $REPO_ROOT is not a git repository."
  exit 1
fi

touch "$EXCLUDE_FILE"

for pattern in $PATTERNS; do
  if ! grep -Fxq "$pattern" "$EXCLUDE_FILE"; then
    echo "$pattern" >> "$EXCLUDE_FILE"
    echo "Added: $pattern"
  else
    echo "Already exists: $pattern"
  fi
done

missing=0
for pattern in $PATTERNS; do
  if ! grep -Fxq "$pattern" "$EXCLUDE_FILE"; then
    echo "[exclude][ERROR] Pattern missing after update: $pattern" >&2
    missing=1
  fi
done

if [ "$missing" -ne 0 ]; then
  exit 1
fi

echo "Done. Local excludes updated and validated at: $EXCLUDE_FILE"
