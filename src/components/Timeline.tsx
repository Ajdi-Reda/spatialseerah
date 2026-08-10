import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CATEGORIES_LIST, CategoryMap, type Category } from '../constants/categories';
import { useLanguage } from '../context/LanguageContext';
import { getHijriYearLabel } from '../constants/i18n';
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
  const activeCardRef = useRef<HTMLButtonElement | null>(null);

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

  const isMeccanEra = currentYear < 622;
  const hijriYearLabel = getHijriYearLabel(currentYear, isRTL);

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`fixed inset-x-3 bottom-3 sm:absolute sm:inset-auto sm:top-8 ${
        isRTL ? 'sm:right-8 sm:left-auto' : 'sm:left-8 sm:right-auto'
      } sm:w-96 bg-parchment-100/95 backdrop-blur-md rounded-2xl sm:rounded-xl shadow-2xl border border-ink-900/15 p-3 sm:p-4 z-20 pointer-events-auto flex flex-col gap-2.5 transition-all duration-300 ${
        isMobileExpanded 
          ? 'h-[80vh] sm:h-[calc(100vh-4rem)] sm:max-h-[840px]' 
          : 'max-h-[175px] sm:max-h-[840px] sm:h-[calc(100vh-4rem)]'
      }`}
    >
      {/* 1. Header & Quick Actions */}
      <div className="flex-none flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h1 className={`font-serif text-lg sm:text-2xl font-bold tracking-wide text-ink-900 leading-tight truncate whitespace-nowrap drop-shadow-sm ${isRTL ? 'font-arabic' : ''}`}>
            {t.appTitle}
          </h1>
          <p className={`hidden sm:block font-sans text-[11px] sm:text-xs text-ink-700 font-medium ${isRTL ? 'font-arabic' : ''}`}>
            {t.appSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <a 
            href="/contact" 
            aria-label={isRTL ? "الإبلاغ عن خطأ / التواصل" : "Report a mistake / Contact"}
            title={isRTL ? "الإبلاغ عن خطأ / التواصل" : "Report a mistake / Contact"}
            className="p-1.5 rounded-lg border border-ink-900/15 bg-parchment-100/90 text-ink-700 hover:text-ink-900 hover:bg-ink-900/10 transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
          <LanguageToggle />
          <button
            type="button"
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            className="sm:hidden text-xs font-bold px-2.5 py-1 rounded-full bg-ink-900 text-parchment-100 flex items-center gap-1 shadow-sm shrink-0 whitespace-nowrap"
            aria-label={isMobileExpanded ? t.collapseEvents : t.expandEvents}
          >
            <span>{isMobileExpanded ? (isRTL ? '▼ خريطة' : '▼ Map') : (isRTL ? `▲ الأحداث (${filteredEvents.length})` : `▲ Events (${filteredEvents.length})`)}</span>
          </button>
        </div>
      </div>

      {/* 2. Streamlined Year Slider */}
      <section className="flex-none flex flex-col gap-1.5 bg-ink-900/5 p-2 sm:p-2.5 rounded-xl border border-ink-900/10" aria-label="Year Slider Filter">
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className={`font-serif font-bold text-ink-900 text-xs sm:text-sm ${isRTL ? 'font-arabic' : ''}`}>
              {t.timelineFilter}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
              isMeccanEra 
                ? 'bg-amber-900/10 text-amber-900 border-amber-900/20' 
                : 'bg-emerald-900/10 text-emerald-900 border-emerald-900/20'
            } ${isRTL ? 'font-arabic' : ''}`}>
              {isMeccanEra ? t.meccanPeriod : t.medinanPeriod}
            </span>
          </div>

          {/* Gregorian & Hijri Date */}
          <div className="flex items-baseline gap-1">
            <span className="text-sm sm:text-base text-marker-treaties tabular-nums font-sans font-extrabold">
              {currentYear} {t.yearSuffix}
            </span>
            <span className="text-[10px] font-bold text-ink-700 font-sans tabular-nums bg-parchment-100 px-1 py-0.5 rounded border border-ink-900/15">
              ({hijriYearLabel})
            </span>
          </div>
        </div>

        <input 
          id="timeline-year-slider"
          type="range" 
          min={610} 
          max={632} 
          value={currentYear} 
          aria-label={`Filter timeline by year (610 to 632 ${t.yearSuffix}, ${hijriYearLabel})`}
          onChange={(e) => setCurrentYear(Number(e.target.value))}
          className="w-full accent-ink-900 cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 rounded h-1.5"
        />
      </section>

      {/* 3. Streamlined Category Filter Pills */}
      <section className="flex-none flex flex-wrap gap-1" role="group" aria-label="Category filters">
        {CATEGORIES_LIST.map(cat => {
          const isActive = activeCategories.includes(cat.id);
          const label = isRTL ? cat.label_ar : cat.label;
          
          const activeColorClass = 
            cat.id === 'battles' ? 'bg-[#9C2A2A] text-parchment-100 border-[#9C2A2A]' :
            cat.id === 'treaties' ? 'bg-[#2A5A4A] text-parchment-100 border-[#2A5A4A]' :
            cat.id === 'migrations' ? 'bg-[#B8860B] text-parchment-100 border-[#B8860B]' :
            cat.id === 'biography' ? 'bg-[#4A3E3D] text-parchment-100 border-[#4A3E3D]' :
            'bg-[#0D9488] text-parchment-100 border-[#0D9488]';

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans font-bold transition-all duration-150 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 cursor-pointer ${
                isActive 
                  ? `${activeColorClass} shadow-2xs scale-100` 
                  : 'bg-parchment-100/90 text-ink-700/70 border-ink-900/15 hover:border-ink-900/30 hover:opacity-100 scale-95'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-parchment-100' : cat.colorClass}`} />
              <span className={isRTL ? 'font-arabic' : ''}>{label}</span>
            </button>
          );
        })}
      </section>

      {/* 4. Events Header & Live Search Bar (Distilled & Space-Optimized) */}
      <section className={`flex-1 min-h-0 flex-col gap-2 border-t border-ink-900/10 pt-2 ${
        isMobileExpanded ? 'flex' : 'hidden sm:flex'
      }`}>
        <div className="flex items-center justify-between gap-2 flex-none">
          <h2 className={`font-serif font-bold text-ink-900 text-xs sm:text-sm whitespace-nowrap ${isRTL ? 'font-arabic' : ''}`}>
            {t.eventsTitle} ({filteredEvents.length})
          </h2>

          {/* Inline Compact Search Input */}
          <div className="relative flex-1 max-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label="Search events"
              className={`w-full text-xs px-2.5 py-1 ${isRTL ? 'pl-6 pr-2.5' : 'pr-6 pl-2.5'} rounded-lg bg-parchment-100 border border-ink-900/15 text-ink-900 placeholder-ink-700/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 ${isRTL ? 'font-arabic' : ''}`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label={t.clearSearch}
                className={`absolute ${isRTL ? 'left-1.5' : 'right-1.5'} top-1/2 -translate-y-1/2 text-ink-700 hover:text-ink-900 text-xs p-0.5 rounded`}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 5. Scrollable Event Cards List (Maximised Vertical Height) */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 pb-1 flex flex-col gap-2 styled-scrollbar" aria-live="polite">
          {filteredEvents.length === 0 ? (
            <div className="p-6 text-center space-y-2">
              <p className={`text-xs text-ink-700 italic ${isRTL ? 'font-arabic' : ''}`}>
                {searchQuery ? t.noEventsMatch.replace('{query}', searchQuery) : t.noEventsFilter}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  CATEGORIES_LIST.forEach(cat => {
                    if (!activeCategories.includes(cat.id)) {
                      toggleCategory(cat.id);
                    }
                  });
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-parchment-100 bg-ink-900 hover:bg-ink-900/90 px-3 py-1.5 rounded-lg shadow-xs transition-colors"
              >
                <span>{t.resetFilters}</span>
              </button>
            </div>
          ) : (
            filteredEvents.map(event => {
              const isSelected = selectedEventId === event.properties.id;
              const catInfo = CategoryMap[event.properties.category as Category];
              const catColorClass = catInfo ? catInfo.colorClass : 'bg-ink-700';
              const catLabel = catInfo ? (isRTL ? catInfo.label_ar : catInfo.label) : event.properties.category;
              const title = isRTL ? (event.properties.title_ar || event.properties.title) : event.properties.title;
              const description = isRTL ? (event.properties.description_ar || event.properties.description) : event.properties.description;

              return (
                <button 
                  key={event.properties.id}
                  ref={isSelected ? activeCardRef : null}
                  type="button"
                  onClick={() => {
                    onEventClick(event.geometry.coordinates[0], event.geometry.coordinates[1], event.properties);
                    if (window.innerWidth < 640) {
                      setIsMobileExpanded(false);
                    }
                  }}
                  className={`text-start p-2.5 sm:p-3 rounded-xl border transition-all group shadow-2xs flex flex-col gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 ${
                    isSelected
                      ? 'border-ink-900/80 bg-ink-900/10 ring-2 ring-ink-900/40 shadow-sm'
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
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-marker-treaties font-mono tabular-nums">
                        {event.properties.year} {t.yearSuffix}
                      </span>
                      <span className="text-[10px] text-ink-700/80 font-sans font-semibold">
                        ({getHijriYearLabel(event.properties.year, isRTL)})
                      </span>
                    </div>
                  </div>
                  <h3 className={`font-serif font-bold text-ink-900 text-xs sm:text-sm group-hover:text-marker-treaties transition-colors leading-snug ${isRTL ? 'font-arabic text-base' : ''} ${isSelected ? 'text-ink-900' : ''}`}>
                    {title}
                  </h3>
                  <p className={`text-[11px] sm:text-xs text-ink-700 line-clamp-2 leading-relaxed ${isRTL ? 'font-arabic text-sm' : ''}`}>
                    {description}
                  </p>
                </button>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
