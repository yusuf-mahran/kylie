# Kylie Cosmetics — Project Spec

> Arabic-first cosmetics ecommerce platform for the Egyptian market.
> Built from scratch: brand, identity, and platform.

---

## Project Overview

Kylie is a new cosmetics brand launching exclusively in the Egyptian market. This is a greenfield project — no existing web presence, no prior brand system. Everything is built from zero.

**Primary goals:**

- Give the brand a visual identity and digital home
- Let customers discover products, add to cart, and place orders
- Support Cash on Delivery and Instapay (QR or link + payment screenshot upload)
- Operate entirely in Arabic (RTL), with English as secondary language

**Target users:** Egyptian women, Arabic-speaking, mobile-first.

---

## Color Palette

Source: [https://colorhunt.co/palette/fffaf3fff2dbffe5bff62440](https://colorhunt.co/palette/fffaf3fff2dbffe5bff62440)

| Token           | Hex       | Role                              |
| --------------- | --------- | --------------------------------- |
| `--color-cream` | `#FFFAF3` | Page background                   |
| `--color-sand`  | `#FFF2DB` | Surface / cards                   |
| `--color-gold`  | `#FFE5BF` | Subtle accents, dividers          |
| `--color-rose`  | `#F62440` | Primary brand action, CTA, badges |

---

## Typography

- **Display / Arabic headings:** Cairo (Google Fonts) — weight 700/800
- **Body / Arabic:** Tajawal — weight 400/500
- **Latin fallback:** Inter — weight 400/600

---

## Tech Stack

### Frontend

- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- Shadcn/UI
- Zustand (client state)
- React Query (server state / caching)
- React Hook Form + Zod (forms)
- next-intl (i18n, RTL)

### Backend

- Supabase (Auth, DB, Storage)

### Architecture

- Repository Pattern — UI never calls Supabase directly
- Feature-based folder structure
- Server Components by default, Client Components only where needed
- Clean Code + Separation of Concerns
- Short, focused, single-responsibility components

---

## Data Architecture

All data is separated into two domains:

### Static Domain (CMS)

Landing page content, brand text, hero copy, reels, footer, social links. Editable from the admin dashboard. Stored in Supabase but accessed only via server-side repositories.

### Dynamic Domain (Commerce)

Products, categories, subcategories, orders, customers, favorites, cart. Fully relational. Accessed only via typed repository classes — never from UI directly.

---

## Repository Architecture

```
src/
├── features/
│   ├── brand/           # CMS / static content
│   ├── catalog/         # Products, categories
│   ├── shop/            # Filters, sorting, pagination
│   ├── product/         # PDP, suggestions
│   ├── cart/            # Cart state, persistence
│   ├── favorites/       # Favorites state
│   ├── orders/          # Checkout, payment, order history
│   ├── auth/            # Customer auth
│   └── admin/           # Dashboard modules
├── repositories/
│   ├── cms.repository.ts
│   ├── product.repository.ts
│   ├── category.repository.ts
│   ├── order.repository.ts
│   ├── customer.repository.ts
│   └── favorite.repository.ts
├── lib/
│   ├── supabase/        # Client + server Supabase instances
│   ├── utils/
│   └── constants/
├── components/
│   ├── ui/              # Shadcn overrides + base atoms
│   └── shared/          # Layout, nav, footer, RTL wrappers
└── app/
    ├── [locale]/
    │   ├── page.tsx                  # Landing
    │   ├── shop/page.tsx
    │   ├── shop/[slug]/page.tsx      # Product detail
    │   ├── cart/page.tsx
    │   ├── favorites/page.tsx
    │   ├── orders/page.tsx
    │   └── checkout/page.tsx
    └── admin/
        ├── products/
        ├── categories/
        ├── orders/
        └── cms/
```

---

## Spec Files

Each phase maps to one spec file. Implement phases in order.

---

## Spec 1 — `brand-foundation.md`

### Goal

Establish the visual identity, localization system, and design tokens before any feature is built.

### Scope

**Localization**

- Default locale: `ar` (RTL)
- Secondary locale: `en` (LTR)
- next-intl configured with locale detection and routing
- All strings in translation files — no hardcoded Arabic or English text
- RTL/LTR layout switches correctly at locale level

**Design Tokens**

- Tailwind config extended with brand color tokens (`cream`, `sand`, `gold`, `rose`)
- Font variables registered for Cairo, Tajawal, Inter
- Border radius scale: `sm: 4px`, `md: 8px`, `lg: 16px`, `full`
- Shadow scale: `soft`, `card`, `modal`

**Base Components**

- `RTLProvider` — wraps content with correct `dir` attribute
- `BrandButton` — primary (`rose`), secondary (outlined), ghost variants
- `BrandBadge` — for "جديد", "عرض", "الأكثر مبيعاً"
- `SectionWrapper` — consistent vertical padding + max-width container
- `Typography` components: `Heading`, `Subheading`, `BodyText`, `Caption`

**Responsive Breakpoints**

- Mobile: base (375px+)
- Tablet: `md` (768px+)
- Desktop: `lg` (1280px+)

### Acceptance Criteria

- [ ] Arabic renders correctly with Cairo/Tajawal fonts
- [ ] RTL layout is applied automatically for `ar` locale
- [ ] Color tokens available across all Tailwind classes
- [ ] Base components render in both locales
- [ ] Storybook or isolated test page for component review (optional but recommended)

---

## Spec 2 — `cms-content-management.md`

### Goal

Allow the store owner to edit landing page content from the admin dashboard without touching code.

### Image Storage — Cloudinary

All CMS image uploads go through **Cloudinary**. Supabase stores the Cloudinary `public_id` and `secure_url` together as a `jsonb` asset object — never a bare URL. The `public_id` is required to delete the asset from Cloudinary when an image is removed or replaced.

**Upload flow:**

1. Admin selects an image in the dashboard
2. Client uploads directly to Cloudinary via `<CldUploadWidget />` using an unsigned upload preset
3. Cloudinary returns an upload result object containing `public_id` and `secure_url`
4. Both fields are saved to Supabase as a `CloudinaryAsset` object via the repository

**Delete flow:**

1. Admin removes or replaces an image
2. A Next.js **Server Action** receives the `public_id`
3. Server Action calls Cloudinary's Destroy API using `CLOUDINARY_API_SECRET` (never exposed to client)
4. On success, the repository removes the asset record from Supabase

**Cloudinary folder structure:**

```
kylie/
├── cms/
│   ├── hero/
│   ├── vision/
│   ├── about/
│   └── footer/
└── reels/
    └── covers/
```

**Environment variables required:**

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=   # unsigned preset for client-side upload
CLOUDINARY_API_KEY=                      # server-side only
CLOUDINARY_API_SECRET=                   # server-side only
```

**Shared type: `lib/cloudinary/types.ts`**

```ts
export type CloudinaryAsset = {
  public_id: string; // e.g. "kylie/cms/hero/abc123"
  secure_url: string; // e.g. "https://res.cloudinary.com/..."
};
```

**Server utility: `lib/cloudinary/delete.ts`**

```ts
// Server-side only — never import in client components
export async function deleteFromCloudinary(publicId: string): Promise<void>;
// Calls Cloudinary Destroy API with API key + secret
```

**Server Action: `actions/cloudinary.actions.ts`**

```ts
'use server';
export async function deleteCloudinaryAsset(publicId: string): Promise<void>;
// Validates admin session, then calls deleteFromCloudinary(publicId)
```

Use `next-cloudinary` package for the admin image picker component (`<CldUploadWidget />`).

---

### Scope

**Supabase Table: `cms_sections`**

```sql
id            uuid primary key
section_key   text unique  -- 'hero' | 'vision' | 'about' | 'footer'
content_ar    jsonb
content_en    jsonb
images        jsonb[]      -- CloudinaryAsset[] { public_id, secure_url }
is_active     boolean default true
sort_order    int
updated_at    timestamptz
```

**Supabase Table: `cms_social_links`**

```sql
id        uuid primary key
platform  text     -- 'instagram' | 'tiktok' | 'facebook' | 'whatsapp'
url       text
is_active boolean
```

**Supabase Table: `cms_reels`**

```sql
id           uuid primary key
video_url    text    -- external video URL (YouTube / TikTok embed, or direct mp4)
cover_image  jsonb   -- CloudinaryAsset { public_id, secure_url }
sort_order   int
is_active    boolean
```

**Repository: `CmsRepository`**

- `getSectionByKey(key: string): Promise<CmsSection>`
- `getAllSections(): Promise<CmsSection[]>`
- `updateSection(key, data): Promise<void>` (admin only)
- `getSocialLinks(): Promise<SocialLink[]>`
- `getReels(): Promise<Reel[]>`
- `addSectionImage(key, asset: CloudinaryAsset): Promise<void>` (admin only — appends to `images` array)
- `removeSectionImage(key, publicId: string): Promise<void>` (admin only — removes matching asset from `images` array)
- `updateReelCover(id, asset: CloudinaryAsset): Promise<void>` (admin only — replaces `cover_image`, triggers delete of old `public_id`)

---

### Admin Upload Component

```tsx
// components/admin/cms/ImageUploadField.tsx
import { CldUploadWidget } from 'next-cloudinary';

// On upload success: extract { public_id, secure_url } from the result
// and pass both as a CloudinaryAsset to the onUpload callback
// Never store secure_url alone — always pair with public_id
```

On **replace**: call `deleteCloudinaryAsset(oldAsset.public_id)` via Server Action before saving the new asset.

On **remove**: call `deleteCloudinaryAsset(asset.public_id)` via Server Action, then call `removeSectionImage` on the repository.

No intermediate state — both the Cloudinary delete and the Supabase update complete before the UI reflects the change.

---

### Acceptance Criteria

- [ ] All landing page text is sourced from `cms_sections`
- [ ] Admin can edit any section content and it reflects on the landing page without a code deploy
- [ ] Every uploaded image is stored as `{ public_id, secure_url }` — never a bare URL
- [ ] Deleting or replacing an image calls the Cloudinary Destroy API via a Server Action using the stored `public_id`
- [ ] `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` are used server-side only — never in client components
- [ ] Arabic and English content stored independently per section (`content_ar` / `content_en`)
- [ ] Sections can be reordered via `sort_order`
- [ ] Reel cover images stored as `CloudinaryAsset` in `cover_image` jsonb column

---

## Spec 3 — `product-catalog.md`

### Goal

Build the full product data infrastructure: categories, subcategories, products, images, translations, status.

### Scope

**Supabase Tables**

`categories`

```sql
id          uuid primary key
slug        text unique
name_ar     text
name_en     text
image       jsonb   -- CloudinaryAsset { public_id, secure_url }
sort_order  int
is_active   boolean
```

`subcategories`

```sql
id            uuid primary key
category_id   uuid references categories
slug          text unique
name_ar       text
name_en       text
sort_order    int
is_active     boolean
```

`products`

```sql
id               uuid primary key
slug             text unique
category_id      uuid references categories
subcategory_id   uuid references subcategories
name_ar          text
name_en          text
description_ar   text
description_en   text
price            numeric(10,2)
compare_price    numeric(10,2)   -- original price if on offer
is_featured      boolean default false
is_best_seller   boolean default false
status           text  -- 'active' | 'draft' | 'archived'
stock_count      int default 0
created_at       timestamptz
```

`product_images`

```sql
id          uuid primary key
product_id  uuid references products
image       jsonb   -- CloudinaryAsset { public_id, secure_url }
sort_order  int
is_primary  boolean default false
```

> All image columns in catalog tables use `CloudinaryAsset { public_id, secure_url }` (defined in `lib/cloudinary/types.ts`). The `public_id` is used when deleting a product, a category, or a specific image from the admin dashboard — calling `deleteCloudinaryAsset(public_id)` via Server Action before removing the DB row.

**Repository: `ProductRepository`**

- `getProducts(filters, pagination): Promise<PaginatedResult<Product>>`
- `getProductBySlug(slug): Promise<Product>`
- `getProductsByCategory(categoryId): Promise<Product[]>`
- `getBestSellers(limit): Promise<Product[]>`
- `getFeaturedProducts(limit): Promise<Product[]>`
- `searchProducts(query): Promise<Product[]>`
- `createProduct(data): Promise<Product>` (admin)
- `updateProduct(id, data): Promise<Product>` (admin)
- `deleteProduct(id): Promise<void>` (admin)

**Repository: `CategoryRepository`**

- `getCategories(): Promise<Category[]>`
- `getCategoryBySlug(slug): Promise<Category>`
- `getSubcategories(categoryId): Promise<Subcategory[]>`

### Acceptance Criteria

- [ ] Products support multi-image with primary image designation
- [ ] Arabic and English fields on all catalog entities
- [ ] Product status controls visibility on storefront
- [ ] `compare_price` enables offer/sale display
- [ ] Search works across Arabic and English name fields

---

## Spec 4 — `landing-experience.md`

### Goal

Present the brand story and products on the home page. Mobile-first, fast, SEO-ready.

### Page Sections (in order)

**1. Hero**

- Full-width, rich visual section
- Headline + subheading from CMS (`hero` section key)
- CTA button linking to `/shop`
- Background image from CMS
- Arabic headline uses Cairo 800, large display size

**2. Best Sellers**

- Horizontal scroll on mobile, grid on desktop
- 6–8 products from `ProductRepository.getBestSellers()`
- `ProductCard` component (image, name, price, add-to-cart button)

**3. Vision**

- Brand statement / mission section
- Text from CMS (`vision` section key)
- Optional background image

**4. Category Product Rows (×2)**

- Two separate rows, each for a different category
- Each row: category title + "عرض الكل" link to `/shop?category=slug`
- 4 products per row (grid)
- Products from `ProductRepository.getProductsByCategory()`

**5. About**

- Brand story text from CMS (`about` section key)
- Optional image

**6. Reels Slider**

- Horizontal scrollable reel cards
- Each card: cover image + play icon linking to video URL
- Data from `CmsRepository.getReels()`

**7. Footer**

- Logo, social links, nav links, copyright
- Social links from `CmsRepository.getSocialLinks()`
- Footer text from CMS (`footer` section key)

### Component Map

```
app/[locale]/page.tsx (Server Component)
├── HeroSection
├── BestSellersSection
├── VisionSection
├── CategoryProductRow (×2)
├── AboutSection
├── ReelsSlider (Client Component — scroll interaction)
└── Footer
```

### Acceptance Criteria

- [ ] All text sourced from CMS — no hardcoded copy
- [ ] Page loads with Server Components, no client-side fetch waterfalls
- [ ] Fully responsive mobile → desktop
- [ ] Arabic RTL layout correct throughout
- [ ] Images lazy-loaded with `next/image`
- [ ] `<title>` and meta description set from CMS content

---

## Spec 5 — `shop-experience.md`

### Goal

Enable product discovery with filtering, sorting, and pagination.

### URL Structure

`/shop?category=slug&subcategory=slug&sort=newest&minPrice=0&maxPrice=500&offer=true&page=1`

All filter state is URL-synchronized — no hidden client state.

### Filters

| Filter      | Type          | Values                      |
| ----------- | ------------- | --------------------------- |
| Category    | Single select | From `CategoryRepository`   |
| Subcategory | Single select | Dependent on category       |
| Price Range | Range         | Min / Max numeric           |
| Offers only | Toggle        | `compare_price IS NOT NULL` |
| Newest      | Toggle        | Sort by `created_at DESC`   |

### Sort Options

- Newest (`created_at DESC`)
- Price: Low to High
- Price: High to Low
- Best Selling (`is_best_seller DESC`)
- Featured (`is_featured DESC`)

### Pagination

- Server-side, 20 products per page
- Page number in URL (`?page=2`)
- `ProductRepository.getProducts(filters, { page, pageSize })` returns `{ data, total, page, pageSize }`

### Components

```
app/[locale]/shop/page.tsx (Server Component)
├── ShopFilters (Client Component — filter UI, updates URL)
├── SortDropdown (Client Component)
├── ProductGrid
│   └── ProductCard (×N)
└── Pagination
```

**`ProductCard`**

- Primary image
- Product name (Arabic)
- Price (with crossed-out compare price if on offer)
- "أضف للسلة" button
- Favorite toggle icon

### Acceptance Criteria

- [ ] URL reflects all active filters — shareable and bookmarkable
- [ ] Filters update without full page reload (via `router.push`)
- [ ] Server-side pagination returns correct total count
- [ ] Subcategory filter is dependent on selected category
- [ ] Empty state shown when no products match filters

---

## Spec 6 — `product-details.md`

### Goal

Maximize conversion on the product detail page.

### URL

`/shop/[slug]`

### Page Sections

**Gallery**

- Primary image large, thumbnail strip below
- Swipe-enabled on mobile (touch scroll)
- All images from `product_images` ordered by `sort_order`

**Product Information**

- Name (Arabic primary, English secondary)
- Price + compare price (if offer)
- Status badge: "متاح" / "نفذ"
- Quantity selector
- "أضف للسلة" CTA
- "أضف للمفضلة" icon button

**Description**

- Full Arabic/English description from product record
- Locale-aware: show Arabic for `ar`, English for `en`

**Suggested Products**
Recommendation logic (in priority order):

1. Same subcategory → exclude current product
2. Same category → exclude current product
3. Best sellers → exclude current product
4. Any active products → exclude current product

Minimum: **8 products**. If total available < 8, show all (excluding current). Never show current product.

### Components

```
app/[locale]/shop/[slug]/page.tsx (Server Component)
├── ProductGallery (Client Component — swipe/thumbnail interaction)
├── ProductInfo (Client Component — qty, add to cart)
├── ProductDescription
└── SuggestedProducts
    └── ProductCard (×8+)
```

### Acceptance Criteria

- [ ] Suggestion logic follows priority order
- [ ] Minimum 8 suggestions always shown unless total catalog < 9 products
- [ ] Gallery swipe works on mobile
- [ ] Locale-correct text for all product fields
- [ ] OG meta tags include product image and name

---

## Spec 7 — `cart-management.md`

### Goal

Prepare order before checkout. Persistent across sessions.

### Cart State

Managed with **Zustand** + `localStorage` for guests. If authenticated, cart is synced to Supabase on change.

**Supabase Table: `carts`**

```sql
id          uuid primary key
customer_id uuid references customers  -- nullable for guest
session_id  text                        -- for guest identification
created_at  timestamptz
```

**Supabase Table: `cart_items`**

```sql
id         uuid primary key
cart_id    uuid references carts
product_id uuid references products
quantity   int
added_at   timestamptz
```

**Repository: `CartRepository`**

- `getCart(cartId): Promise<CartWithItems>`
- `addItem(cartId, productId, qty): Promise<void>`
- `removeItem(cartId, itemId): Promise<void>`
- `updateQuantity(cartId, itemId, qty): Promise<void>`
- `clearCart(cartId): Promise<void>`

### Cart Page Sections

**Cart Items List**

- Product image, name, price
- Quantity controls (+ / −)
- Remove button
- Line total

**Cart Summary**

- Subtotal
- Delivery note ("التوصيل يُحدد عند التأكيد")
- "إتمام الطلب" CTA → checkout

**Suggested Products**

- If cart has items: products from same categories as cart items
- If cart empty: best sellers
- Show 4–6 cards horizontally

### Acceptance Criteria

- [ ] Cart persists on page refresh (localStorage for guest)
- [ ] Authenticated cart synced to Supabase
- [ ] Adding same product increments quantity
- [ ] Suggestions update based on cart contents

---

## Spec 8 — `order-management.md`

### Goal

Handle order submission, Instapay payment, manual verification, and order history.

### Order Flow

```
Cart → Checkout → Choose Payment → Submit Order → Pending → Confirmed → Delivered
```

### Supabase Tables

`orders`

```sql
id               uuid primary key
order_number     text unique  -- human-readable e.g. KYL-00145
customer_id      uuid references customers
status           text  -- see statuses below
payment_method   text  -- 'cod' | 'instapay'
payment_status   text  -- 'pending' | 'verified' | 'failed'
payment_proof_url text  -- screenshot URL for instapay
subtotal         numeric(10,2)
delivery_fee     numeric(10,2)
total            numeric(10,2)
notes            text
created_at       timestamptz
```

`order_items`

```sql
id          uuid primary key
order_id    uuid references orders
product_id  uuid references products
product_name_ar text  -- snapshot at time of order
product_name_en text
unit_price  numeric(10,2)
quantity    int
```

`customers`

```sql
id           uuid primary key (links to Supabase auth.users)
name_ar      text
phone        text
address_ar   text
city         text
created_at   timestamptz
```

### Order Statuses

`pending` → `confirmed` → `preparing` → `shipped` → `delivered` | `cancelled`

### Checkout Flow

**Step 1 — Customer Info**

- Name, phone, address (Arabic), city
- React Hook Form + Zod validation

**Step 2 — Payment Method**

- Cash on Delivery: confirm and submit
- Instapay: show QR code + Instapay link from CMS, prompt to upload payment screenshot

**Step 3 — Confirmation Screen**

- Order number displayed
- Payment instructions reminder
- "متابعة طلباتي" link

### Payment Screenshot Upload

- Supabase Storage bucket: `payment-proofs`
- Upload on checkout, URL saved to `orders.payment_proof_url`
- Admin sees screenshot in order detail view

### Order History Page (`/orders`)

- Requires authentication
- List of past orders: order number, date, status badge, total
- Click → order detail: items, status timeline, payment status

### Repository: `OrderRepository`

- `createOrder(data): Promise<Order>`
- `getOrdersByCustomer(customerId): Promise<Order[]>`
- `getOrderById(id): Promise<OrderWithItems>`
- `updateOrderStatus(id, status): Promise<void>` (admin)
- `verifyPayment(id): Promise<void>` (admin)

### Acceptance Criteria

- [ ] Order number generated on creation (KYL-XXXXX format)
- [ ] Instapay QR + link displayed from CMS content
- [ ] Payment screenshot uploads to Supabase Storage
- [ ] Order status visible in customer order history
- [ ] Product name snapshot captured at order time (price-change safe)

---

## Spec 9 — `favorites-management.md`

### Goal

Allow customers to save products and receive relevant suggestions.

### Favorites State

- Guest: `localStorage`
- Authenticated: Supabase table

**Supabase Table: `favorites`**

```sql
id          uuid primary key
customer_id uuid references customers
product_id  uuid references products
added_at    timestamptz
unique(customer_id, product_id)
```

**Repository: `FavoriteRepository`**

- `getFavorites(customerId): Promise<Product[]>`
- `addFavorite(customerId, productId): Promise<void>`
- `removeFavorite(customerId, productId): Promise<void>`
- `isFavorited(customerId, productId): Promise<boolean>`

### Favorites Page Sections

**Saved Products Grid**

- Same `ProductCard` used across shop/PDP
- Remove from favorites icon on each card

**Suggested Products**

- If favorites exist: products from same categories as favorited items (exclude already favorited)
- If favorites empty: best sellers
- 4–6 cards

### Acceptance Criteria

- [ ] Favorite toggle works from ProductCard anywhere on site
- [ ] Authenticated favorites sync to Supabase
- [ ] Guest favorites merge with account on login
- [ ] Suggestions correctly sourced from favorite categories

---

## Spec 10 — `admin-dashboard.md`

### Goal

Give the store owner full control over products, CMS content, and orders.

### Access

- Supabase Auth + role-based: `role = 'admin'` in `customers` table
- Admin routes under `/admin` protected by middleware

### Modules

**Products Module (`/admin/products`)**

- List all products (table view, searchable)
- Create product: name AR/EN, description AR/EN, price, compare_price, category, subcategory, status, images
- Edit product
- Delete / Archive product
- Image upload via Supabase Storage → `product-images` bucket
- Set primary image, reorder images

**Categories Module (`/admin/categories`)**

- CRUD for categories and subcategories
- Category image upload
- Reorder via `sort_order`

**Orders Module (`/admin/orders`)**

- List all orders (filterable by status, payment method, date range)
- Order detail: customer info, items, total, payment proof screenshot
- Change order status (dropdown)
- Mark Instapay payment as verified
- One-click view of payment screenshot

**CMS Module (`/admin/cms`)**

- Edit each section (hero, vision, about, footer)
- Rich text or plain text per field (Arabic + English)
- Upload section images
- Manage reels (add, remove, reorder)
- Manage social links

**Customers Module (`/admin/customers`)** _(read-only for MVP)_

- List customers
- View order history per customer

### Acceptance Criteria

- [ ] Admin access is role-gated — middleware blocks non-admins
- [ ] Product image upload, reorder, and primary image selection works
- [ ] Order status updates immediately in list view after change
- [ ] Payment proof screenshot visible inline in order detail
- [ ] CMS edits reflect on landing page without code deploy

---

## Spec 11 — `seo-and-performance.md`

### Goal

Make the platform fast, discoverable, and shareable.

### SEO

**Per-page metadata** via Next.js `generateMetadata`:

| Page           | Title                           | Description          | OG Image              |
| -------------- | ------------------------------- | -------------------- | --------------------- |
| `/`            | Brand name + tagline (from CMS) | Hero subheading      | Hero image            |
| `/shop`        | "تسوقي الآن — Kylie"            | Category description | Brand image           |
| `/shop/[slug]` | Product name                    | Product description  | Primary product image |
| `/cart`        | "سلة التسوق"                    | —                    | Brand image           |

- `sitemap.xml` auto-generated from all active product slugs + static pages
- `robots.txt` generated via Next.js route handler
- Schema.org `Product` markup on PDP
- Canonical URLs set on all pages

### Performance

- `next/image` for all images with correct `sizes` and `priority` on above-fold images
- All product list pages use Server Components
- React Query caching for client-side transitions
- Supabase queries select only required columns (no `SELECT *`)
- Pagination prevents over-fetching
- Fonts loaded via `next/font` (no layout shift)
- Lazy load sections below the fold (Suspense boundaries)

### Acceptance Criteria

- [ ] Lighthouse score ≥ 90 on mobile for landing page
- [ ] All product pages have OG image tag
- [ ] Sitemap includes all active products
- [ ] No layout shift on font load (CLS = 0)
- [ ] Images never exceed their rendered size in bytes

---

## Implementation Order

| Phase | Spec                        | Depends On |
| ----- | --------------------------- | ---------- |
| 1     | `brand-foundation.md`       | —          |
| 2     | `cms-content-management.md` | 1          |
| 3     | `product-catalog.md`        | 1          |
| 4     | `landing-experience.md`     | 2, 3       |
| 5     | `shop-experience.md`        | 3          |
| 6     | `product-details.md`        | 3, 5       |
| 7     | `cart-management.md`        | 3, 6       |
| 8     | `order-management.md`       | 7          |
| 9     | `favorites-management.md`   | 3, 6       |
| 10    | `admin-dashboard.md`        | 2, 3, 8, 9 |
| 11    | `seo-and-performance.md`    | 4, 5, 6    |

---

## Out of Scope (Future)

Document now, implement later:

- Reviews & Ratings
- Loyalty / Points Program
- Coupon / Discount Codes
- WhatsApp Order Notifications
- AI Product Recommendations
- Inventory Tracking & Alerts
- Online Payment Gateway (Paymob, Fawry)
- Multi-Store / Multi-Vendor Support
