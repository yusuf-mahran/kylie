# Implementation Plan: Brand Foundation

**Branch**: `[001-brand-foundation]` | **Date**: 2026-06-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-brand-foundation/spec.md`

## Summary

Establish the visual identity, localization system, and design tokens for Kylie Cosmetics before any commerce features are built. The outcome is an Arabic-first, RTL-native storefront foundation with English as a secondary language, a consistent brand token system (colors, typography, spacing), and reusable base components.

## Technical Context

**Language/Version**: TypeScript 5, Next.js 16 App Router, React 19

**Primary Dependencies**: TailwindCSS 4, Shadcn/UI, next-intl, next/font/google (Cairo, Tajawal, Inter), class-variance-authority, lucide-react, clsx, tailwind-merge

**Storage**: N/A (no data persistence in this phase)

**Testing**: `pnpm lint`, `pnpm build`, manual browser validation at `/` and `/en`, in-app `/style-guide` demo page

**Target Platform**: Web, mobile-first (320px+), responsive to desktop

**Project Type**: Web application

**Performance Goals**: Zero layout shift on font load (CLS = 0), first paint optimized via Server Components and `next/font`

**Constraints**: Brand colors and fonts are fixed; no dark mode; all text must come from translation files

**Scale/Scope**: Single-market cosmetics storefront, two locales, shared component library for ~11 future specs

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Repository Pattern**: N/A for this phase — no Supabase access required.
- **II. Server-First Rendering**: Pages and layouts are Server Components by default; only RTL direction switching uses a minimal Client Component.
- **III. Arabic-First, RTL-Native**: Arabic default (`/`), English secondary (`/en`), all strings externalized in translation files.
- **IV. Brand Token System**: Colors restricted to cream/sand/gold/rose; typography uses Cairo/Tajawal/Inter.
- **V. Clean, Focused Components**: Each base component has a single responsibility.

All gates pass.

## Project Structure

### Documentation (this feature)

```text
specs/001-brand-foundation/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx              # Root layout: fonts, default ar/rtl
│   ├── globals.css             # Brand tokens + shadcn theme
│   └── [locale]/
│       ├── layout.tsx          # Locale layout: NextIntlClientProvider, RTLProvider
│       ├── page.tsx            # Demo landing page
│       └── style-guide/
│           └── page.tsx        # Component demo page
├── components/
│   ├── ui/                     # Shadcn primitives
│   └── shared/
│       ├── rtl-provider.tsx    # RTL/LTR direction wrapper
│       ├── typography.tsx      # Heading, Subheading, BodyText, Caption
│       ├── brand-button.tsx    # Primary/secondary/ghost buttons
│       ├── brand-badge.tsx     # New/offer/best-seller badges
│       └── section-wrapper.tsx # Max-width container + vertical rhythm
├── i18n/
│   ├── routing.ts              # Locale routing config
│   ├── request.ts              # Message loading config
│   └── navigation.ts           # Typed navigation helpers
├── lib/
│   └── utils.ts                # cn() helper
├── messages/
│   ├── ar.json                 # Arabic translations
│   └── en.json                 # English translations
└── middleware.ts               # next-intl middleware
```

**Structure Decision**: Single Next.js web application with feature-based folders. No backend changes needed for this phase.

## Complexity Tracking

No constitution violations; this section is intentionally left blank.
