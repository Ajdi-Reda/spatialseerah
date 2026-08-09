import React from 'react';
import { CategoryMap, type Category } from '../constants/categories';

export interface SelectedEventData {
  properties: {
    id: string;
    title: string;
    year: number;
    category: Category;
    description: string;
  };
  coordinates: [number, number];
}

interface EventDetailDrawerProps {
  selectedEvent: SelectedEventData;
  onClose: () => void;
}

export default function EventDetailDrawer({ selectedEvent, onClose }: EventDetailDrawerProps) {
  const catInfo = CategoryMap[selectedEvent.properties.category];
  const catColorClass = catInfo ? catInfo.colorClass : 'bg-ink-900';
  const catLabel = catInfo ? catInfo.label : selectedEvent.properties.category;

  return (
    <div className="fixed sm:absolute inset-x-3 bottom-3 sm:inset-auto sm:top-8 sm:right-8 sm:bottom-8 sm:w-[28rem] max-h-[85vh] sm:max-h-none bg-parchment-100/98 backdrop-blur-md rounded-2xl sm:rounded-xl shadow-2xl border border-ink-900/15 p-5 sm:p-7 z-30 flex flex-col pointer-events-auto transition-all animate-in slide-in-from-bottom-4 duration-300">
      {/* Mobile Grab Handle */}
      <div className="w-10 h-1 rounded-full bg-ink-900/20 mx-auto -mt-1 mb-3 sm:hidden" />

      <div className="flex justify-between items-center mb-4 pb-3 border-b border-ink-900/10">
        <div className="flex items-center gap-2.5">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full text-parchment-100 tracking-wider uppercase ${catColorClass}`}>
            {catLabel}
          </span>
          <span className="text-xs font-extrabold text-marker-treaties font-mono tabular-nums">{selectedEvent.properties.year} CE</span>
        </div>
        <button 
          onClick={onClose}
          aria-label="Close event detail drawer"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-ink-900/5 hover:bg-ink-900/10 text-ink-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900"
        >
          ✕
        </button>
      </div>
      
      <h2 className="font-serif font-bold text-ink-900 text-xl sm:text-2xl leading-tight mb-4">
        {selectedEvent.properties.title}
      </h2>
      
      <div className="flex-1 overflow-y-auto pr-2 styled-scrollbar flex flex-col gap-3">
        {selectedEvent.properties.description.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="text-xs sm:text-sm text-ink-700 leading-relaxed font-serif">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
