#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
BUILD_DIR="$ROOT_DIR/build"

FILES=(
  "manifest.json"
  "background.js"
  "options.html"
  "options.css"
  "options.js"
)

DIRS=(
  "assets"
)

rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

for file in "${FILES[@]}"; do
  cp "$ROOT_DIR/$file" "$BUILD_DIR/"
done

for dir in "${DIRS[@]}"; do
  cp -r "$ROOT_DIR/$dir" "$BUILD_DIR/"
done

echo "Build directory created at: $BUILD_DIR"