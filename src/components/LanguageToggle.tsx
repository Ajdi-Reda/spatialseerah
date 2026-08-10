import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      aria-label={t.selectLanguage}
      title={t.selectLanguage}
      className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-parchment-100/95 backdrop-blur-md border border-ink-900/20 text-ink-900 font-sans font-bold text-[11px] sm:text-xs shadow-sm hover:bg-parchment-200 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 cursor-pointer pointer-events-auto shrink-0"
    >
      <span className={language === 'en' ? 'text-marker-treaties font-extrabold' : 'text-ink-700/60'}>
        EN
      </span>
      <span className="text-ink-900/40 text-[10px] sm:text-xs">|</span>
      <span className={language === 'ar' ? 'text-marker-treaties font-arabic font-extrabold text-xs sm:text-sm' : 'text-ink-700/60 font-arabic text-xs sm:text-sm'}>
        <span className="sm:hidden">AR</span>
        <span className="hidden sm:inline">العربية</span>
      </span>
    </button>
  );
}
