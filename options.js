// options.js

const $ = (id) => document.getElementById(id);

const fields = Object.keys(DEFAULT_USER_SETTINGS);

const populateSelect = (selectId, values) => {
  const select = $(selectId);

  if (!select) return;

  select.textContent = "";

  values.forEach(({ label, value }) => {
    const option = document.createElement("option");

    option.value = value;
    option.textContent = label;

    select.appendChild(option);
  });
};

const populatePresetFields = () => {
  populateSelect("languagePreset", LANGUAGE_PARAM_VALUES);
  populateSelect("regionPreset", REGION_PARAM_VALUES);
};

const readForm = () => {
  return fields.reduce((nextSettings, field) => {
    const element = $(field);

    if (!element) return nextSettings;

    return {
      ...nextSettings,
      [field]: element.type === "checkbox"
        ? element.checked
        : element.value
    };
  }, {});
};

const setText = (id, value) => {
  const element = $(id);

  if (element) {
    element.textContent = value;
  }
};

const updateGeneratedPreview = () => {
  const effectiveSettings = resolveSettings(readForm());

  setText("previewUiLanguage", effectiveSettings.uiLanguage);
  setText("previewRegion", effectiveSettings.region);
  setText("previewResultLanguage", effectiveSettings.resultLanguage);
  setText("previewAcceptLanguage", effectiveSettings.acceptLanguage);
};

const loadSettings = async () => {
  const settings = await getStoredUserSettings();
  const effectiveSettings = resolveSettings(settings);

  fields.forEach((field) => {
    const element = $(field);

    if (!element) return;

    if (element.type === "checkbox") {
      element.checked = Boolean(effectiveSettings[field]);
      return;
    }

    element.value = effectiveSettings[field] ?? "";
  });

  updateGeneratedPreview();
};

const saveSettings = async () => {
  const settings = readForm();

  await browser.storage.local.set(settings);

  updateGeneratedPreview();

  $("status").textContent = "Saved.";

  setTimeout(() => {
    $("status").textContent = "";
  }, 1400);
};

const showVersion = () => {
  const manifest = browser.runtime.getManifest();
  const versionElement = $("extensionVersion");

  if (versionElement) {
    versionElement.textContent = manifest.version;
  }
};

const addChangeListeners = () => {
  fields.forEach((field) => {
    const element = $(field);

    if (!element) return;

    element.addEventListener("change", updateGeneratedPreview);
  });
};

$("save").addEventListener("click", saveSettings);

populatePresetFields();
addChangeListeners();
loadSettings();
showVersion();