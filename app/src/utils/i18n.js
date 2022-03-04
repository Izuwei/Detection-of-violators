import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import languageDetector from "./langDetector";

import english from "../constants/lang/english.json";
import czech from "../constants/lang/czech.json";

i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources: { en: english, cs: czech },
    keySeparator: false,
    react: { useSuspense: false },
    interpolation: { escapeValue: false },
    compatibilityJSON: "v3",
    debug: false,
  });

export default i18next;
