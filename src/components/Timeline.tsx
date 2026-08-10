import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CATEGORIES_LIST, CategoryMap, type Category } from '../constants/categories';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from './LanguageToggle';

interface TimelineProps {
  currentYear: number;
  setCurrentYear: (year: number) => void;
  activeCategories: Category[];
  toggleCategory: (category: Category) => void;
  events: any[];
  onEventClick: (lng: number, lat: number, properties?: any) => void;
  selectedEventId?: string | number | null;
}

export default function Timeline({ 
  currentYear, 
  setCurrentYear, 
  activeCategories, 
  toggleCategory, 
  events, 
  onEventClick,
  selectedEventId
}: TimelineProps) {
  const { isRTL, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const activeCardRef = useRef<HTMLDivElement | null>(null);

  // Keyboard navigation: Left/Right arrow keys scrub years
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.key === 'ArrowLeft') {
        setCurrentYear(Math.max(610, currentYear - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentYear(Math.min(632, currentYear + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentYear, setCurrentYear]);

  // Scroll active card into view when selected
  useEffect(() => {
    if (selectedEventId && activeCardRef.current) {
      activeCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedEventId]);

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const q = searchQuery.toLowerCase();
    return events.filter(e => {
      const title = (e.properties.title || '').toLowerCase();
      const titleAr = (e.properties.title_ar || '').toLowerCase();
      const desc = (e.properties.description || '').toLowerCase();
      const descAr = (e.properties.description_ar || '').toLowerCase();
      return title.includes(q) || titleAr.includes(q) || desc.includes(q) || descAr.includes(q);
    });
  }, [events, searchQuery]);

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`fixed inset-x-3 bottom-3 sm:absolute sm:inset-auto sm:top-8 ${
        isRTL ? 'sm:right-8 sm:left-auto' : 'sm:left-8 sm:right-auto'
      } sm:w-96 bg-parchment-100/95 backdrop-blur-md rounded-2xl sm:rounded-xl shadow-2xl border border-ink-900/15 p-4 sm:p-5 z-20 pointer-events-auto flex flex-col gap-3 transition-all duration-300 ${
        isMobileExpanded 
          ? 'h-[75vh] sm:h-[calc(100vh-4rem)] sm:max-h-[840px]' 
          : 'max-h-[220px] sm:max-h-[840px] sm:h-[calc(100vh-4rem)]'
      }`}
    >
      {/* Header & Language Toggle */}
      <div className="flex-none flex items-start justify-between gap-2">
        <div>
          <h1 className={`font-serif text-xl sm:text-2xl font-bold tracking-wide text-ink-900 leading-tight drop-shadow-sm ${isRTL ? 'font-arabic' : ''}`}>
            {t.appTitle}
          </h1>
          <p className={`font-sans text-[11px] sm:text-xs text-ink-700 font-medium ${isRTL ? 'font-arabic' : ''}`}>
            {t.appSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <a 
            href="/contact" 
            aria-label={isRTL ? "الإبلاغ عن خطأ / التواصل" : "Report a mistake / Contact"}
            title={isRTL ? "الإبلاغ عن خطأ / التواصل" : "Report a mistake / Contact"}
            className="p-1.5 rounded-lg border border-ink-900/15 bg-parchment-100/90 text-ink-700 hover:text-ink-900 hover:bg-ink-900/10 transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
          <LanguageToggle />
          <button
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            className="sm:hidden text-xs font-bold px-3 py-1.5 rounded-full bg-ink-900 text-parchment-100 flex items-center gap-1 shadow-sm"
            aria-label={isMobileExpanded ? t.collapseEvents : t.expandEvents}
          >
            <span>{isMobileExpanded ? t.collapseEvents : `${t.expandEvents} (${filteredEvents.length})`}</span>
          </button>
        </div>
      </div>

      {/* Year Slider */}
      <section className="flex-none flex flex-col gap-1.5 bg-ink-900/5 p-2.5 sm:p-3 rounded-lg border border-ink-900/10">
        <div className="font-serif font-bold text-ink-900 text-xs sm:text-sm flex justify-between items-center">
          <label htmlFor="timeline-year-slider" className={`cursor-pointer ${isRTL ? 'font-arabic' : ''}`}>
            {t.timelineFilter}
          </label>
          <span className="text-lg sm:text-xl text-marker-treaties tabular-nums font-sans font-extrabold">
            {currentYear} {t.yearSuffix}
          </span>
        </div>
        <input 
          id="timeline-year-slider"
          type="range" 
          min={610} 
          max={632} 
          value={currentYear} 
          aria-label={`Filter timeline by year (610 to 632 ${t.yearSuffix})`}
          onChange={(e) => setCurrentYear(Number(e.target.value))}
          className="w-full accent-ink-900 cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 rounded"
        />
        <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-ink-700 font-sans">
          <span className={isRTL ? 'font-arabic' : ''}>{t.revelationLabel}</span>
          <span className="font-mono text-[10px] text-ink-700/80 bg-ink-900/10 px-1.5 py-0.5 rounded border border-ink-900/10 hidden sm:inline" title="Keyboard navigation: Left / Right arrows">
            {t.keyboardShortcutTip}
          </span>
          <span className={isRTL ? 'font-arabic' : ''}>{t.farewellLabel}</span>
        </div>
      </section>

      {/* Category Pills */}
      <section className="flex-none flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <h2 className={`font-serif font-bold text-ink-900 text-[11px] sm:text-xs tracking-wider uppercase ${isRTL ? 'font-arabic' : ''}`}>
            {t.categoriesTitle}
          </h2>
          <span className="text-[10px] sm:text-xs text-ink-700 font-sans">
            {activeCategories.length}/{CATEGORIES_LIST.length} {t.activeCount}
          </span>
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-1.5" role="group" aria-label="Category filters">
          {CATEGORIES_LIST.map(cat => {
            const isActive = activeCategories.includes(cat.id);
            const label = isRTL ? cat.label_ar : cat.label;
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-sans font-medium transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 ${
                  isActive 
                    ? 'bg-ink-900 text-parchment-100 border-ink-900 shadow-sm scale-100' 
                    : 'bg-parchment-100/80 text-ink-700 border-ink-900/20 hover:border-ink-900/40 opacity-60 hover:opacity-100 scale-95'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${cat.colorClass}`} />
                <span className={isRTL ? 'font-arabic' : ''}>{label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Events List */}
      <section className={`flex-1 min-h-0 flex-col gap-2 border-t border-ink-900/10 pt-2 sm:pt-3 ${
        isMobileExpanded ? 'flex' : 'hidden sm:flex'
      }`}>
        <div className="flex items-center justify-between flex-none">
          <div>
            <h2 className={`font-serif font-bold text-ink-900 text-xs sm:text-sm ${isRTL ? 'font-arabic' : ''}`}>
              {t.eventsTitle} ({filteredEvents.length})
            </h2>
            <p className={`text-[10px] sm:text-[11px] text-ink-700 font-sans ${isRTL ? 'font-arabic' : ''}`}>
              {t.clickCardTip}
            </p>
          </div>
          <span className="text-xs text-ink-700 font-sans hidden sm:inline tabular-nums">
            610–{currentYear} {t.yearSuffix}
          </span>
        </div>

        {/* Search Input */}
        <div className="relative flex-none">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label="Search events"
            className={`w-full text-xs px-3 py-1.5 sm:py-2 ${isRTL ? 'pl-7 pr-3' : 'pr-7 pl-3'} rounded-lg bg-parchment-100 border border-ink-900/15 text-ink-900 placeholder-ink-700/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 shadow-inner ${isRTL ? 'font-arabic' : ''}`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label={t.clearSearch}
              className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 text-ink-700 hover:text-ink-900 text-xs p-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink-900`}
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1 pb-2 flex flex-col gap-2 styled-scrollbar">
          {filteredEvents.length === 0 ? (
            <p className={`text-xs text-ink-700 italic p-4 text-center ${isRTL ? 'font-arabic' : ''}`}>
              {searchQuery ? t.noEventsMatch.replace('{query}', searchQuery) : t.noEventsFilter}
            </p>
          ) : (
            filteredEvents.map(event => {
              const isSelected = selectedEventId === event.properties.id;
              const catInfo = CategoryMap[event.properties.category as Category];
              const catColorClass = catInfo ? catInfo.colorClass : 'bg-ink-700';
              const catLabel = catInfo ? (isRTL ? catInfo.label_ar : catInfo.label) : event.properties.category;
              const title = isRTL ? (event.properties.title_ar || event.properties.title) : event.properties.title;
              const description = isRTL ? (event.properties.description_ar || event.properties.description) : event.properties.description;

              return (
                <div 
                  key={event.properties.id}
                  ref={isSelected ? activeCardRef : null}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    onEventClick(event.geometry.coordinates[0], event.geometry.coordinates[1], event.properties);
                    if (window.innerWidth < 640) {
                      setIsMobileExpanded(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onEventClick(event.geometry.coordinates[0], event.geometry.coordinates[1], event.properties);
                      if (window.innerWidth < 640) {
                        setIsMobileExpanded(false);
                      }
                    }
                  }}
                  className={`text-start p-2.5 sm:p-3 rounded-lg border transition-all group shadow-sm flex flex-col gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 ${
                    isSelected
                      ? 'border-amber-600/80 bg-amber-500/10 ring-2 ring-amber-600/60 shadow-md'
                      : 'border-ink-900/10 bg-parchment-100/90 hover:border-ink-900/30 hover:bg-ink-900/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${catColorClass}`} />
                      <span className={`text-[10px] sm:text-[11px] font-bold text-ink-700 uppercase tracking-wider ${isRTL ? 'font-arabic' : ''}`}>
                        {catLabel}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-marker-treaties font-mono tabular-nums">
                      {event.properties.year} {t.yearSuffix}
                    </span>
                  </div>
                  <h3 className={`font-serif font-bold text-ink-900 text-xs sm:text-sm group-hover:text-marker-treaties transition-colors leading-snug ${isRTL ? 'font-arabic text-base' : ''} ${isSelected ? 'text-amber-900' : ''}`}>
                    {title}
                  </h3>
                  <p className={`text-[11px] sm:text-xs text-ink-700 line-clamp-2 leading-relaxed ${isRTL ? 'font-arabic text-sm' : ''}`}>
                    {description}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
