# Tasks: CMS Content Management

**Input**: Design documents from `/specs/002-cms-content-management/`

**Target implementer**: Deepseek flash (cheaper model). Each task must be completed without asking for clarification.

**Notes**:
- All file paths are relative to repo root.
- Use Spec 1 base components (`BrandButton`, `SectionWrapper`, typography, RTL provider) wherever possible.
- All user-facing labels must come from `messages/ar.json` and `messages/en.json`.
- Do NOT call Supabase from UI; always use `CmsRepository`.
- Do NOT import server-only Cloudinary code into Client Components.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create empty folders/files.

- [X] T001 [P] Install runtime dependencies: `pnpm add next-cloudinary cloudinary`
- [X] T002 [P] Add Cloudinary environment variables to `.env.local`: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- [X] T003 [P] Create empty folders: `src/app/admin/cms/sections/[key]/`, `src/app/admin/cms/social/`, `src/app/admin/cms/reels/`, `src/components/admin/cms/`, `src/features/brand/`, `src/lib/cloudinary/`, `src/actions/`

**Checkpoint**: `pnpm install` succeeds and folders exist.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Types, Cloudinary deletion utility, Server Action, and repository skeleton. No user story work can begin until this phase is complete.

- [X] T004 Create `src/lib/cloudinary/types.ts` exporting `CloudinaryAsset` (alias `MediaAsset`) with `public_id: string` and `secure_url: string`
- [X] T005 Create `src/lib/cloudinary/delete.ts` (server-only) exporting `deleteFromCloudinary(publicId: string): Promise<void>` using `cloudinary.v2.uploader.destroy` with `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`
- [X] T006 Create `src/actions/cloudinary.actions.ts` with `'use server'` exporting `deleteCloudinaryAsset(publicId: string): Promise<void>` that calls `deleteFromCloudinary`
- [X] T007 Create `src/features/brand/types.ts` exporting `LocaleContent`, `MediaAsset`, `CmsSectionKey`, `CmsSection`, `SocialPlatform`, `SocialLink`, and `Reel` types matching `specs/002-cms-content-management/contracts/cms.ts`
- [X] T008 Create `src/repositories/cms.repository.ts` with an empty class `CmsRepository` and a typed constructor accepting a server Supabase client
- [X] T009 Create the Supabase migration file `supabase/migrations/20260619000001_cms.sql` with `cms_sections`, `cms_social_links`, and `cms_reels` tables per `specs/002-cms-content-management/data-model.md`
- [X] T010 Create seed file `supabase/seed.sql` inserting the four `cms_sections` rows (`hero`, `vision`, `about`, `footer`) with empty `content_ar`/`content_en`, `images = '{}`, `is_active = true`, and `sort_order = 0,1,2,3`
- [X] T011 Run `supabase migration up` and `supabase db reset` (or equivalent) to apply schema and seed locally (⚠️ requires Supabase CLI)

**Checkpoint**: `pnpm build` compiles without errors and the three CMS tables exist with seed rows.

---

## Phase 3: User Story 1 - Edit Landing Page Sections (Priority: P1) 🎯 MVP

**Goal**: Store owner can edit hero, vision, about, footer sections in Arabic and English, upload/replace/remove images, and see changes on the storefront.

**Independent Test**: Open `/admin/cms/sections/hero`, edit Arabic and English content, upload an image, save, then open `/` and `/en` to verify the hero section reflects the changes.

### Implementation for User Story 1

