#!/usr/bin/env sh
set -eu

# Adds generated report artifacts to Git local excludes (.git/info/exclude)
# without modifying the repository .gitignore.

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EXCLUDE_FILE="$REPO_ROOT/.git/info/exclude"

if [ ! -d "$REPO_ROOT/.git" ]; then
  echo "Error: $REPO_ROOT is not a git repository."
  exit 1
fi

patterns='
allure-report/
allure-results/
cucumber-reports/
reports/
test-results/
cucumber-report.html
cucumber-report.json
cucumber.log
'

touch "$EXCLUDE_FILE"

for pattern in $patterns; do
  if ! grep -Fxq "$pattern" "$EXCLUDE_FILE"; then
    echo "$pattern" >> "$EXCLUDE_FILE"
    echo "Added: $pattern"
  else
    echo "Already exists: $pattern"
  fi
done

echo "Done. Local excludes updated at: $EXCLUDE_FILE"
