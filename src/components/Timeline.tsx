import React, { useState, useEffect, useMemo } from 'react';
import { CATEGORIES_LIST, CategoryMap, type Category } from '../constants/categories';

interface TimelineProps {
  currentYear: number;
  setCurrentYear: (year: number) => void;
  activeCategories: Category[];
  toggleCategory: (category: Category) => void;
  events: any[];
  onEventClick: (lng: number, lat: number, properties?: any) => void;
}

export default function Timeline({ 
  currentYear, 
  setCurrentYear, 
  activeCategories, 
  toggleCategory, 
  events, 
  onEventClick 
}: TimelineProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

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

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const q = searchQuery.toLowerCase();
    return events.filter(e => 
      e.properties.title.toLowerCase().includes(q) ||
      e.properties.description.toLowerCase().includes(q)
    );
  }, [events, searchQuery]);

  return (
    <div className={`fixed inset-x-3 bottom-3 sm:absolute sm:inset-auto sm:top-8 sm:left-8 sm:w-96 bg-parchment-100/95 backdrop-blur-md rounded-2xl sm:rounded-xl shadow-2xl border border-ink-900/15 p-4 sm:p-5 z-20 pointer-events-auto flex flex-col gap-3 transition-all duration-300 ${
      isMobileExpanded 
        ? 'h-[75vh] sm:h-[calc(100vh-4rem)] sm:max-h-[840px]' 
        : 'max-h-[220px] sm:max-h-[840px] sm:h-[calc(100vh-4rem)]'
    }`}>
      {/* Mobile Handle & Header */}
      <div className="flex-none flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-ink-900 leading-tight drop-shadow-sm">Spatial Seerah</h1>
          <p className="font-sans text-[11px] sm:text-xs text-ink-700 font-medium">Interactive historical timeline</p>
        </div>
        <button
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          className="sm:hidden text-xs font-bold px-3 py-1.5 rounded-full bg-ink-900 text-parchment-100 flex items-center gap-1 shadow-sm"
          aria-label={isMobileExpanded ? "Collapse events list" : "Expand events list"}
        >
          <span>{isMobileExpanded ? '▼ Map View' : `▲ Events (${filteredEvents.length})`}</span>
        </button>
      </div>

      {/* Year Slider */}
      <section className="flex-none flex flex-col gap-1.5 bg-ink-900/5 p-2.5 sm:p-3 rounded-lg border border-ink-900/10">
        <div className="font-serif font-bold text-ink-900 text-xs sm:text-sm flex justify-between items-center">
          <label htmlFor="timeline-year-slider" className="cursor-pointer">Timeline Filter</label>
          <span className="text-lg sm:text-xl text-marker-treaties tabular-nums font-sans font-extrabold">{currentYear} CE</span>
        </div>
        <input 
          id="timeline-year-slider"
          type="range" 
          min={610} 
          max={632} 
          value={currentYear} 
          aria-label="Filter timeline by year (610 to 632 CE)"
          onChange={(e) => setCurrentYear(Number(e.target.value))}
          className="w-full accent-ink-900 cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 rounded"
        />
        <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-ink-700 font-sans">
          <span>610 CE (Revelation)</span>
          <span className="font-mono text-[10px] text-ink-700/80 bg-ink-900/10 px-1.5 py-0.5 rounded border border-ink-900/10 hidden sm:inline" title="Use Arrow Left or Arrow Right on keyboard to change year">← / → keys</span>
          <span>632 CE (Farewell)</span>
        </div>
      </section>

      {/* Category Pills */}
      <section className="flex-none flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-ink-900 text-[11px] sm:text-xs tracking-wider uppercase">Categories</h2>
          <span className="text-[10px] sm:text-xs text-ink-700 font-sans">{activeCategories.length}/{CATEGORIES_LIST.length} active</span>
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-1.5" role="group" aria-label="Category filters">
          {CATEGORIES_LIST.map(cat => {
            const isActive = activeCategories.includes(cat.id);
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
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Events List (Collapsible on Mobile, Expanded on Desktop) */}
      <section className={`flex-1 min-h-0 flex-col gap-2 border-t border-ink-900/10 pt-2 sm:pt-3 ${
        isMobileExpanded ? 'flex' : 'hidden sm:flex'
      }`}>
        <div className="flex items-center justify-between flex-none">
          <div>
            <h2 className="font-serif font-bold text-ink-900 text-xs sm:text-sm">Events ({filteredEvents.length})</h2>
            <p className="text-[10px] sm:text-[11px] text-ink-700 font-sans">Click card to pan map camera</p>
          </div>
          <span className="text-xs text-ink-700 font-sans hidden sm:inline">610–{currentYear} CE</span>
        </div>

        {/* Search Query Input */}
        <div className="relative flex-none">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events (e.g., Badr, Hudaibiyah)..."
            aria-label="Search events by title or description"
            className="w-full text-xs px-3 py-1.5 sm:py-2 pr-7 rounded-lg bg-parchment-100 border border-ink-900/15 text-ink-900 placeholder-ink-700/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search query"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-700 hover:text-ink-900 text-xs p-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink-900"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1 pb-2 flex flex-col gap-2 styled-scrollbar">
          {filteredEvents.length === 0 ? (
            <p className="text-xs text-ink-700 italic p-4 text-center">
              {searchQuery ? `No events match "${searchQuery}".` : 'No events match the active filters.'}
            </p>
          ) : (
            filteredEvents.map(event => {
              const catInfo = CategoryMap[event.properties.category as Category];
              const catColorClass = catInfo ? catInfo.colorClass : 'bg-ink-700';
              const catLabel = catInfo ? catInfo.label : event.properties.category;
              return (
                <div 
                  key={event.properties.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    onEventClick(event.geometry.coordinates[0], event.geometry.coordinates[1], event.properties);
                    // On mobile, collapse event feed after selecting so detail drawer & map are visible
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
                  className="text-left p-2.5 sm:p-3 rounded-lg border border-ink-900/10 hover:border-ink-900/30 hover:bg-ink-900/5 transition-all group shadow-sm bg-parchment-100/90 flex flex-col gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${catColorClass}`} />
                      <span className="text-[10px] sm:text-[11px] font-bold text-ink-700 uppercase tracking-wider">{catLabel}</span>
                    </div>
                    <span className="text-xs font-bold text-marker-treaties font-mono">{event.properties.year} CE</span>
                  </div>
                  <h3 className="font-serif font-bold text-ink-900 text-xs sm:text-sm group-hover:text-marker-treaties transition-colors leading-snug">{event.properties.title}</h3>
                  <p className="text-[11px] sm:text-xs text-ink-700 line-clamp-2 leading-relaxed">{event.properties.description}</p>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
