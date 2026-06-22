# Feature Specification: Product Catalog

**Feature Branch**: `[003-product-catalog]`

**Created**: 2026-06-20

**Status**: Draft

**Input**: User description: "make a specification for Spec 3 — `product-catalog`"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manage Category Hierarchy (Priority: P1)

The store owner opens the admin dashboard and creates product categories (e.g., skincare, makeup) and subcategories under them. For each category or subcategory she enters Arabic and English names, a unique URL-friendly slug, an optional image, a sort order, and an active flag. She can later edit or remove categories and subcategories.

**Why this priority**: A clear category hierarchy is the foundation of product discovery. Shoppers cannot browse the catalog until products are organized into groups.

**Independent Test**: Create a "Makeup" category with an Arabic name and an English name, add a "Lipstick" subcategory, and verify both names and the parent relationship are stored correctly.

**Acceptance Scenarios**:

1. **Given** the store owner creates a category with Arabic and English names, **When** she saves it, **Then** the category is stored with both names and a unique slug.
2. **Given** the store owner creates a subcategory under an existing category, **When** she saves it, **Then** the subcategory is linked to the parent category and inherits the same active/sort behavior.
3. **Given** the store owner deactivates a category, **When** a shopper browses the storefront, **Then** the deactivated category and its subcategories are not shown.

---

### User Story 2 - Create and Publish a Product (Priority: P1)

The store owner adds a new product to the catalog. She enters the product name and description in Arabic and English, sets the price and an optional compare-at price, sets stock count, assigns the product to a category and optionally a subcategory, marks it as active, and uploads one or more product images with one image designated as the primary image. She may optionally use an AI-assisted enhancement feature to generate or improve the title, slug, summary, description, and accordion sections, reviewing and editing any suggestion before saving.

**Why this priority**: Products are the core inventory of the store. The catalog must hold every piece of product information the storefront needs to display and sell items.

**Independent Test**: Create a new active product with Arabic and English content, a price, a category, and a primary image, then verify the product can be retrieved for the storefront.

**Acceptance Scenarios**:

1. **Given** the store owner enters all required product fields, **When** she saves the product, **Then** the product is stored with Arabic and English content, a unique slug, and the assigned category.
2. **Given** the store owner uploads multiple images and marks one as primary, **When** the product is saved, **Then** the primary image is stored and returned as the default image for the product.
3. **Given** the store owner sets a product status to "draft", **When** a shopper visits the storefront, **Then** the product is not visible until it is set to "active".

---

### User Story 3 - Browse Products by Category (Priority: P1)

A shopper visits the store and navigates to a category page. She sees only active products in that category, each showing its localized name, price, primary image, and an offer indicator when a compare-at price is higher than the current price. She can filter further by subcategory if any exist.

**Why this priority**: Browsing by category is the primary way shoppers discover products. The catalog must return accurate, localized, and active-only results.

**Independent Test**: Visit a category with both active and draft products and verify only active products appear, with correct Arabic names and prices.

**Acceptance Scenarios**:

1. **Given** a category contains active and inactive products, **When** a shopper opens the category page, **Then** only active products are displayed.
2. **Given** an active product has a compare-at price higher than its price, **When** it appears in a category list, **Then** it is shown as being on offer.
3. **Given** a shopper switches from Arabic to English, **When** the category page reloads, **Then** product names and descriptions are shown in English while the layout direction switches to LTR.

---

### User Story 4 - Search the Catalog (Priority: P2)

A shopper types a keyword into the store search. The system looks at product names and descriptions in both Arabic and English and returns active products that match the keyword, sorted by relevance.

**Why this priority**: Search is the fastest path to a specific product. Supporting both languages matches the bilingual nature of the target market.

**Independent Test**: Search for an Arabic product name and verify the matching active product appears; then search for the same product by its English name and verify the same result.

**Acceptance Scenarios**:

1. **Given** a shopper searches for an Arabic keyword that matches an active product name, **When** results are returned, **Then** the matching product appears.
2. **Given** a shopper searches for an English keyword that matches an active product description, **When** results are returned, **Then** the matching product appears.
3. **Given** a shopper searches for a term that matches only draft or archived products, **When** results are returned, **Then** no matching products are shown.

