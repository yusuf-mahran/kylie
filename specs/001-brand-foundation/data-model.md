# Data Model: Brand Foundation

## Overview

This phase does not introduce any persisted data entities. The only structured data is the **translation message catalog**, which lives as static JSON files under `src/messages/`.

## Translation Message Catalog

Each locale has a single JSON file:

- `src/messages/ar.json` — Arabic copy
- `src/messages/en.json` — English copy

### Structure

Messages are grouped by namespace to match feature areas:

```jsonc
{
  "HomePage": {
    "title": "...",
    "subtitle": "...",
    "cta": "...",
    "description": "..."
  },
  "Common": {
    "siteName": "...",
    "shop": "...",
    "cart": "...",
    "favorites": "...",
    "orders": "...",
    "addToCart": "...",
    "addToFavorites": "...",
    "viewAll": "...",
    "loading": "...",
    "error": "...",
    "tryAgain": "..."
  },
  "Badges": {
    "new": "...",
    "offer": "...",
    "bestSeller": "..."
  }
}
```

### Validation Rules

- Every user-facing string MUST be defined in both `ar.json` and `en.json`.
- Namespace and key names MUST use camelCase and be consistent across locales.
- Missing keys in the active locale fall back to the Arabic translation.

## Component Prop Shapes

No database entities are involved, but the base components expose typed props:

### `BrandButton`

- `variant`: `'primary' | 'secondary' | 'ghost'`
- `size`: `'default' | 'sm' | 'lg' | 'icon'`
- `asChild?: boolean`
- Standard button attributes

### `BrandBadge`

- `variant`: `'new' | 'offer' | 'bestSeller'`
- Standard span attributes

### `Typography` Components

- `Heading`: `as?: 'h1' | 'h2' | 'h3' | 'h4'`, `size?: 'xl' | '2xl' | '3xl' | '4xl'`
- `Subheading`: `as?: 'h2' | 'h3' | 'h4'`, `size?: 'lg' | 'xl' | '2xl'`
- `BodyText`: `size?: 'sm' | 'base' | 'lg'`, `muted?: boolean`
- `Caption`: `muted?: boolean`

### `SectionWrapper`

- `padded?: boolean` — applies vertical rhythm
- `contained?: boolean` — applies max-width and horizontal padding
