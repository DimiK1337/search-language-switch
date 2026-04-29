//options.js
const DEFAULT_SETTINGS = {
  enabled: true,
  forceHeader: true,
  uiLanguage: "en",
  region: "ch",
  resultLanguage: "lang_en",
  acceptLanguage: "en-US,en;q=0.9"
};

const $ = (id) => document.getElementById(id);

const fields = Object.keys(DEFAULT_SETTINGS);

const loadSettings = async () => {
  const settings = await browser.storage.local.get(DEFAULT_SETTINGS);

  fields.forEach((field) => {
    const element = $(field);

    if (!element) return;

    if (element.type === "checkbox") {
      element.checked = Boolean(settings[field]);
      return;
    }

    element.value = settings[field] ?? "";
  });
};

const readForm = () => {
  return fields.reduce((nextSettings, field) => {
    const element = $(field);

    if (!element) return nextSettings;

    return {
      ...nextSettings,
      [field]: element.type === "checkbox"
        ? element.checked
        : element.value.trim()
    };
  }, {});
};

const saveSettings = async () => {
  const settings = readForm();

  await browser.storage.local.set(settings);

  $("status").textContent = "Saved.";
  setTimeout(() => {
    $("status").textContent = "";
  }, 1400);
};

$("save").addEventListener("click", saveSettings);

loadSettings();