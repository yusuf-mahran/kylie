# Data Model: Product Catalog

## Value Object: `MediaAsset`

Stored image reference used by `categories.image`, `product_images.image`, and any other catalog image fields.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `public_id` | text | Not null | Cloudinary public ID, e.g., `kylie/products/{id}/abc123` |
| `secure_url` | text | Not null | Publicly accessible HTTPS URL |

**Validation rules**:
- Both fields are required; bare URLs are never persisted alone.
- `public_id` is used for server-side deletion when the asset is replaced or removed.

---

## Entity: `Category`

Product grouping.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | uuid | Primary key | Internal identifier |
| `slug` | text | Unique, not null | URL-friendly identifier |
| `name_ar` | text | Not null | Arabic category name |
| `name_en` | text | Not null | English category name |
| `image` | jsonb | Nullable | `MediaAsset` object |
| `sort_order` | int | Not null | Display/admin order |
| `is_active` | boolean | Default `true` | Controls storefront visibility |
| `created_at` | timestamptz | Auto | Creation timestamp |
| `updated_at` | timestamptz | Auto | Last modification timestamp |

**Validation rules**:
- `slug` must be unique across `categories`, `subcategories`, and `products`.
- `name_ar` and `name_en` are required.
- `image` is optional.

---

## Entity: `Subcategory`

Child grouping directly under a single `Category`.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | uuid | Primary key | Internal identifier |
| `category_id` | uuid | Foreign key → categories | Parent category |
| `slug` | text | Unique, not null | URL-friendly identifier |
| `name_ar` | text | Not null | Arabic subcategory name |
| `name_en` | text | Not null | English subcategory name |
| `sort_order` | int | Not null | Display/admin order |
| `is_active` | boolean | Default `true` | Controls storefront visibility |
| `created_at` | timestamptz | Auto | Creation timestamp |
| `updated_at` | timestamptz | Auto | Last modification timestamp |

**Validation rules**:
- `slug` unique across all slug-bearing entities.
- `name_ar` and `name_en` are required.
- `category_id` is required and must reference an existing category.
- Deeper nesting is not supported.

---

## Entity: `Product`

Sellable item.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | uuid | Primary key | Internal identifier |
| `slug` | text | Unique, not null | URL-friendly identifier |
| `category_id` | uuid | Foreign key → categories | Required category |
| `subcategory_id` | uuid | Foreign key → subcategories, nullable | Optional subcategory |
| `name_ar` | text | Not null | Arabic product name |
| `name_en` | text | Not null | English product name |
| `summary_ar` | text | Not null | Short Arabic hook/summary |
| `summary_en` | text | Not null | Short English hook/summary |
| `price` | numeric(10,2) | Not null | Current selling price |
| `compare_price` | numeric(10,2) | Nullable | Original price; must be > price when set |
| `stock_count` | int | Default 0 | Available quantity |
| `is_featured` | boolean | Default false | Featured list flag |
| `is_best_seller` | boolean | Default false | Best-seller list flag |
| `status` | text | Not null | `active`, `draft`, or `archived` |
| `created_at` | timestamptz | Auto | Creation timestamp |
| `updated_at` | timestamptz | Auto | Last modification timestamp |

**Validation rules**:
- `slug` unique across all slug-bearing entities.
- `name_ar`, `name_en`, `summary_ar`, `summary_en`, `price`, `category_id`, and `status` are required.
- `compare_price`, if provided, must be greater than `price`.
- `status` must be one of `active`, `draft`, or `archived`.
- Only `active` products with active categories are discoverable on the storefront.

---

## Entity: `ProductImage`

Image attached to a product.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | uuid | Primary key | Internal identifier |
| `product_id` | uuid | Foreign key → products | Owning product |
| `image` | jsonb | Not null | `MediaAsset` object |
| `sort_order` | int | Not null | Display order |
| `is_primary` | boolean | Default false | Primary image flag |

**Validation rules**:
- A product may have up to 10 images.
- Exactly one image per product should be primary; if none is marked, the first image by `sort_order` is treated as primary.
- On product deletion, all associated `ProductImage` rows and their Cloudinary assets are removed.

---

## Entity: `ProductAccordionSection`

Accordion section for the product detail page.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | uuid | Primary key | Internal identifier |
| `product_id` | uuid | Foreign key → products | Owning product |
| `heading_ar` | text | Not null | Arabic heading |
| `heading_en` | text | Not null | English heading |
| `description_ar` | text | Not null | Arabic description |
| `description_en` | text | Not null | English description |
| `sort_order` | int | Not null | Display order |
| `created_at` | timestamptz | Auto | Creation timestamp |
| `updated_at` | timestamptz | Auto | Last modification timestamp |

**Validation rules**:
- All four localized fields are required per section.
- If a field is missing for the active locale, the system falls back to Arabic content.

---

## Relationships

- A `Category` has zero or many `Subcategory` rows.
- A `Category` has zero or many `Product` rows.
- A `Subcategory` has zero or many `Product` rows.
- A `Product` belongs to exactly one `Category` and optionally one `Subcategory`.
- A `Product` has zero to many `ProductImage` rows (max 10).
- A `Product` has zero to many `ProductAccordionSection` rows.
- `ProductImage.image` and `Category.image` reference `MediaAsset`.

## State Transitions

- `Product.status`: `draft` → `active` makes the product storefront-visible (if its category is active); `active` → `archived` hides it; `draft` and `archived` products are not visible.
- `Category.is_active`: `true` → `false` hides the category and all its subcategories and products from storefront discovery.
- `Subcategory.is_active`: `true` → `false` hides the subcategory; products in that subcategory remain visible under their category unless the category itself is inactive.
- Media asset deletion: when a product/category image is replaced/removed or a product/category is deleted, the old `public_id` is destroyed in Cloudinary before the database record is updated or removed.
