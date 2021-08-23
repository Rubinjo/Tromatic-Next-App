import * as Localization from "expo-localization";
import i18n from "i18n-js";

// Import all locales
import de from "../locales/de.json";
import en from "../locales/en.json";
import nl from "../locales/nl.json";

// Define the supported translations
i18n.translations = {
  en,
  de,
  nl,
};

i18n.locale = "nl";

// Fallback to English if user locale doesn't exists
i18n.fallbacks = true;

export default i18n;
