export type Language = 'en' | 'ar';

export interface TranslationStrings {
  appTitle: string;
  appSubtitle: string;
  timelineFilter: string;
  yearSuffix: string;
  revelationLabel: string;
  farewellLabel: string;
  keyboardShortcutTip: string;
  categoriesTitle: string;
  activeCount: string;
  eventsTitle: string;
  clickCardTip: string;
  searchPlaceholder: string;
  clearSearch: string;
  noEventsMatch: string;
  noEventsFilter: string;
  collapseEvents: string;
  expandEvents: string;
  mapView: string;
  closeDrawer: string;
  toggleLanguage: string;
  selectLanguage: string;
}

export const UI_STRINGS: Record<Language, TranslationStrings> = {
  en: {
    appTitle: 'Spatial Seerah',
    appSubtitle: 'Interactive historical timeline',
    timelineFilter: 'Timeline Filter',
    yearSuffix: 'CE',
    revelationLabel: '610 CE (Revelation)',
    farewellLabel: '632 CE (Farewell)',
    keyboardShortcutTip: '← / → keys',
    categoriesTitle: 'Categories',
    activeCount: 'active',
    eventsTitle: 'Events',
    clickCardTip: 'Click card to pan map camera',
    searchPlaceholder: 'Search events (e.g., Badr, Hudaibiyah)...',
    clearSearch: 'Clear search query',
    noEventsMatch: 'No events match "{query}".',
    noEventsFilter: 'No events match the active filters.',
    collapseEvents: '▼ Map View',
    expandEvents: '▲ Events',
    mapView: 'Map View',
    closeDrawer: 'Close event detail drawer',
    toggleLanguage: 'Language',
    selectLanguage: 'Switch to Arabic'
  },
  ar: {
    appTitle: 'السيرة المكانية',
    appSubtitle: 'جدول زمني وخريطة تفاعلية للسيرة النبوية',
    timelineFilter: 'تصفية الجدول الزمني',
    yearSuffix: 'م',
    revelationLabel: '610 م (بداية الوحي)',
    farewellLabel: '632 م (حجة الوداع)',
    keyboardShortcutTip: 'مفاتيح ← / →',
    categoriesTitle: 'التصنيفات',
    activeCount: 'نشط',
    eventsTitle: 'الأحداث',
    clickCardTip: 'انقر على الحدث للانتقال إليه على الخريطة',
    searchPlaceholder: 'ابحث في الأحداث (مثل: بدر، الحديبية)...',
    clearSearch: 'مسح نص البحث',
    noEventsMatch: 'لا توجد نتائج تطابق "{query}".',
    noEventsFilter: 'لا توجد أحداث تطابق التصنيفات المحددة.',
    collapseEvents: '▼ عرض الخريطة',
    expandEvents: '▲ الأحداث',
    mapView: 'عرض الخريطة',
    closeDrawer: 'إغلاق تفاصيل الحدث',
    toggleLanguage: 'اللغة',
    selectLanguage: 'التحويل إلى الإنجليزية'
  }
};

export function cleanArabicTypography(text: string): string {
  if (!text) return '';
  let norm = text;
  norm = norm.replace(/ـ+/g, '');

  norm = norm.replace(/[\}\{{﴿]\s*([^\}\{{﴿﴾]+?)\s*[\}\{{﴾]/g, (match, v) => {
    let verse = v.strip ? v.strip() : v.trim();
    verse = verse.replace(/([\u0600-\u06FF])\s+([\u064B-\u0652])/g, '$1$2');
    verse = verse.replace(/([\u064B\u064C\u064D])(?=[\u0600-\u06FF])/g, '$1 ');
    verse = verse.replace(/(\u0650\u0651?|\u0651?\u0650)(?=[للوَمَعَمَنْإِنْبتحخهأإآ])/g, '$1 ');
    verse = verse.replace(/\s+/g, ' ').trim();
    return ` ﴿ ${verse} ﴾ `;
  });

  norm = norm.replace(/\)\s*([^\(\)]+?)\s*\(/g, '($1)');
  norm = norm.replace(/\]\s*([^\[\]]+?)\s*\[/g, '[$1]');

  norm = norm.replace(/([\u064B\u064C\u064D])\s+ا\b/g, '$1ا');
  norm = norm.replace(/([\u064B\u064C\u064D]ا)(?=[\u0600-\u06FF])/g, '$1 ');
  norm = norm.replace(/([\u064B\u064C\u064D])(?=[\u0600-\u06FF])/g, '$1 ');

  norm = norm.replace(/([:\(\[]?)\s*م\s+عليك\b/g, '$1 اللهم عليك');

  norm = norm.replace(/\bعنهالنبي\b/g, 'عنه النبي');
  norm = norm.replace(/\bقالالله\b/g, 'قال الله');
  norm = norm.replace(/\bسمّىالله\b/g, 'سمّى الله');
  norm = norm.replace(/\bعدّرسول\b/g, 'عدّ رسول');
  norm = norm.replace(/\bصرعىفي\b/g, 'صرعى في');
  norm = norm.replace(/\bعلىبعض\b/g, 'على بعض');
  norm = norm.replace(/\bعلىبعضهم\b/g, 'على بعضهم');
  norm = norm.replace(/\bر\s+سول\b/g, 'رسول');

  norm = norm.replace(/\s+([.،:!؟])/g, '$1');
  norm = norm.replace(/[ \t]+/g, ' ');
  return norm.trim();
}
