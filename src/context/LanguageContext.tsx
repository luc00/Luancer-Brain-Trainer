import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, detectUserLanguage, saveUserLanguage, translations, SUPPORTED_LANGUAGES, LanguageOption } from '../i18n';

interface LanguageContextType {
  lang: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['it'];
  languages: LanguageOption[];
  currentLanguageOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(detectUserLanguage);

  useEffect(() => {
    saveUserLanguage(lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
    saveUserLanguage(newLang);
  };

  const t = translations[lang] || translations.it;
  const currentLanguageOption = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t, languages: SUPPORTED_LANGUAGES, currentLanguageOption }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    const fallbackLang = detectUserLanguage();
    return {
      lang: fallbackLang,
      setLanguage: () => {},
      t: translations[fallbackLang] || translations.it,
      languages: SUPPORTED_LANGUAGES,
      currentLanguageOption: SUPPORTED_LANGUAGES[0],
    };
  }
  return context;
}
