import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Language, UI_STRINGS, type TranslationStrings } from '../constants/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationStrings;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('seerah_lang') as Language;
    if (savedLang === 'en' || savedLang === 'ar') {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('seerah_lang', lang);
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'ar' : 'en';
    setLanguage(nextLang);
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    if (language === 'ar') {
      document.documentElement.classList.add('lang-ar');
    } else {
      document.documentElement.classList.remove('lang-ar');
    }
  }, [language]);

  const t = UI_STRINGS[language];
  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
