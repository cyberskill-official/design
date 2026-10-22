#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
test "$(tr -d '[:space:]' < VERSION)" = "$(node -p "require('./package.json').version")"
node scripts/bootstrap-toolchain.mjs
node scripts/npm.mjs run verify
node scripts/npm.mjs run verify:browser
