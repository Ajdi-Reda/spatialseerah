export type Category = 'battles' | 'treaties' | 'migrations' | 'biography' | 'preaching';

export interface CategoryInfo {
  id: Category;
  label: string;
  colorHex: string;
  colorClass: string;
}

export const CategoryMap: Record<Category, CategoryInfo> = {
  biography: {
    id: 'biography',
    label: 'Biography & Life',
    colorHex: '#4A3E3D',
    colorClass: 'bg-marker-biography'
  },
  preaching: {
    id: 'preaching',
    label: 'Preaching & Da\'wah',
    colorHex: '#0D9488',
    colorClass: 'bg-marker-preaching'
  },
  battles: {
    id: 'battles',
    label: 'Battles & Military',
    colorHex: '#9C2A2A',
    colorClass: 'bg-marker-battles'
  },
  treaties: {
    id: 'treaties',
    label: 'Treaties & Pledges',
    colorHex: '#2A5A4A',
    colorClass: 'bg-marker-treaties'
  },
  migrations: {
    id: 'migrations',
    label: 'Migrations',
    colorHex: '#B8860B',
    colorClass: 'bg-marker-migrations'
  }
};

export const CATEGORIES_LIST: CategoryInfo[] = [
  CategoryMap.biography,
  CategoryMap.preaching,
  CategoryMap.battles,
  CategoryMap.treaties,
  CategoryMap.migrations
];
