# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro, React 18+ (Astro Islands), Tailwind CSS, MapLibre GL JS, Vercel

## Users

Individuals, students, and historians exploring the Seerah (life of Prophet Muhammad) interactively.

## Product Purpose

A high-performance, purely static interactive map of the Seerah. Success means a sub-2-second Time to Interactive (TTI) and seamless spatial exploration decoupled from any backend.

## Positioning

An immersive historical experience completely devoid of modern political borders, highway shields, and contemporary labels, built with a strictly static architecture to ensure absolute reliability and speed.

## Operating Context

Desktop and mobile web browsers. Users will interact via a lateral timeline slider (or bottom sheet on mobile) to filter events by year and category while the map smoothly pans (FlyTo) to exact coordinates.

## Capabilities and Constraints

- **Capabilities:** Interactive Timeline, Category Filtering, smooth map panning, static GeoJSON rendering.
- **Constraints:** Zero dynamic backend or API calls for core data. MapLibre GL JS is strictly required (no mapbox-gl). No server-side rendering (SSR) of WebGL dependencies.

## Brand Commitments

- **Tone:** Grounded, historical, quiet support.
- **Palette:** Parchment backgrounds (`bg-parchment-100`, `bg-parchment-200`). Event markers mapped strictly to: Muted Terracotta (Battles), Sage/Indigo (Treaties/Revelations), Dark Gold (Migrations).
- **Typography:** Serif headers (Merriweather or Playfair Display) with wide tracking. Sans-serif body (Inter or System UI) for high legibility.
- **Visuals:** Map base style must be minimal terrain or satellite, completely free of modern geopolitical markers.

## Evidence on Hand

The primary source material for extraction is `English_ArRaheeq_AlMakhtum_THE_SEALED_NECTAR.pdf`.