- [X] T012 [US1] Add `getSectionByKey`, `getAllSections`, `updateSection`, `addSectionImage`, and `removeSectionImage` methods to `src/repositories/cms.repository.ts`
- [X] T013 [US1] Create Zod schema `src/features/brand/schemas.ts` for `LocaleContent` (headline max 120, cta max 240, optional subheading/body) and `MediaAsset`
- [X] T014 [P] [US1] Create `src/components/admin/cms/image-upload-field.tsx` wrapping `CldUploadWidget` from `next-cloudinary`, extracting `public_id` and `secure_url`, and calling `onUpload(asset)`
- [X] T015 [P] [US1] Create `src/components/admin/cms/section-form.tsx` with Arabic and English inputs for headline, subheading, body (textarea), and CTA, plus save button
- [X] T016 [US1] Create `src/app/admin/cms/sections/[key]/page.tsx` that fetches the section by `params.key` and renders `SectionForm` plus the image upload field
- [X] T017 [US1] Create `src/app/admin/cms/page.tsx` listing links to `/admin/cms/sections/hero`, `/admin/cms/sections/vision`, `/admin/cms/sections/about`, `/admin/cms/sections/footer`
- [X] T018 [US1] Create `src/app/[locale]/page.tsx` (overwrite placeholder) that fetches active CMS sections via `CmsRepository` and renders a minimal hero section using Arabic/English content and RTL/LTR direction
- [X] T019 [US1] Add CMS translation keys to `messages/ar.json` and `messages/en.json` for labels like "Save", "Arabic", "English", "Upload Image", "Remove Image"

**Checkpoint**: User Story 1 is independently testable — edit hero in admin, see it on `/` and `/en`.

---

## Phase 4: User Story 2 - Manage Social Media Links (Priority: P1)

**Goal**: Store owner can add, edit, enable, disable Instagram/TikTok/Facebook/WhatsApp links.

**Independent Test**: Add Instagram and WhatsApp URLs in `/admin/cms/social`, disable Facebook, then verify only Instagram and WhatsApp appear on the storefront footer area.

### Implementation for User Story 2

- [X] T020 [US2] Add `getSocialLinks` and `updateSocialLink` methods to `src/repositories/cms.repository.ts`
- [X] T021 [P] [US2] Create `src/components/admin/cms/social-link-form.tsx` with platform select, URL input, and active toggle for one social link
- [X] T022 [US2] Create `src/app/admin/cms/social/page.tsx` rendering a `SocialLinkForm` for each supported platform
- [X] T023 [US2] Add seed insert for the four `cms_social_links` rows in `supabase/seed.sql` (platforms with empty URLs and `is_active = false`)
- [X] T024 [US2] Update `src/app/[locale]/page.tsx` to fetch active social links and render them in a minimal footer-like area
- [X] T025 [US2] Add social link translation keys to `messages/ar.json` and `messages/en.json`

**Checkpoint**: User Story 2 is independently testable — social link changes reflect on the storefront.

---

## Phase 5: User Story 3 - Manage Promotional Reels (Priority: P2)

**Goal**: Store owner can add, edit, reorder, activate/deactivate, and remove reels with video URL and optional cover image.

**Independent Test**: Add a reel in `/admin/cms/reels` with video URL and cover image, reorder it to top, then verify it appears first on the storefront.

### Implementation for User Story 3

- [X] T026 [US3] Add `getReels`, `addReel`, `updateReel`, `removeReel`, and `updateReelCover` methods to `src/repositories/cms.repository.ts`
- [X] T027 [P] [US3] Create `src/components/admin/cms/reel-form.tsx` with video URL input, cover image upload, sort order input, and active toggle
- [X] T028 [US3] Create `src/app/admin/cms/reels/page.tsx` listing existing reels and a form to add a new reel
- [X] T029 [US3] Update `src/app/[locale]/page.tsx` to fetch active reels sorted by `sort_order` and render them in a minimal horizontal list with cover image and video link
- [X] T030 [US3] Add reel translation keys to `messages/ar.json` and `messages/en.json`

**Checkpoint**: User Story 3 is independently testable — reels can be managed and rendered.

---

## Phase 6: User Story 4 - View Locale-Aware Landing Page (Priority: P1)

**Goal**: Shoppers see locale-correct CMS content on the landing page; inactive content is hidden; Arabic fallback works.

**Independent Test**: Visit `/` and `/en`; verify locale switching and that inactive sections/reels/social links are hidden. Leave English content empty for one section and confirm Arabic fallback.

### Implementation for User Story 4

