import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "jalmitra_language";

// Keeps the selected UI language in sync across every page and browser
// reloads, instead of resetting to English whenever the user navigates
// away from the chat screen.
export function useLanguage() {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState(
    () => localStorage.getItem(STORAGE_KEY) || i18n.language || "en"
  );

  useEffect(() => {
    if (i18n.language !== language) i18n.changeLanguage(language);
  }, [language, i18n]);

  const setLanguage = useCallback((code) => {
    localStorage.setItem(STORAGE_KEY, code);
    setLanguageState(code);
  }, []);

  return [language, setLanguage];
}
