# Solution: MapLibre GL JS Web Worker Production Bundling Fix

## Symptom
In production (e.g. Vercel deployment), the page renders the UI (timeline, controls, parchment background color), but the MapLibre map tiles and markers fail to render. 
The browser console outputs:
```text
GET https://spatialseerah.vercel.app/_astro/maplibre-gl-shared.mjs
Status 404 (Not Found)
NS_ERROR_CORRUPTED_CONTENT
```

In local development (`astro dev`), the map loads correctly without any errors.

---

## Root Cause
MapLibre GL JS v6 split its web worker architecture into two main JavaScript files:
1. `maplibre-gl-worker.mjs` (worker entrypoint)
2. `maplibre-gl-shared.mjs` (shared worker utility module imported by `maplibre-gl-worker.mjs`)

In `src/components/Map.tsx`, the worker was originally imported using Vite's standard static asset loader syntax:
```typescript
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
```

### Why standard `?url` fails in production:
- `?url` instructs Vite/Rollup to copy the target file verbatim to the build output directory (e.g. `_astro/maplibre-gl-worker.<hash>.mjs`).
- Because `maplibre-gl-worker.mjs` contains `import ... from "./maplibre-gl-shared"`, the browser attempts to fetch `maplibre-gl-shared.mjs` relative to the worker script at runtime.
- However, Vite does **not** trace or bundle sub-dependencies of raw `?url` static assets. Consequently, `maplibre-gl-shared.mjs` is never emitted to the static build output (`dist/_astro/`), producing a 404 HTTP error when the web worker executes in production.
- In local development (`astro dev`), Vite's dev server resolves `node_modules` module specifiers dynamically, masking the bug.

---

## Resolution

Use Vite's specialized worker URL query parameter: `?worker&url`.

```typescript
// src/components/Map.tsx
import { setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl-css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

if (typeof window !== 'undefined') {
  setWorkerUrl(workerUrl);
}
```

### How `?worker&url` resolves the issue:
- Instructs Vite to process `maplibre-gl-worker.mjs` as a **web worker entrypoint**.
- Bundles `maplibre-gl-worker.mjs` along with `maplibre-gl-shared.mjs` and all internal worker dependencies into a single, self-contained JavaScript bundle file (e.g. `maplibre-gl-worker-BFu6eTNh.js`).
- Eliminates secondary HTTP imports for missing shared chunks in production.

---

## Verification
1. Run static build:
   ```bash
   npx astro build
   ```
2. Inspect output in `dist/_astro/`:
   - A single bundled worker JS file will exist (e.g., `maplibre-gl-worker-XXXX.js`).
   - No external requests for `maplibre-gl-shared.mjs` will occur when testing the build via `npx astro preview`.

---

## Key Takeaway for MapLibre + Vite Projects
When using MapLibre GL JS with custom web worker URLs in Vite or Astro projects, **always use `?worker&url`** instead of plain `?url`.
