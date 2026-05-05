#!/usr/bin/env bash
# Opens a URL in the user's browser maximized.
# Invoked by allure commandline via the $BROWSER env var (Java XDesktopPeer on Linux).
URL="$1"

if command -v google-chrome &>/dev/null; then
  exec google-chrome --start-maximized "$URL"
elif command -v google-chrome-stable &>/dev/null; then
  exec google-chrome-stable --start-maximized "$URL"
elif command -v chromium-browser &>/dev/null; then
  exec chromium-browser --start-maximized "$URL"
elif command -v chromium &>/dev/null; then
  exec chromium --start-maximized "$URL"
elif command -v firefox &>/dev/null; then
  exec firefox --maximized "$URL"
else
  exec xdg-open "$URL"
fi