---

### User Story 5 - Highlight Featured and Best-Selling Products (Priority: P2)

The store owner marks selected products as "featured" or "best seller". The storefront exposes dedicated lists of these products so they can be promoted on landing pages and curated sections.

**Why this priority**: Curated lists drive conversion and let the marketing team control which products receive visibility.

**Independent Test**: Mark two products as featured and three as best sellers, then verify the storefront returns exactly those products in the featured and best-seller lists.

**Acceptance Scenarios**:

1. **Given** the store owner marks a product as featured, **When** the storefront requests featured products, **Then** that product is included.
2. **Given** a featured product is later deactivated, **When** the storefront requests featured products, **Then** the inactive product is excluded.
3. **Given** the store owner removes the best-seller flag from a product, **When** the storefront requests best sellers, **Then** that product is no longer returned.

---

### Edge Cases

- If a product, category, or subcategory lacks content for the active locale, the system MUST fall back to the Arabic content.
- If a product has no images, the storefront MUST display a sensible placeholder instead of a broken image.
- If a product has multiple images but none is marked primary, the system MUST use the first image by sort order as the primary image.
- If a category or subcategory has products or subcategories assigned to it, the system MUST prevent deletion until the child records are reassigned or removed.
- If a product is deleted, all associated product images and their underlying media assets MUST be removed from storage.
- If an image is replaced or removed, the old media asset MUST be permanently deleted from storage using its stored identifier.
- If the compare-at price is less than or equal to the current price, the system MUST reject the value and not save the product until it is corrected.
- If a shopper searches with an empty query, the system MUST return no results rather than every product.
- If two products, categories, or subcategories are created with the same slug, the system MUST reject the duplicate and return a clear error.
- If a product has no accordion sections, the storefront MUST display only the short summary/hook without an empty accordion.
- If an admin attempts to add more than 10 images to a product, the system MUST reject the upload and display a clear error.
- Subcategories cannot have their own child subcategories; the system MUST NOT allow nesting deeper than one level.
- If the AI-assisted enhancement feature is unavailable, the admin MUST still be able to create and edit products manually without errors.
- If an AI-generated slug is not unique, the system MUST reject it and require the admin to edit the slug before saving.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST support categories with independent Arabic and English names, a unique URL-friendly slug, an optional image, a sort order, and an active/inactive state.
- **FR-002**: The system MUST support one level of subcategories linked directly to a parent category with the same fields as categories; deeper nesting is out of scope.
- **FR-003**: The system MUST support products with independent Arabic and English names and descriptions, a unique URL-friendly slug, a price, an optional compare-at price, a stock count, a status (active, draft, or archived), and flags for featured and best seller.
- **FR-004**: Every product MUST belong to a category; a subcategory assignment is optional.
- **FR-005**: The system MUST support up to 10 images per product with a sort order and a single primary-image flag.
- **FR-006**: Product and category images MUST be stored as structured media assets containing a unique public identifier and a public URL.
- **FR-007**: When a product or category image is replaced or removed, the old media asset MUST be permanently deleted from media storage using its stored identifier.
- **FR-008**: The system MUST auto-generate slugs from the entity name/title and product details, allow admins to edit slugs at any time, and enforce uniqueness across categories, subcategories, and products on save.
- **FR-009**: Only products with an "active" status and an active category MUST be discoverable on the storefront.
- **FR-010**: The system MUST provide storefront access to products by category, subcategory, featured flag, best-seller flag, and free-text search query.
- **FR-011**: Free-text search MUST match active product names and descriptions in both Arabic and English.
- **FR-012**: The system MUST provide admin users with the ability to create, update, and delete categories, subcategories, products, and product images.
- **FR-013**: When a product is deleted, all of its associated images and their media assets MUST be removed from storage.
- **FR-014**: A category or subcategory that has products or subcategories assigned to it MUST NOT be deleted until the child records are reassigned or removed.
- **FR-015**: If content for the active locale is missing for a product, category, or subcategory, the system MUST fall back to the Arabic content.
- **FR-016**: When a compare-at price is provided, it MUST be validated to be greater than the current price; the product MUST be indicated as on offer only when this validation passes.
- **FR-017**: Every product MUST have a short plain-text summary (hook) in Arabic and English, displayed prominently on product cards and detail views.
- **FR-018**: Products MAY have zero or more accordion sections, each with a localized heading and description in Arabic and English, displayed in a defined sort order.
- **FR-019**: If an accordion section is missing a heading or description for the active locale, the system MUST fall back to the Arabic content for that field.
- **FR-020**: The admin dashboard SHOULD provide an optional AI-assisted enhancement feature for product titles, slugs, summaries, descriptions, and accordion sections in Arabic and English; generated suggestions MUST be editable and reviewed by the admin before saving.

