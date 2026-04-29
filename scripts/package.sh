#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"

EXT_NAME="search-language-switch"
VERSION="$(node -p "require('$ROOT_DIR/manifest.json').version")"
OUT_DIR="$ROOT_DIR/dist"
PACKAGE_NAME="${EXT_NAME}-${VERSION}.zip"

echo "Packaging ${EXT_NAME} v${VERSION}..."

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

cd "$ROOT_DIR"

zip -r "$OUT_DIR/$PACKAGE_NAME" . \
  -x ".git/*" \
  -x "dist/*" \
  -x "scripts/*" \
  -x "node_modules/*" \
  -x "*.DS_Store" \
  -x "*.log"

echo "Created: $OUT_DIR/$PACKAGE_NAME"