#!/usr/bin/env bash
# Build locally and upload out/ to the VPS. Usage: ./deploy/deploy.sh user@host
set -euo pipefail
target="${1:?usage: deploy/deploy.sh user@host}"
cd "$(dirname "$0")/.."

npm run build
npm run check:secrets
rsync -avz --delete out/ "$target:/var/www/hungdv.io.vn/"
echo "Deployed to $target"
