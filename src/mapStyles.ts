import type { LayerProps } from 'react-map-gl/maplibre';
import { CategoryMap } from './constants/categories';

export const clusterLayerStyle: LayerProps = {
  id: 'clusters',
  type: 'circle',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': '#2A5A4A',
    'circle-radius': [
      'step',
      ['get', 'point_count'],
      16,
      10, 20,
      25, 26
    ],
    'circle-stroke-width': 3,
    'circle-stroke-color': '#E8E2D2'
  }
};

export const clusterCountLayerStyle: LayerProps = {
  id: 'cluster-count',
  type: 'symbol',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
    'text-size': 13,
    'text-allow-overlap': true,
    'text-ignore-placement': true
  },
  paint: {
    'text-color': '#E8E2D2'
  }
};

export const unclusteredPointLayerStyle: LayerProps = {
  id: 'unclustered-point',
  type: 'circle',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-radius': 7,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#1A1C20',
    'circle-color': [
      'match',
      ['get', 'category'],
      'battles', CategoryMap.battles.colorHex,
      'treaties', CategoryMap.treaties.colorHex,
      'migrations', CategoryMap.migrations.colorHex,
      'biography', CategoryMap.biography.colorHex,
      'preaching', CategoryMap.preaching.colorHex,
      '#555555'
    ]
  }
};

export function getUnclusteredLabelLayerStyle(isRTL: boolean): LayerProps {
  return {
    id: 'unclustered-label',
    type: 'symbol',
    filter: ['!', ['has', 'point_count']],
    layout: {
      'text-field': isRTL 
        ? ['coalesce', ['get', 'title_ar'], ['get', 'title']] 
        : ['get', 'title'],
      'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
      'text-size': 12,
      'text-anchor': isRTL ? 'right' : 'left',
      'text-offset': isRTL ? [-1.2, 0] : [1.2, 0],
      'text-justify': isRTL ? 'right' : 'left',
      'text-padding': 6,
      'text-allow-overlap': false,
      'text-optional': true
    },
    paint: {
      'text-color': '#1A1C20',
      'text-halo-color': '#E8E2D2',
      'text-halo-width': 3,
      'text-halo-blur': 0.5
    }
  };
}

export const unclusteredLabelLayerStyle: LayerProps = getUnclusteredLabelLayerStyle(false);

export function getCitiesLayerStyle(isRTL: boolean): LayerProps {
  return {
    id: 'cities-layer-top',
    type: 'symbol',
    layout: {
      'text-field': isRTL 
        ? ['coalesce', ['get', 'name_ar'], ['get', 'name']] 
        : ['get', 'name'],
      'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
      'text-size': 13,
      'text-transform': isRTL ? 'none' : 'uppercase',
      'text-letter-spacing': isRTL ? 0 : 0.15,
      'text-anchor': [
        'match', ['get', 'name'],
        'Makkah', isRTL ? 'left' : 'right',
        'Madinah', isRTL ? 'right' : 'left',
        'top'
      ] as any,
      'text-offset': [
        'match', ['get', 'name'],
        'Makkah', ['literal', [isRTL ? 2.5 : -2.5, 0]],
        'Madinah', ['literal', [isRTL ? -2.5 : 2.5, 0]],
        ['literal', [0, 1.8]]
      ] as any,
      'text-allow-overlap': true,
      'text-ignore-placement': true
    },
    paint: {
      'text-color': '#2C1E16',
      'text-halo-color': '#E8E2D2',
      'text-halo-width': 4,
      'text-halo-blur': 0.5
    }
  };
}

export const citiesLayerStyle: LayerProps = getCitiesLayerStyle(false);

export const parchmentStyle = {
  version: 8,
  glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
  sources: {
    'landmass': {
      type: 'geojson',
      data: '/data/land.geojson'
    },
    'terrain': {
      type: 'raster-dem',
      tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
      encoding: 'terrarium',
      tileSize: 256,
      maxzoom: 15
    },
    'cities': {
      type: 'geojson',
      data: '/data/cities.geojson'
    },
    'regions': {
      type: 'geojson',
      data: '/data/regions.geojson'
    },
    'routes': {
      type: 'geojson',
      data: '/data/routes.geojson'
    }
  },
  layers: [
    {
      id: 'background-water',
      type: 'background',
      paint: {
        'background-color': '#D0CAB8'
      }
    },
    {
      id: 'land-layer',
      type: 'fill',
      source: 'landmass',
      paint: {
        'fill-color': '#E8E2D2',
        'fill-outline-color': '#C8BBA0'
      }
    },
    {
      id: 'hillshade-layer',
      type: 'hillshade',
      source: 'terrain',
      paint: {
        'hillshade-shadow-color': '#7A6A5A',
        'hillshade-highlight-color': '#FFFFFF',
        'hillshade-accent-color': '#8B7355',
        'hillshade-exaggeration': 0.7
      }
    },
    {
      id: 'routes-layer',
      type: 'line',
      source: 'routes',
      paint: {
        'line-color': '#A68A6B',
        'line-width': 2,
        'line-dasharray': [3, 4],
        'line-opacity': 0.7
      }
    },
    {
      id: 'regions-layer',
      type: 'symbol',
      source: 'regions',
      layout: {
        'text-field': ['get', 'name'],
        'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
        'text-size': [
          'interpolate', ['linear'], ['zoom'],
          4, 16,
          8, 48
        ],
        'text-letter-spacing': 0.8,
        'text-anchor': 'center'
      },
      paint: {
        'text-color': '#B5A58D',
        'text-halo-color': '#E8E2D2',
        'text-halo-width': 2,
        'text-opacity': 0.45
      }
    }
  ]
};
