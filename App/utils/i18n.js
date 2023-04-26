import { I18n } from "i18n-js";

// Import all locales
import de from "../locales/de.json";
import en from "../locales/en.json";
import nl from "../locales/nl.json";

const i18n = new I18n({
	...en,
	...de,
	...nl,
});

i18n.locale = "en";

// Fallback to English if user locale doesn't exists
i18n.fallbacks = true;

export default i18n;
