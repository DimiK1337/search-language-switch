#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"

EXT_NAME="search-language-switch"
MANIFEST="$ROOT_DIR/manifest.json"
UPDATES_JSON="$ROOT_DIR/updates.json"

CURRENT_VERSION="$(node -p "require('$MANIFEST').version")"

echo "Current version: $CURRENT_VERSION"
read -rp "New version: " NEW_VERSION

if [[ -z "$NEW_VERSION" ]]; then
  echo "No version provided."
  exit 1
fi

# Update manifest version
node - "$MANIFEST" "$NEW_VERSION" <<'NODE'
const fs = require("fs");
const [manifestPath, newVersion] = process.argv.slice(2);
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
manifest.version = newVersion;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
NODE

echo "Building clean extension folder..."
"$SCRIPT_DIR/build.sh" unlisted

echo "Signing extension with web-ext..."

rm -rf "$ROOT_DIR/dist"
mkdir -p "$ROOT_DIR/dist"

web-ext sign \
  --source-dir "$ROOT_DIR/build" \
  --artifacts-dir "$ROOT_DIR/dist" \
  --channel=unlisted \
  --api-key "$AMO_JWT_ISSUER" \
  --api-secret "$AMO_JWT_SECRET"

XPI_PATH="$(ls $ROOT_DIR/dist/*.xpi | tail -n 1)"

TAG="v$NEW_VERSION"
GITHUB_REPO="DimiK1337/search-language-switch"

echo "Creating git commit + tag..."
git add "$MANIFEST"
git commit -m "Release $NEW_VERSION"
git tag "$TAG"
git push
git push origin "$TAG"

echo "Creating GitHub release..."
gh release create "$TAG" "$XPI_PATH" \
  --repo "$GITHUB_REPO" \
  --title "$TAG" \
  --notes "Release $NEW_VERSION"

UPDATE_LINK="https://github.com/$GITHUB_REPO/releases/download/$TAG/$(basename $XPI_PATH)?raw=1"

echo "Updating updates.json..."

node - "$UPDATES_JSON" "$NEW_VERSION" "$UPDATE_LINK" <<'NODE'
const fs = require("fs");
const [path, version, link] = process.argv.slice(2);

const addonId = "search-language-switch@dimik1337.dev";

let data = { addons: {} };
if (fs.existsSync(path)) {
  data = JSON.parse(fs.readFileSync(path, "utf8"));
}

data.addons ??= {};
data.addons[addonId] ??= { updates: [] };

const updates = data.addons[addonId].updates;

updates.push({ version, update_link: link });

updates.sort((a, b) =>
  a.version.localeCompare(b.version, undefined, { numeric: true })
);

fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
NODE

git add "$UPDATES_JSON"
git commit -m "Update update manifest for $NEW_VERSION"
git push

echo ""
echo "Done 🚀"
echo "Release: https://github.com/$GITHUB_REPO/releases/tag/$TAG"