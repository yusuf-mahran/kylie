# Research: CMS Content Management

## Decision: Cloudinary Unsigned Upload Preset for Admin Image Picker

**Decision**: Use Cloudinary's unsigned upload preset with `next-cloudinary` `<CldUploadWidget />` for client-side image uploads from the admin dashboard.

**Rationale**:
- Unsigned presets avoid exposing API secrets to the browser while still allowing direct-to-Cloudinary uploads.
- `next-cloudinary` wraps the Cloudinary upload widget and returns a result object containing both `public_id` and `secure_url`.
- The upload preset must be configured in the Cloudinary dashboard with the correct folder structure (`kylie/cms/...`, `kylie/reels/...`).

**Alternatives considered**:
- Signed upload via custom server endpoint: more secure but adds latency and complexity for an MVP admin tool.
- Supabase Storage for CMS images: would not satisfy the project requirement to store Cloudinary `public_id` for deletion and would duplicate media infrastructure.

## Decision: Server Action for Cloudinary Asset Deletion

**Decision**: Implement a Next.js Server Action (`actions/cloudinary.actions.ts`) that validates the admin session and calls a server-only utility (`lib/cloudinary/delete.ts`) to destroy assets by `public_id`.

**Rationale**:
- Keeps `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` on the server, satisfying the security requirement.
- Server Actions are the idiomatic Next.js App Router pattern for secure mutations triggered from client UI.
- The deletion action must complete before the repository removes the asset record from Supabase, ensuring storage and database stay in sync.

**Alternatives considered**:
- API Route handler: valid, but Server Actions reduce indirection for admin form submissions.
- Client-side deletion: rejected because it would expose API secrets.

## Decision: Supabase jsonb for Section Content and Image Arrays

**Decision**: Store each section's Arabic and English content as `jsonb` columns (`content_ar`, `content_en`) and images as a `jsonb[]` array of `CloudinaryAsset` objects.

**Rationale**:
- `jsonb` accommodates the hybrid structured-field + optional rich body content shape without requiring schema migrations when section fields evolve.
- `jsonb[]` allows atomic appending and removal of image assets per section using PostgreSQL array operators.
- Storing images inline with the section keeps reads simple for the storefront.

**Alternatives considered**:
- Normalized `cms_images` table: more relational but adds joins for a read-heavy landing page; rejected for simplicity.
- Single `content` jsonb with nested locales: harder to query and validate independently; rejected in favor of explicit `content_ar`/`content_en`.

## Decision: Plain-Textarea Optional Body Instead of Full Rich-Text Editor

**Decision**: Use a plain textarea for the optional rich body field in the initial release, with newline-to-paragraph rendering on the storefront.

**Rationale**:
- A textarea keeps the admin UI simple and avoids introducing a heavy editor dependency for MVP.
- Newline-to-paragraph rendering is sufficient for brand statements and vision text.
- Future specs can upgrade to a lightweight markdown or rich-text editor without changing the data shape.

**Alternatives considered**:
- TipTap / Slate rich-text editor: adds bundle size and complexity; deferred to future phase.
- Markdown editor: good middle ground but still requires parser and UI training; deferred.

## Decision: Hard-Code Initial Section Keys with Seed Data

**Decision**: Seed the `cms_sections` table with the four initial keys (`hero`, `vision`, `about`, `footer`) and sensible empty defaults during the first migration or setup script.

**Rationale**:
- The landing page layout depends on these specific section keys, so they must exist before Spec 4 (Landing Experience) consumes them.
- Seeding prevents null-reference errors on the storefront and gives the admin a clear starting point.
- Additional sections can be inserted later using the same structure.

**Alternatives considered**:
- Dynamic section creation by admins: more flexible but complicates the landing page layout contract; rejected for initial release.
