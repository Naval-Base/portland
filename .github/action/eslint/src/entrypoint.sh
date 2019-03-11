#!/bin/sh

set -e

echo "## Installing modules..."
if [ -f yarn.lock ]; then
	yarn --production=false
else
	NODE_ENV=development npm install
fi

echo "## Running ESLint"
node /action/eslint/src/index.js
