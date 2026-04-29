# Search Language Switch

A lightweight Firefox extension that forces Google Search to display in English — especially useful in regions where Google defaults to another language (e.g., Switzerland).

## ✨ Features

- Forces Google UI language to English (`hl=en`)
- Restricts search results to English (`lr=lang_en`)
- Optional header override (`Accept-Language`)
- Works in Private Browsing (recommended use case)
- Minimal permissions (Google domains only)

## 🎯 Use Case

Designed for users who:

- Frequently perform quick searches in private tabs
- Want consistent English results regardless of location
- Are affected by Google’s aggressive localization (e.g. `google.ch → German`)

## ⚙️ How It Works

The extension intercepts Google navigation requests and:

1. Modifies query parameters:

   - `hl=en` → UI language
   - `gl=ch` → region hint
   - `lr=lang_en` → result language restriction
2. Optionally overrides the request header:

   - `Accept-Language: en-US,en;q=0.9`

## 📱 Installation (Android)

1. Zip the extension folder
2. Upload to AMO (addons.mozilla.org) for signing (unlisted)
3. Install the signed `.xpi` file on Firefox Android
4. Enable:
   - **Run in Private Browsing**

## 🧪 Development

Load temporarily in Firefox:
about:debugging#/runtime/this-firefox

Click:
→ Load Temporary Add-on → select `manifest.json`

## 🔒 Permissions

- `webRequest`, `webRequestBlocking` → modify Google requests
- `storage` → save user settings
- `*://www.google.*/*` → limited scope to Google only

No analytics, no external network requests.

## ⚠️ Notes

- Google may still apply localization via IP or account settings
- This extension forces behavior but does not guarantee full consistency

## 🚧 TODO

- [ ] Normalize all domains to `google.com` (avoid TLD-based localization)
- [ ] Add support for DuckDuckGo, Bing, Startpage
- [ ] MV3 compatibility layer (Chrome support)
- [ ] Add icon + branding
- [ ] Add toggle: "Private mode only"
- [ ] Improve language selector (future: multi-language support)

## 🧠 Future Vision

Expand into a "Search Language Controller":

- Force any language (not just English)
- Per-engine rules
- Per-tab or per-mode behavior
