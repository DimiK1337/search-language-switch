
# Search Language Switch

A lightweight Firefox extension for keeping Google Search in your preferred language and region.

Install from Firefox Add-ons:

https://addons.mozilla.org/en-US/firefox/addon/search-language-switch/

---

## ✨ Features

- Choose your preferred Google Search interface language
- Choose your preferred Google Search region
- Automatically sets Google Search URL parameters:
  - `hl` for Google UI language
  - `gl` for region hint
  - `lr` for result language
- Optional `Accept-Language` request header override
- Works in Private Browsing when enabled
- Simple options page
- No analytics, tracking, or remote services

---

## 🎯 Use Case

This extension is useful if Google Search keeps switching languages based on your location, IP address, browser state, or private browsing session.

For example, if you live in Switzerland but prefer Google Search in English, Google may repeatedly fall back to German, French, or another local language. This extension helps keep the search interface and results aligned with your chosen settings.

It can also be used for other language/region combinations, such as:

- English + Switzerland
- French + Switzerland
- German + Germany
- Portuguese (Brazil) + Brazil
- Chinese (Simplified) + China
- Chinese (Traditional) + Taiwan

---

## ⚙️ How It Works

The extension intercepts top-level Google navigation requests and rewrites selected Google Search parameters.

### Query parameters

The extension can set:

```txt
hl=<language>
gl=<region>
lr=lang_<language>
```

Example:

```txt
hl=en
gl=ch
lr=lang_en
```

This means:

- `hl=en` tells Google to use English for the interface
- `gl=ch` gives Google Switzerland as the region hint
- `lr=lang_en` asks Google to prefer/restrict English-language results

### Request header

If enabled, the extension also rewrites the `Accept-Language` request header.

Example:

```txt
Accept-Language: en-US,en;q=0.9
```

For regional languages, it may generate values such as:

```txt
fr-CH,fr;q=0.9,en;q=0.7
zh-CN,zh;q=0.9,en;q=0.7
pt-BR,pt;q=0.9,en;q=0.7
```

---

## 📦 Installation

### Public Firefox Add-ons listing

Install from AMO:

https://addons.mozilla.org/en-US/firefox/addon/search-language-switch/

### Manual development install

For local testing:

1. Open Firefox
2. Go to:

```txt
about:debugging#/runtime/this-firefox
```

3. Click **Load Temporary Add-on**
4. Select the generated `manifest.json` from the `build/` folder

---

## 🧪 Development

Build the listed/public version:

```bash
./scripts/build.sh listed
```

Run temporarily with `web-ext`:

```bash
web-ext run --source-dir build
```

For manual testing, load the extension from:

```txt
build/manifest.json
```

---

## 🔒 Permissions

The extension uses:

- `storage`
- `webRequest`
- `webRequestBlocking`
- `<all_urls>`

The broad URL permission is used so Firefox can observe navigation requests, but filtering is handled internally. The extension only rewrites supported Google Search requests.

---

## 🔐 Privacy

Search Language Switch does not collect, store, transmit, or sell user data.

- No analytics
- No tracking
- No external requests
- No remote code
- No account system
- All settings are stored locally in Firefox extension storage

---

## ⚠️ Limitations

Google may still use other signals when deciding what to show, including:

- IP address
- Google account settings
- cookies
- device/browser language
- location permissions
- Google’s own backend behavior

This extension controls request parameters and headers. It cannot guarantee that Google will ignore every other localization signal.

---

## 📁 Project Structure

```txt
.
├── assets/
│   └── logo/
├── data/
│   ├── languages.js
│   └── regions.js
├── background.js
├── options.html
├── options.css
├── options.js
├── settings.js
├── manifest.base.json
├── scripts/
│   ├── build.sh
│   ├── package.sh
│   └── release.sh
└── updates.json
```

---

## 🛠 Release Pipeline

The project supports two distribution modes.

### Listed AMO build

Used for the public Firefox Add-ons listing.

```bash
./scripts/build.sh listed
```

The listed build does not include a custom `update_url`. Updates are handled by Mozilla.

### Unlisted/private build

Used for private signed releases and GitHub-hosted updates.

```bash
./scripts/build.sh unlisted
```

The unlisted build can use:

```txt
updates.json
```

for self-hosted update metadata.

The release pipeline uses:

- `web-ext sign`
- GitHub Releases
- `updates.json`

Run:

```bash
./scripts/release.sh
```

---

## 🚧 TODO

Potential future improvements:

- Add more search engines, such as Bing, DuckDuckGo, or Startpage
- Add advanced controls for country restriction (`cr`)
- Add a private-mode-only toggle
- Improve Android UX
- Investigate Manifest V3 compatibility
- Add automated tests for settings resolution

---

## License

See `LICENSE.md`.
