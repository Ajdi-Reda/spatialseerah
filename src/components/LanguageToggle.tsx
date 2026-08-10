import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      aria-label={t.selectLanguage}
      title={t.selectLanguage}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-parchment-100/95 backdrop-blur-md border border-ink-900/20 text-ink-900 font-sans font-bold text-xs shadow-md hover:bg-parchment-200 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 cursor-pointer pointer-events-auto"
    >
      <span className={language === 'en' ? 'text-marker-treaties font-extrabold' : 'text-ink-700/60'}>
        EN
      </span>
      <span className="text-ink-900/40">|</span>
      <span className={language === 'ar' ? 'text-marker-treaties font-arabic font-extrabold text-sm' : 'text-ink-700/60 font-arabic text-sm'}>
        العربية
      </span>
    </button>
  );
}
