# Implementation Plan: Product Catalog

**Branch**: `[003-product-catalog]` | **Date**: 2026-06-20 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-product-catalog/spec.md`

## Summary

Build the product catalog data infrastructure and admin management surfaces for the Kylie Cosmetics store. The implementation adds Supabase tables for categories, subcategories, products, product images, and accordion sections; Cloudinary for image hosting; typed `ProductRepository` and `CategoryRepository`; admin dashboard pages under `/admin/products` and `/admin/categories`; and storefront read access for category browsing, search, featured/best-seller lists, and product detail. An optional AI-assisted content enhancement feature helps admins generate titles, slugs, summaries, descriptions, and accordion sections, called server-side via OpenRouter (`openai/gpt-oss-120b:free`).

## Technical Context

**Language/Version**: TypeScript 5, Next.js 16 App Router, React 19

**Primary Dependencies**: Supabase (Auth, PostgreSQL), Cloudinary, next-cloudinary, OpenRouter API, React Hook Form, Zod, next-intl

**Storage**: Supabase PostgreSQL for catalog records; Cloudinary for product and category images; Supabase Storage not used for catalog images

**Testing**: `pnpm lint`, `pnpm build`, manual admin dashboard validation, verify storefront category pages and search in `ar` and `en`

**Target Platform**: Web, mobile-first (320px+), responsive to desktop

**Project Type**: Web application

**Performance Goals**: Storefront category and search pages read catalog data server-side with no client-side fetch waterfall; 95% of searches return results in under 1 second; admin changes reflect on the storefront within 10 seconds

**Constraints**: Cloudinary API key/secret must remain server-side; all image assets stored as `{ public_id, secure_url }`; repository pattern enforced; Arabic-first RTL; no hardcoded strings; maximum 10 images per product; one level of category nesting; compare-at price must exceed current price; unique slugs across categories, subcategories, and products

**Scale/Scope**: Single admin managing hundreds of products across tens of categories/subcategories; shoppers browse and search active products; up to 10 images per product

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Repository Pattern**: PASS — all Supabase access for catalog data goes through `ProductRepository` and `CategoryRepository`; UI never calls Supabase directly.
- **II. Server-First Rendering**: PASS — storefront category pages, search results, and product detail pages read catalog data in Server Components; only admin forms, image upload widgets, and AI enhancement triggers require minimal Client Component boundaries.
- **III. Arabic-First, RTL-Native**: PASS — catalog stores independent Arabic and English content for names, summaries, descriptions, and accordion sections; locale switching renders the correct content and layout direction.
- **IV. Brand Token System**: PASS — admin dashboard UI and storefront product cards use the same brand tokens and base components established in Spec 1.
- **V. Clean, Focused Components**: PASS — repositories, category forms, product forms, image upload widgets, product cards, and gallery components each have a single responsibility.

All gates pass.

## Project Structure

### Documentation (this feature)

```text
specs/003-product-catalog/
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
│   ├── [locale]/
│   │   ├── shop/
│   │   │   ├── page.tsx              # Category/search listing (Server Component)
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Product detail page (Server Component)
│   │   └── page.tsx                  # Landing page uses catalog repositories
│   └── admin/
│       ├── products/
│       │   ├── page.tsx              # Product list
│       │   ├── new/
│       │   │   └── page.tsx          # Create product
│       │   └── [id]/
│       │       └── page.tsx          # Edit product
│       └── categories/
│           ├── page.tsx              # Category/subcategory list
│           └── [id]/
│               └── page.tsx          # Edit category
├── components/
│   ├── admin/
│   │   └── catalog/
│   │       ├── product-form.tsx             # Product AR/EN fields, pricing, status
│   │       ├── category-form.tsx            # Category AR/EN names, slug, image
│   │       ├── accordion-sections-field.tsx # Accordion heading/description pairs
│   │       ├── ai-enhance-button.tsx        # Triggers server-side AI suggestions
│   │       └── image-upload-field.tsx       # Cloudinary upload widget wrapper
│   └── shop/
│       ├── product-card.tsx             # Product grid card
│       ├── product-grid.tsx             # Responsive product grid
│       └── product-gallery.tsx          # PDP image gallery (Client Component)
├── features/
│   └── catalog/
│       ├── types.ts              # Category, Subcategory, Product, ProductImage, etc.
│       └── utils.ts              # Slug/sort/offer helpers
├── lib/
│   ├── cloudinary/
│   │   ├── types.ts              # CloudinaryAsset / MediaAsset type
│   │   └── delete.ts             # Server-side Cloudinary destroy utility
│   ├── ai/
│   │   └── enhance.ts            # Server-side OpenRouter enhancement utility
│   └── supabase/
│       ├── client.ts             # Browser-safe Supabase client
│       └── server.ts             # Server-side Supabase client
├── repositories/
│   ├── product.repository.ts     # ProductRepository (server-side only)
│   └── category.repository.ts    # CategoryRepository (server-side only)
└── actions/
    ├── catalog.actions.ts        # Server Actions for product/category writes
    └── cloudinary.actions.ts     # Server Action for deleting Cloudinary assets
```

**Structure Decision**: Single Next.js web application with feature-based folders. Admin routes under `src/app/admin/products/` and `src/app/admin/categories/`. Catalog domain logic and types under `src/features/catalog/`. Shared Cloudinary utilities reused from Spec 2 under `src/lib/cloudinary/`. AI enhancement isolated under `src/lib/ai/`. All catalog data access through `src/repositories/product.repository.ts` and `src/repositories/category.repository.ts`.

## Complexity Tracking

No constitution violations; this section is intentionally left blank.
