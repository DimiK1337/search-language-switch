//console.log("SLS background loaded");

const DEFAULT_SETTINGS = {
  enabled: true,
  forceHeader: true,
  uiLanguage: "en",
  region: "ch",
  resultLanguage: "lang_en",
  acceptLanguage: "en-US,en;q=0.9"
};

let SETTINGS = { ...DEFAULT_SETTINGS };

// Load settings once
browser.storage.local.get(DEFAULT_SETTINGS).then((stored) => {
  SETTINGS = { ...DEFAULT_SETTINGS, ...stored };
  //console.log("Settings loaded:", SETTINGS);
});

// Update settings live if changed
browser.storage.onChanged.addListener((changes, area) => {
  if (area === "local") {
    for (const key in changes) {
      SETTINGS[key] = changes[key].newValue;
    }
    //console.log("Settings updated:", SETTINGS);
  }
});

const isGoogleHost = (hostname) => {
  return hostname === "google.com" ||
         hostname === "www.google.com" ||
         hostname.startsWith("google.") ||
         hostname.startsWith("www.google.");
};

const isSearchEngineHost = (hostname, engine) => {
  const escapedEngine = engine.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `^([a-z0-9-]+\\.)*${escapedEngine}\\.[a-z.]+$`,
    "i"
  );

  return pattern.test(hostname);
};

const isSupportedSearchHost = (hostname) => {
  return (
    isSearchEngineHost(hostname, "google") ||
    isSearchEngineHost(hostname, "bing")
  );
};

const setParam = (url, key, value) => {
  if (value) url.searchParams.set(key, value);
};

const buildRedirectUrl = (rawUrl) => {
  const url = new URL(rawUrl);

  // TODO: Add future hosts (Bing, DuckDuckGo, etc.)
  if (!isGoogleHost(url.hostname)) return null;

  setParam(url, "hl", SETTINGS.uiLanguage);

  const isSearchPage =
    url.pathname === "/search" || url.searchParams.has("q");

  if (isSearchPage) {
    setParam(url, "gl", SETTINGS.region);
    setParam(url, "lr", SETTINGS.resultLanguage);
  }

  const nextUrl = url.toString();
  return nextUrl === rawUrl ? null : nextUrl;
};

const REQUEST_URLS = ["<all_urls>"];

// 🔥 NON-ASYNC LISTENER
browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    //console.log("Request seen:", details.url, details.type, details.incognito);

    if (details.type !== "main_frame") return {};

    if (!SETTINGS.enabled) return {};

    const redirectUrl = buildRedirectUrl(details.url);
    if (!redirectUrl) return {};

    //console.log("Redirecting →", redirectUrl);
    return { redirectUrl };
  },
  { urls: REQUEST_URLS },
  ["blocking"]
);

// 🔥 NON-ASYNC HEADER LISTENER
browser.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    if (details.type !== "main_frame") return {};

    if (!SETTINGS.enabled || !SETTINGS.forceHeader) return {};

    const headers = details.requestHeaders || [];

    const existing = headers.find(h => h.name.toLowerCase() === "accept-language");

    if (existing) {
      existing.value = SETTINGS.acceptLanguage;
    } else {
      headers.push({
        name: "Accept-Language",
        value: SETTINGS.acceptLanguage
      });
    }

    return { requestHeaders: headers };
  },
  { urls: REQUEST_URLS },
  ["blocking", "requestHeaders"]
);

//console.log("SLS listeners registered");
//console.log("webRequest exists:", Boolean(browser.webRequest));
//console.log("onBeforeRequest exists:", Boolean(browser.webRequest?.onBeforeRequest));