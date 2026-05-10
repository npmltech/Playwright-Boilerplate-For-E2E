#!/bin/sh
set -e

# Ensure output directories exist and are fully writable by pwuser.
# Bind mounts create dirs as root, so we must fix ownership recursively.
for dir in allure-results cucumber-reports reports reports/playwright test-results test-results/playwright; do
  mkdir -p "$dir"
done
chown -R pwuser:pwuser allure-results cucumber-reports reports test-results

# Drop to pwuser and exec the command
exec runuser -u pwuser -- "$@"