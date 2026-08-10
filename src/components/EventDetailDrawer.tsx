import React from 'react';
import { CategoryMap, type Category } from '../constants/categories';
import { useLanguage } from '../context/LanguageContext';
import { getHijriYearLabel } from '../constants/i18n';

export interface SelectedEventData {
  properties: {
    id: string;
    title: string;
    title_ar?: string;
    year: number;
    category: Category;
    description: string;
    description_ar?: string;
  };
  coordinates: [number, number];
}

interface EventDetailDrawerProps {
  selectedEvent: SelectedEventData;
  onClose: () => void;
}

export default function EventDetailDrawer({ selectedEvent, onClose }: EventDetailDrawerProps) {
  const { isRTL, t } = useLanguage();
  const catInfo = CategoryMap[selectedEvent.properties.category];
  const catColorClass = catInfo ? catInfo.colorClass : 'bg-ink-900';
  const catLabel = catInfo ? (isRTL ? catInfo.label_ar : catInfo.label) : selectedEvent.properties.category;

  const title = isRTL 
    ? (selectedEvent.properties.title_ar || selectedEvent.properties.title) 
    : selectedEvent.properties.title;

  const description = isRTL 
    ? (selectedEvent.properties.description_ar || selectedEvent.properties.description) 
    : selectedEvent.properties.description;

  const hijriYear = getHijriYearLabel(selectedEvent.properties.year, isRTL);

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-event-title"
      className={`fixed sm:absolute inset-x-3 bottom-3 sm:inset-auto sm:top-8 ${
        isRTL ? 'sm:left-8 sm:right-auto' : 'sm:right-8 sm:left-auto'
      } sm:bottom-8 sm:w-[28rem] max-h-[85vh] sm:max-h-none bg-parchment-100/98 backdrop-blur-md rounded-2xl sm:rounded-xl shadow-2xl border border-ink-900/15 p-5 sm:p-7 z-30 flex flex-col pointer-events-auto transition-all animate-in slide-in-from-bottom-4 duration-300`}
    >
      {/* Mobile Grab Handle */}
      <div className="w-10 h-1 rounded-full bg-ink-900/20 mx-auto -mt-1 mb-3 sm:hidden" />

      <div className="flex justify-between items-center mb-4 pb-3 border-b border-ink-900/10">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full text-parchment-100 tracking-wider uppercase ${catColorClass} ${isRTL ? 'font-arabic' : ''}`}>
            {catLabel}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-xs font-extrabold text-marker-treaties font-mono tabular-nums">
              {selectedEvent.properties.year} {t.yearSuffix}
            </span>
            <span className="text-[11px] font-bold text-ink-700 font-sans tabular-nums">
              ({hijriYear})
            </span>
          </div>
        </div>
        <button 
          type="button"
          onClick={onClose}
          aria-label={t.closeDrawer}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-ink-900/5 hover:bg-ink-900/10 text-ink-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 cursor-pointer min-w-[36px] min-h-[36px]"
        >
          ✕
        </button>
      </div>
      
      <h2 id="drawer-event-title" className={`font-serif font-bold text-ink-900 text-xl sm:text-2xl leading-tight mb-4 ${isRTL ? 'font-arabic text-2xl sm:text-3xl' : ''}`}>
        {title}
      </h2>
      
      <div className="flex-1 overflow-y-auto pr-2 styled-scrollbar flex flex-col gap-3">
        {description.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className={`text-xs sm:text-sm text-ink-700 leading-relaxed font-serif ${isRTL ? 'font-arabic text-base sm:text-lg leading-loose' : ''}`}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