### Key Entities *(include if feature involves data)*

- **Category**: A product grouping with Arabic/English names, a unique slug, an optional media asset, sort order, and active state.
- **Subcategory**: A child grouping under a Category with the same attributes; products may optionally be assigned to it.
- **Product**: A sellable item with localized names, a short summary/hook, optional accordion sections (heading + description), pricing, stock count, status, featured/best-seller flags, and category/subcategory assignments.
- **ProductImage**: An image attached to a Product, represented as a media asset with sort order and a primary-image flag.
- **MediaAsset**: A stored image reference containing a unique public identifier and a public URL, used for categories and product images.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of product, category, and subcategory records contain independent Arabic and English name fields.
- **SC-002**: Active products appear on the storefront within 10 seconds of being published or reactivated.
- **SC-003**: 95% of catalog searches return matching results in under 1 second.
- **SC-004**: 100% of product cards and product detail views display the correct primary image (or a placeholder if none exists) and localized name/price.
- **SC-005**: Featured and best-seller lists return exactly the products marked with those flags, excluding inactive products.
- **SC-006**: Zero orphaned image assets remain in media storage after a product/category deletion or image replacement.
- **SC-007**: 100% of storefront catalog queries return only active products with active categories.
- **SC-008**: An admin can create a new product with images and a category assignment in under 3 minutes.

## Assumptions

- Spec 1 (Brand Foundation) is complete before implementation, including locale switching, RTL/LTR layout, and translation files.
- Admin authentication and role-based access control will be implemented in a later spec; for now, write operations are assumed to be invoked by an authenticated admin.
- A media storage service that provides unique public identifiers and public URLs is available for hosting product and category images.
- Product variants (size, color, material) are out of scope for this version; each product represents a single SKU.
- Prices are assumed to be in Egyptian Pounds (EGP) for the target market, though the catalog schema stores price as a numeric value.
- Inventory decrement, out-of-stock purchase blocking, and cart functionality are handled in later specs.
- The initial category structure may be seeded, but the admin can add, edit, and reorganize categories and subcategories.

## Clarifications

### Session 2026-06-20

- **Q**: What format should product descriptions support? → **A**: Product descriptions are a short plain-text hook/summary in Arabic and English, plus zero or more optional accordion sections, each with a heading and description localized in Arabic and English.
- **Q**: What is the maximum number of images allowed per product? → **A**: 10 images per product.
- **Q**: How many levels of category nesting should the catalog support? → **A**: One level only — categories and their direct subcategories; deeper nesting is out of scope.
- **Q**: How should the system handle a compare-at price that is less than or equal to the current price? → **A**: The system MUST reject the value and require any compare-at price to be greater than the current price when provided.
- **Q**: How should product, category, and subcategory slugs be created? → **A**: Slugs are auto-generated from the entity name/title and product details, and the admin can edit them at any time; uniqueness is validated on save.
- **Q**: Should the admin be able to use AI to generate or enhance catalog content? → **A**: Yes, the admin dashboard SHOULD provide an optional AI-assisted enhancement feature for product titles, slugs, summaries, descriptions, and accordion sections in Arabic and English; generated suggestions are editable and must be reviewed before saving.
