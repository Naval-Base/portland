#!/bin/sh

set -e

echo "## Installing modules..."
if [ -f yarn.lock ]; then
	setup="yarn --production=false &&"
else
	setup="NODE_ENV=development npm install &&"
fi

echo "## Running ESLint"
sh -c "$setup node /action/eslint/src/index.js"
