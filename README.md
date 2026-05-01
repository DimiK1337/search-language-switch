# Search Language Switch

A lightweight Firefox extension that forces Google Search to display in English — especially useful in regions where Google aggressively localizes results (e.g. Switzerland).

---

## ✨ Features

- Forces Google UI language to English (`hl=en`)
- Restricts search results to English (`lr=lang_en`)
- Optional `Accept-Language` header override
- Works in Private Browsing
- Auto-update support via GitHub releases
- Minimal, transparent permissions

---

## 🎯 Use Case

Built for people who:

- Use Private Browsing frequently
- Want consistent English results regardless of location
- Are tired of `google.ch → German/French` switching constantly

---

## ⚙️ How It Works

The extension intercepts top-level Google navigation requests and:

### 1. Modifies query parameters

- `hl=en` → UI language
- `gl=ch` → region hint
- `lr=lang_en` → restrict results to English

### 2. Optionally overrides headers

Accept-Language: en-US,en;q=0.9

---

## 📦 Installation

### Desktop (Firefox)

Install from a signed `.xpi`:

- Open the `.xpi` file
- Confirm installation

### Android (Firefox Nightly / Developer Edition)

1. Install Firefox Nightly
2. Open the signed `.xpi`
3. Enable:
   - Run in Private Browsing

---

## 🔄 Auto Updates

This extension supports automatic updates via:

https://raw.githubusercontent.com/DimiK1337/search-language-switch/main/updates.json

Updates are delivered via GitHub Releases.

---

## 🧪 Development

Load temporarily in Firefox:

about:debugging#/runtime/this-firefox

Then:
Load Temporary Add-on → select manifest.json

---

## 🔒 Permissions

- storage
- webRequest
- webRequestBlocking
- <all_urls>

Filtering is done internally to only affect Google domains.

---

## ⚠️ Limitations

- Google may still localize based on IP or account settings
- This extension enforces parameters but cannot fully override backend behavior

---

## 🚧 TODO

- Normalize all searches to google.com
- Add support for DuckDuckGo, Bing, Startpage
- MV3 compatibility (Chrome support)
- UI improvements
- Private mode only toggle
- Multi-language support

---

## 🔐 Privacy

- No analytics
- No tracking
- No external requests
- All logic runs locally

---

## 🛠 Release Pipeline

Automated via:

- web-ext sign
- GitHub Releases
- updates.json

Run:
./scripts/release.sh
