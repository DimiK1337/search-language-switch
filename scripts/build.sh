#!/usr/bin/env bash
set -euo pipefail

if [[ $# -gt 0 ]]; then
  MODE="$1"
else
  MODE=""

  while [[ "$MODE" != "unlisted" && "$MODE" != "listed" ]]; do
    echo "Select build mode:"
    echo "  1) unlisted  - includes update_url for self-distributed builds"
    echo "  2) listed    - removes update_url for public AMO listing"
    read -rp "Enter 1 or 2: " choice

    case "$choice" in
      1) MODE="unlisted" ;;
      2) MODE="listed" ;;
      *) echo "Invalid choice. Please enter 1 or 2."; echo ;;
    esac
  done
fi

if [[ "$MODE" != "listed" && "$MODE" != "unlisted" ]]; then
  echo "Usage: $0 [listed|unlisted]"
  exit 1
fi

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
BUILD_DIR="$ROOT_DIR/build"

FILES=(
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

node - "$ROOT_DIR/manifest.base.json" "$BUILD_DIR/manifest.json" "$MODE" <<'NODE'
const fs = require("fs");

const [basePath, outPath, mode] = process.argv.slice(2);
const manifest = JSON.parse(fs.readFileSync(basePath, "utf8"));

manifest.browser_specific_settings ??= {};
manifest.browser_specific_settings.gecko ??= {};

if (mode === "listed") {
  delete manifest.browser_specific_settings.gecko.update_url;
}

if (mode === "unlisted") {
  manifest.browser_specific_settings.gecko.update_url =
    "https://raw.githubusercontent.com/DimiK1337/search-language-switch/main/updates.json";
}

fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2) + "\n");
NODE

echo "Built $MODE extension in: $BUILD_DIR"