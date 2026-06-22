# Tasks: Product Catalog

**Input**: Design documents from `/specs/003-product-catalog/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Manual validation per quickstart.md; no automated test tasks requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Environment, shared dependencies, and translation keys

- [x] T001 Add OpenRouter environment variable `OPENROUTER_API_KEY` to `.env.local` and environment schema validation
- [x] T002 [P] Add catalog admin and storefront translation keys to `messages/ar.json` and `messages/en.json`
- [x] T003 [P] Verify `src/lib/cloudinary/types.ts` and `src/actions/cloudinary.actions.ts` from Spec 2 are available for reuse

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema, shared types, and utilities that MUST be complete before user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create Supabase migration for `categories`, `subcategories`, `products`, `product_images`, and `product_accordion_sections` with indexes and constraints
- [x] T005 [P] Create shared catalog types in `src/features/catalog/types.ts` matching `contracts/catalog.ts`
- [x] T006 [P] Create catalog Zod schemas in `src/features/catalog/schemas.ts` for product/category validation
- [x] T007 [P] Create slugify utility in `src/lib/utils/slugify.ts`
- [x] T008 [P] Create offer-price validation helper in `src/features/catalog/utils.ts`

**Checkpoint**: Database tables, types, and shared utilities are ready for user story implementation.

---

## Phase 3: User Story 1 - Manage Category Hierarchy (Priority: P1) 🎯 MVP

**Goal**: The store owner can create, edit, and delete categories and subcategories from the admin dashboard.

**Independent Test**: Create a Makeup category and a Lipstick subcategory in the admin dashboard, verify unique slugs and parent relationship, then verify the deactivated category is hidden from the storefront.

- [x] T009 [US1] Create `CategoryRepository` in `src/repositories/category.repository.ts`
- [x] T010 [P] [US1] Create admin category list page at `src/app/admin/categories/page.tsx`
- [x] T011 [P] [US1] Create category form component at `src/components/admin/catalog/category-form.tsx`
- [x] T012 [US1] Create admin category create/edit pages at `src/app/admin/categories/new/page.tsx` and `src/app/admin/categories/[id]/page.tsx`
- [x] T013 [US1] Add subcategory management UI and link it to the category form or a dedicated subcategory section
- [x] T014 [US1] Add Cloudinary image upload to the category form at `src/components/admin/catalog/category-form.tsx`
- [x] T015 [US1] Add server actions for category/subcategory writes in `src/actions/catalog.actions.ts`

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Create and Publish a Product (Priority: P1)

**Goal**: The store owner can create and publish products with localized content, images, accordion sections, and optional AI enhancement.

**Independent Test**: Create an active product with Arabic and English names, summary, price, compare-at price, category, primary image, and accordion sections; verify it is retrievable for the storefront and AI suggestions are editable before saving.

- [x] T016 [P] [US2] Create `ProductRepository` in `src/repositories/product.repository.ts`
- [x] T017 [P] [US2] Create product form component at `src/components/admin/catalog/product-form.tsx`
- [x] T018 [P] [US2] Create accordion sections field at `src/components/admin/catalog/accordion-sections-field.tsx`
- [x] T019 [P] [US2] Create product image upload field with primary selection at `src/components/admin/catalog/image-upload-field.tsx`
- [x] T020 [US2] Create admin product list page at `src/app/admin/products/page.tsx`
- [x] T021 [US2] Create admin product create/edit pages at `src/app/admin/products/new/page.tsx` and `src/app/admin/products/[id]/page.tsx`
- [x] T022 [US2] Add AI enhancement utility at `src/lib/ai/enhance.ts` and enhance button at `src/components/admin/catalog/ai-enhance-button.tsx`
- [x] T023 [US2] Add server actions for product writes, image cleanup, and deletion in `src/actions/catalog.actions.ts`

**Checkpoint**: User Stories 1 and 2 are both independently functional.

---

## Phase 5: User Story 3 - Browse Products by Category (Priority: P1)

**Goal**: Shoppers can browse active products by category and subcategory with localized content, pricing, and offer indicators.

**Independent Test**: Visit the shop page with an active category filter and verify only active products appear with correct Arabic names, prices, primary images, and offer badges; switch to English and verify LTR layout.

- [x] T024 [P] [US3] Create `ProductCard` component at `src/components/shop/product-card.tsx`
- [x] T025 [P] [US3] Create `ProductGrid` component at `src/components/shop/product-grid.tsx`
- [x] T026 [US3] Implement storefront shop page at `src/app/[locale]/shop/page.tsx`
- [x] T027 [US3] Create category/subcategory filter UI at `src/components/shop/category-filter.tsx`
- [x] T028 [US3] Create minimal product detail page at `src/app/[locale]/shop/[slug]/page.tsx`

**Checkpoint**: User Stories 1, 2, and 3 are independently functional.

---

## Phase 6: User Story 4 - Search the Catalog (Priority: P2)

**Goal**: Shoppers can search active products by keyword in Arabic or English.

**Independent Test**: Search for an Arabic product name and an English product name; verify matching active products appear and draft/archived products are excluded. Verify an empty query returns no results.

- [x] T029 [US4] Add search query handling to `ProductRepository` and the shop page at `src/app/[locale]/shop/page.tsx`
- [x] T030 [US4] Create search input component at `src/components/shop/search-input.tsx`

**Checkpoint**: User Stories 1–4 are independently functional.

---

## Phase 7: User Story 5 - Highlight Featured and Best-Selling Products (Priority: P2)

**Goal**: The store owner can mark products as featured or best seller, and the storefront exposes curated lists.

**Independent Test**: Mark products as featured and best seller; verify the storefront returns exactly those active products in the curated lists and excludes inactive ones.

- [x] T031 [US5] Add featured/best-seller toggles to the admin product form at `src/components/admin/catalog/product-form.tsx`
- [x] T032 [US5] Add `getFeaturedProducts` and `getBestSellers` methods to `src/repositories/product.repository.ts`
- [x] T033 [US5] Expose featured/best-seller list utilities for landing page sections in `src/features/catalog/utils.ts`

**Checkpoint**: All user stories are independently functional.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Locale fallback, error handling, image placeholders, and validation

- [x] T034 [P] Add Arabic fallback when active locale content is missing for products, categories, and subcategories
- [x] T035 [P] Add placeholder rendering for missing product and category images
- [x] T036 [P] Add admin toast/error handling for catalog operations
- [x] T037 [P] Run the validation steps in `quickstart.md`
- [x] T038 Run `pnpm lint` and `pnpm build`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - Recommended order: US1 → US2 → US3 → US4 → US5
  - US2 needs categories from US1; US3 needs products from US2; US4 and US5 need active products from US3
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No story dependencies — can start after Foundational phase
- **User Story 2 (P1)**: Depends on US1 (needs categories/subcategories)
- **User Story 3 (P1)**: Depends on US2 (needs active products)
- **User Story 4 (P2)**: Depends on US3 (needs shop listing infrastructure)
- **User Story 5 (P2)**: Depends on US2 and US3 (needs products and storefront display)

### Within Each User Story

- Models/repositories before UI pages
- UI components before admin/storefront pages that compose them
- Server actions before admin forms that submit data
- Story complete before moving to the next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel
- Within US1: T010, T011, T014 can run in parallel before T012 and T015
- Within US2: T016, T017, T018, T019, T022 can run in parallel before T020, T021, T023
- Within US3: T024, T025, T027 can run in parallel before T026 and T028
- US4 and US5 tasks are largely independent once their prerequisites are complete
- All Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 2

```bash
# Launch repository and UI component tasks in parallel:
Task: "Create ProductRepository in src/repositories/product.repository.ts"
Task: "Create product form component in src/components/admin/catalog/product-form.tsx"
Task: "Create accordion sections field in src/components/admin/catalog/accordion-sections-field.tsx"
Task: "Create product image upload field in src/components/admin/catalog/image-upload-field.tsx"
Task: "Add AI enhancement utility in src/lib/ai/enhance.ts"

# Then compose the admin pages and server actions:
Task: "Create admin product list page in src/app/admin/products/page.tsx"
Task: "Create admin product create/edit pages"
Task: "Add server actions for product writes in src/actions/catalog.actions.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (category/subcategory management)
4. **STOP and VALIDATE**: Test category CRUD and deactivation independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2 (after US1 categories are available)
   - Developer C: User Story 3 storefront UI (after US2 products are available)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