- [X] T031 [US4] Update `src/app/[locale]/page.tsx` to iterate over active `CmsSection` items sorted by `sort_order`, rendering each section only if `is_active` is true
- [X] T032 [US4] Add locale fallback logic in `src/app/[locale]/page.tsx`: if the active locale's field is missing, use the Arabic field
- [X] T033 [US4] Filter active social links and reels in `src/app/[locale]/page.tsx` before rendering
- [X] T034 [US4] Ensure `dir="rtl"` for Arabic and `dir="ltr"` for English is applied at the page/layout level (reuse `RTLProvider` from Spec 1)

**Checkpoint**: User Story 4 is independently testable — locale, fallback, and visibility rules work.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validation, build, lint, and error handling.

- [X] T035 [P] Add validation error messages to `src/components/admin/cms/section-form.tsx` for required headline/CTA and max lengths
- [X] T036 [P] Add error handling in `src/components/admin/cms/image-upload-field.tsx` to display Cloudinary upload failures
- [X] T037 Update `src/actions/cloudinary.actions.ts` to return a clear error message when `deleteFromCloudinary` fails, so the admin UI can show it
- [X] T038 Run `pnpm lint` and fix all errors
- [X] T039 Run `pnpm build` and fix all errors
- [X] T040 Follow `specs/002-cms-content-management/quickstart.md` step-by-step and verify each validation scenario passes (⚠️ requires running Supabase locally)

**Checkpoint**: Lint and build pass; quickstart validation complete.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup. Blocks all user stories.
- **User Stories (Phase 3-6)**: All depend on Foundational phase. US1 is MVP. US2, US3, and US4 can be worked in parallel after US1 is complete, or US4 can overlap with US1 once sections are readable.
- **Polish (Phase 7)**: Depends on all user stories.

### User Story Dependencies

- **US1 (P1)**: No dependencies on other stories. MVP.
- **US2 (P1)**: No hard dependency on US1, but shares `src/app/[locale]/page.tsx` for storefront rendering. Implement form first, then add rendering after US1 landing page exists.
- **US3 (P2)**: Same as US2 — no hard dependency, but shares storefront page.
- **US4 (P1)**: Depends on US1 sections being readable; can be done alongside US1.

### Within Each User Story

- Repository methods before components.
- Components before pages.
- Pages before storefront integration.
- Storefront integration before polish.

### Parallel Opportunities

- All Phase 1 tasks can run in parallel.
- T004-T011 in Phase 2 are mostly independent (except repository depends on types).
- Component tasks within each user story can be parallel if they touch different files.
- Translation key additions (T019, T025, T030) can be done in parallel with other story work.

---

## Parallel Example: User Story 1

```bash
# After T012 repository methods exist, these can run in parallel:
Task: "Create src/components/admin/cms/image-upload-field.tsx"
Task: "Create src/components/admin/cms/section-form.tsx"
Task: "Add CMS translation keys to messages/ar.json and messages/en.json"

# Then:
Task: "Create src/app/admin/cms/sections/[key]/page.tsx"
Task: "Create src/app/admin/cms/page.tsx"
Task: "Create src/app/[locale]/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. **STOP and VALIDATE**: Edit hero section in admin and see it on `/` and `/en`.

### Incremental Delivery

1. Setup + Foundational → foundation ready.
2. US1 → test independently → MVP demo.
3. US2 → test independently → social links work.
4. US3 → test independently → reels work.
5. US4 → test locale/fallback/visibility rules.
6. Polish → lint, build, quickstart validation.

### Notes for Deepseek Flash

- If a task says "create file X", create exactly that file and only that file.
- If a task references another file (e.g., "reuse RTLProvider from Spec 1"), assume it exists; do not rewrite it.
- If TypeScript complains about a missing type, add the minimal type needed in the same file or in `src/features/brand/types.ts`.
- Keep each component under 150 lines; split into smaller components if needed.
- Do not implement full landing page design — only minimal rendering to prove CMS integration works. Spec 4 will refine the visual layout.
