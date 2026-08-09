import React, { useState, useEffect, useMemo, useRef } from 'react';
import Map, { Source, Layer, type MapRef } from 'react-map-gl/maplibre';
import Timeline from './Timeline';
import EventDetailDrawer, { type SelectedEventData } from './EventDetailDrawer';
import { 
  clusterLayerStyle, 
  clusterCountLayerStyle, 
  unclusteredPointLayerStyle, 
  unclusteredLabelLayerStyle, 
  citiesLayerStyle,
  parchmentStyle 
} from '../mapStyles';
import { setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

if (typeof window !== 'undefined') {
  setWorkerUrl(workerUrl);
}

type Category = 'battles' | 'treaties' | 'migrations' | 'biography' | 'preaching';

export default function SeerahMap() {
  const mapRef = useRef<MapRef>(null);
  const [isClient, setIsClient] = useState(false);
  const [currentYear, setCurrentYear] = useState(632);
  const [activeCategories, setActiveCategories] = useState<Category[]>([
    'battles', 'treaties', 'migrations', 'biography', 'preaching'
  ]);
  const [eventsData, setEventsData] = useState<any>(null);
  const [cursor, setCursor] = useState<string>('auto');
  const [selectedEvent, setSelectedEvent] = useState<SelectedEventData | null>(null);

  useEffect(() => {
    setIsClient(true);
    fetch('/data/seerah_timeline_polished.geojson')
      .then(res => res.json())
      .then(data => setEventsData(data));
  }, []);

  const visibleGeoJson = useMemo(() => {
    if (!eventsData) return { type: 'FeatureCollection', features: [] };
    const filteredFeatures = eventsData.features.filter((f: any) =>
      f.properties.year <= currentYear &&
      activeCategories.includes(f.properties.category)
    );
    return {
      type: 'FeatureCollection',
      features: filteredFeatures
    };
  }, [eventsData, currentYear, activeCategories]);

  const visibleEventsList = useMemo(() => {
    return visibleGeoJson.features.slice().sort((a: any, b: any) => a.properties.year - b.properties.year);
  }, [visibleGeoJson]);

  const toggleCategory = (category: Category) => {
    setActiveCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleEventClick = (lng: number, lat: number, properties?: any) => {
    if (properties) {
      setSelectedEvent({
        properties: {
          id: properties.id,
          title: properties.title,
          year: Number(properties.year),
          category: properties.category as Category,
          description: properties.description
        },
        coordinates: [lng, lat]
      });
    }
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const padding = isMobile ? { left: 0, top: 0, bottom: 220, right: 0 } : { left: 340, top: 0, bottom: 0, right: 0 };

    mapRef.current?.flyTo({
      center: [lng, lat],
      zoom: 14,
      padding,
      duration: 1800,
      essential: true
    });
  };

  const handleMapClick = (e: any) => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    if (!e.features || e.features.length === 0) {
      setSelectedEvent(null);
      return;
    }

    const feature = e.features[0];

    // Direct query for cluster features at the click point
    if (feature.layer.id === 'clusters') {
      const clusterId = feature.properties?.cluster_id;
      if (clusterId !== undefined) {
        const source: any = map.getSource('seerah-events');
        source.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
          if (err) return;
          const coords = (feature.geometry as any).coordinates;
          map.easeTo({
            center: coords,
            zoom: Math.max(zoom + 1, 14),
            duration: 800
          });
        });
      }
      return;
    }

    // Query for unclustered single point features at click location
    if (feature.layer.id === 'unclustered-point') {
      const props = feature.properties as any;
      const coords = (feature.geometry as any).coordinates as [number, number];
      setSelectedEvent({
        properties: {
          id: props.id,
          title: props.title,
          year: Number(props.year),
          category: props.category as Category,
          description: props.description
        },
        coordinates: coords
      });

      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
      const padding = isMobile ? { left: 0, top: 0, bottom: 220, right: 0 } : { left: 340, top: 0, bottom: 0, right: 0 };

      map.flyTo({
        center: coords,
        zoom: 14,
        padding,
        duration: 1200
      });
      return;
    }

    // Clicked outside markers
    setSelectedEvent(null);
  };

  if (!isClient) return <div className="absolute inset-0 w-full h-full bg-parchment-200 animate-pulse" />;

  return (
    <div className="absolute inset-0 w-full h-full z-0 font-sans bg-parchment-200">
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.25] mix-blend-multiply z-10">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="1 0 0 0 0, 0 0.95 0 0 0, 0 0.85 0 0 0, 0 0 0 0.25 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
      <Timeline
        currentYear={currentYear}
        setCurrentYear={setCurrentYear}
        activeCategories={activeCategories}
        toggleCategory={toggleCategory}
        events={visibleEventsList}
        onEventClick={handleEventClick}
      />
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 39.6111,
          latitude: 24.4672,
          zoom: 5
        }}
        cursor={cursor}
        mapStyle={parchmentStyle as any}
        interactiveLayerIds={['clusters', 'unclustered-point']}
        onClick={handleMapClick}
        onMouseEnter={() => setCursor('pointer')}
        onMouseLeave={() => setCursor('auto')}
      >
        <Source
          id="seerah-events"
          type="geojson"
          data={visibleGeoJson as any}
          cluster={true}
          clusterMaxZoom={13}
          clusterRadius={45}
        >
          <Layer {...clusterLayerStyle} />
          <Layer {...clusterCountLayerStyle} />
          <Layer {...unclusteredPointLayerStyle} />
          <Layer {...unclusteredLabelLayerStyle} />
        </Source>
        <Source
          id="cities-top-source"
          type="geojson"
          data="/data/cities.geojson"
        >
          <Layer {...citiesLayerStyle} />
        </Source>
      </Map>

      {selectedEvent && (
        <EventDetailDrawer 
          selectedEvent={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  );
}
