// settings.js

const DEFAULT_USER_SETTINGS = {
  enabled: true,
  forceHeader: true,
  languagePreset: "en",
  regionPreset: "ch"
};

const LEGACY_DEFAULT_SETTINGS = {
  enabled: true,
  forceHeader: true,
  uiLanguage: "en",
  region: "ch",
  resultLanguage: "lang_en",
  acceptLanguage: "en-US,en;q=0.9"
};

const STORAGE_DEFAULTS = {
  ...LEGACY_DEFAULT_SETTINGS,
  ...DEFAULT_USER_SETTINGS
};

const getBaseLanguage = (language) => {
  return language.split("-")[0];
};

const createResultLanguage = (language) => {
  return `lang_${language}`;
};

const createAcceptLanguageHeader = (language) => {
  const baseLanguage = getBaseLanguage(language);

  if (baseLanguage === "en") {
    return language === "en"
      ? "en-US,en;q=0.9"
      : `${language},en;q=0.9`;
  }

  return language === baseLanguage
    ? `${language},en;q=0.7`
    : `${language},${baseLanguage};q=0.9,en;q=0.7`;
};

const isSupportedLanguagePreset = (languagePreset) => {
  return LANGUAGE_PARAM_VALUES.some(({ value }) => value === languagePreset);
};

const isSupportedRegionPreset = (regionPreset) => {
  return REGION_PARAM_VALUES.some(({ value }) => value === regionPreset);
};

const normalizeLanguagePreset = (languagePreset) => {
  return isSupportedLanguagePreset(languagePreset)
    ? languagePreset
    : DEFAULT_USER_SETTINGS.languagePreset;
};

const normalizeRegionPreset = (regionPreset) => {
  return isSupportedRegionPreset(regionPreset)
    ? regionPreset
    : DEFAULT_USER_SETTINGS.regionPreset;
};

const migrateUserSettings = (settings = {}) => {
  return {
    ...settings,

    languagePreset:
      settings.languagePreset ??
      settings.uiLanguage ??
      DEFAULT_USER_SETTINGS.languagePreset,

    regionPreset:
      settings.regionPreset ??
      settings.region ??
      DEFAULT_USER_SETTINGS.regionPreset
  };
};

const resolveSettings = (userSettings = {}) => {
  const migratedSettings = migrateUserSettings(userSettings);

  const settings = {
    ...DEFAULT_USER_SETTINGS,
    ...migratedSettings
  };

  const language = normalizeLanguagePreset(settings.languagePreset);
  const region = normalizeRegionPreset(settings.regionPreset);

  return {
    enabled: Boolean(settings.enabled),
    forceHeader: Boolean(settings.forceHeader),

    languagePreset: language,
    regionPreset: region,

    uiLanguage: language,
    region,
    resultLanguage: createResultLanguage(language),
    acceptLanguage: createAcceptLanguageHeader(language)
  };
};

const getStoredUserSettings = async () => {
  const settings = await browser.storage.local.get(STORAGE_DEFAULTS);

  return migrateUserSettings(settings);
};

const getEffectiveSettings = async () => {
  const settings = await getStoredUserSettings();

  return resolveSettings(settings);
};