// background.js

const REQUEST_URLS = ["<all_urls>"];

let SETTINGS = resolveSettings(DEFAULT_USER_SETTINGS);

const refreshCachedSettings = async () => {
  SETTINGS = await getEffectiveSettings();

  // console.log("Settings refreshed:", SETTINGS);
};

refreshCachedSettings();

browser.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;

  refreshCachedSettings();
});

const isSearchEngineHost = (hostname, engine) => {
  const escapedEngine = engine.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const pattern = new RegExp(
    `^([a-z0-9-]+\\.)*${escapedEngine}\\.[a-z.]+$`,
    "i"
  );

  return pattern.test(hostname);
};

const isGoogleHost = (hostname) => {
  return isSearchEngineHost(hostname, "google");
};

const setParam = (url, key, value) => {
  if (value) {
    url.searchParams.set(key, value);
  }
};

const isGoogleSearchPage = (url) => {
  return url.pathname === "/search" || url.searchParams.has("q");
};

const buildRedirectUrl = (rawUrl) => {
  let url;

  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  if (!isGoogleHost(url.hostname)) return null;

  setParam(url, "hl", SETTINGS.uiLanguage);

  if (isGoogleSearchPage(url)) {
    setParam(url, "gl", SETTINGS.region);
    setParam(url, "lr", SETTINGS.resultLanguage);
  }

  const nextUrl = url.toString();

  return nextUrl === rawUrl ? null : nextUrl;
};

const updateAcceptLanguageHeader = (headers) => {
  const existing = headers.find(
    (header) => header.name.toLowerCase() === "accept-language"
  );

  if (existing) {
    existing.value = SETTINGS.acceptLanguage;
    return headers;
  }

  headers.push({
    name: "Accept-Language",
    value: SETTINGS.acceptLanguage
  });

  return headers;
};

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.type !== "main_frame") return {};
    if (!SETTINGS.enabled) return {};

    const redirectUrl = buildRedirectUrl(details.url);

    if (!redirectUrl) return {};

    return {
      redirectUrl
    };
  },
  {
    urls: REQUEST_URLS
  },
  ["blocking"]
);

browser.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    if (details.type !== "main_frame") return {};
    if (!SETTINGS.enabled || !SETTINGS.forceHeader) return {};

    let url;

    try {
      url = new URL(details.url);
    } catch {
      return {};
    }

    if (!isGoogleHost(url.hostname)) return {};

    const requestHeaders = updateAcceptLanguageHeader(
      details.requestHeaders || []
    );

    return {
      requestHeaders
    };
  },
  {
    urls: REQUEST_URLS
  },
  ["blocking", "requestHeaders"]
);

browser.browserAction.onClicked.addListener(() => {
  browser.runtime.openOptionsPage();
});