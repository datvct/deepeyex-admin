import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import vi from "./locales/vi/translation.json";

i18n
  .use(LanguageDetector) // tự động phát hiện ngôn ngữ từ browser hoặc localStorage
  .use(initReactI18next) // kết nối với React
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    fallbackLng: "vi", // Ngôn ngữ mặc định
    debug: false,
    interpolation: {
      escapeValue: false, // React đã tự xử lý XSS
    },
  });

export default i18n;
