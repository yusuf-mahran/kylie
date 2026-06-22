# Research: Product Catalog

## Decision: Storage backend for catalog records

- **Decision**: Use Supabase PostgreSQL for categories, subcategories, products, product images, and accordion sections.
- **Rationale**: Already the established project backend; relational data naturally fits categories, subcategories, and products; row-level security and admin auth will be added in a later spec.
- **Alternatives considered**: SQLite (not shared), MongoDB (adds operational overhead), separate headless CMS (overkill for structured product data).

## Decision: Image hosting

- **Decision**: Use Cloudinary for product and category images, storing `{ public_id, secure_url }` in Supabase.
- **Rationale**: Reuses the Spec 2 Cloudinary infrastructure; supports on-the-fly transformations; `public_id` enables reliable server-side deletion.
- **Alternatives considered**: Supabase Storage (would require an additional bucket and deletion logic; Cloudinary is already configured and handles transformations).

## Decision: AI-assisted content enhancement

- **Decision**: Use the OpenRouter API with the free model `openai/gpt-oss-120b:free` for generating or enhancing product titles, slugs, summaries, descriptions, and accordion sections.
- **Rationale**: User-requested free model; OpenRouter exposes a single HTTP endpoint for multiple providers; calling it from a Next.js Server Action keeps the API key server-side and lets the admin review suggestions before saving.
- **Alternatives considered**: Client-side generative widget (exposes API key), paid model (violates cost constraint), self-hosted model (hosting overhead).

## Decision: Search implementation

- **Decision**: Use PostgreSQL case-insensitive pattern matching (`ilike`) across `name_ar`, `name_en`, `summary_ar`, `summary_en`, and accordion section text for active products.
- **Rationale**: Simple to implement with Supabase; sufficient for a catalog of hundreds of products; supports both Arabic and English without extra extensions for the MVP.
- **Alternatives considered**: `pg_trgm` full-text search (adds extension complexity), external search service like Algolia (cost and operational overhead).

## Decision: Slug generation

- **Decision**: Auto-generate slugs with a slugify utility and allow manual editing; validate uniqueness across categories, subcategories, and products.
- **Rationale**: Balances automation with editorial control; the AI enhancement feature can also suggest slugs.
- **Alternatives considered**: AI-only generation (would require a network call for every new entity), fully manual entry (more admin friction).

## Decision: Offer/price validation

- **Decision**: Validate that any provided compare-at price is greater than the current price; treat the product as on offer only when this validation passes.
- **Rationale**: Prevents misleading sale labels and matches the clarification recorded in the spec.
- **Alternatives considered**: Allow any compare-at price and simply hide the offer badge when it is not higher (less strict, allows data errors).

## Decision: Forms and validation

- **Decision**: Use React Hook Form + Zod for admin product and category forms.
- **Rationale**: Project standard; strong TypeScript integration; supports complex Arabic/English field shapes and accordion arrays.
- **Alternatives considered**: Native forms (more boilerplate), other validation libraries (team already uses Zod).
