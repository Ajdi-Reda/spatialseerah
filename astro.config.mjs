// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      target: 'es2022'
    },
    optimizeDeps: {
      include: ['maplibre-gl', 'react-map-gl/maplibre']
    }
  }
});