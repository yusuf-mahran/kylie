# Implementation Plan: CMS Content Management

**Branch**: `[002-cms-content-management]` | **Date**: 2026-06-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-cms-content-management/spec.md`

## Summary

Build the CMS layer that lets the store owner manage landing page content (hero, vision, about, footer), social links, and promotional reels from the admin dashboard. The implementation introduces Supabase tables for structured content, Cloudinary for image hosting, a typed `CmsRepository`, and admin dashboard pages. Storefront landing page sections will read from the CMS repository server-side.

## Technical Context

**Language/Version**: TypeScript 5, Next.js 16 App Router, React 19

**Primary Dependencies**: Supabase (Auth, PostgreSQL, Storage), Cloudinary, next-cloudinary, React Hook Form, Zod, next-intl

**Storage**: Supabase PostgreSQL for CMS records; Cloudinary for image assets; Supabase Storage not used for CMS images in this spec

**Testing**: `pnpm lint`, `pnpm build`, manual admin dashboard validation, verify landing page renders CMS content in `ar` and `en`

**Target Platform**: Web, mobile-first (320px+), responsive to desktop

**Project Type**: Web application

**Performance Goals**: Storefront landing page reads CMS content server-side with no client-side fetch waterfall; content changes reflect within 10 seconds

**Constraints**: Cloudinary API key/secret must remain server-side; all image assets stored as `{ public_id, secure_url }`; repository pattern enforced; Arabic-first RTL; no hardcoded strings

**Scale/Scope**: Single admin user managing up to 4 landing sections, 4 social links, and 10 reels; images limited to 5 per section

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Repository Pattern**: PASS — all Supabase access for CMS data goes through `CmsRepository`; UI never calls Supabase directly.
- **II. Server-First Rendering**: PASS — storefront landing sections read CMS data in Server Components; only the admin image upload widget requires a minimal Client Component boundary.
- **III. Arabic-First, RTL-Native**: PASS — CMS stores independent Arabic and English content; locale switching renders the correct content and layout direction.
- **IV. Brand Token System**: PASS — admin dashboard UI uses the same brand tokens and base components established in Spec 1.
- **V. Clean, Focused Components**: PASS — repository, upload widget, section forms, and admin pages each have a single responsibility.

All gates pass.

## Project Structure

### Documentation (this feature)

```text
specs/002-cms-content-management/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── app/
│   └── admin/
│       └── cms/
│           ├── page.tsx              # CMS module landing / section list
│           ├── sections/
│           │   └── [key]/
│           │       └── page.tsx      # Section editor (hero, vision, about, footer)
│           ├── reels/
│           │   └── page.tsx          # Reel management
│           └── social/
│               └── page.tsx          # Social link management
├── components/
│   └── admin/
│       └── cms/
│           ├── image-upload-field.tsx   # Cloudinary upload widget wrapper
│           ├── section-form.tsx         # Arabic/English structured fields
│           ├── reel-form.tsx            # Reel video/cover editor
│           └── social-link-form.tsx     # Social link editor
├── features/
│   └── brand/
│       ├── types.ts              # CmsSection, SocialLink, Reel, MediaAsset types
│       └── utils.ts              # Sort/order helpers
├── lib/
│   ├── cloudinary/
│   │   ├── types.ts              # CloudinaryAsset / MediaAsset type
│   │   └── delete.ts             # Server-side Cloudinary destroy utility
│   └── supabase/
│       ├── client.ts             # Browser-safe Supabase client
│       └── server.ts             # Server-side Supabase client
├── repositories/
│   └── cms.repository.ts         # CmsRepository (server-side only)
└── actions/
    └── cloudinary.actions.ts     # Server Action for deleting Cloudinary assets
```

**Structure Decision**: Single Next.js web application with feature-based folders. Admin routes under `src/app/admin/cms/`. CMS domain logic and types under `src/features/brand/`. Shared Cloudinary utilities under `src/lib/cloudinary/` (server-only delete utility clearly separated). All data access through `src/repositories/cms.repository.ts`.

## Complexity Tracking

No constitution violations; this section is intentionally left blank.
