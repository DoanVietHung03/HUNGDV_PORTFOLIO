#!/usr/bin/env bash
# Build and publish out/ to /var/www/hungdv.io.vn.
#   ./deploy/deploy.sh               # this machine is the VPS: copy locally
#   ./deploy/deploy.sh user@host     # build here, upload over SSH
set -euo pipefail
cd "$(dirname "$0")/.."
dest=/var/www/hungdv.io.vn

npm run build
npm run check:secrets

if [ -z "${1:-}" ]; then
  mkdir -p "$dest"
  rsync -a --delete out/ "$dest/"
  echo "Deployed locally to $dest"
else
  rsync -avz --delete out/ "$1:$dest/"
  echo "Deployed to $1:$dest"
fi
