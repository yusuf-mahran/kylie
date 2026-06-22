# Quickstart: Product Catalog Validation

This guide describes how to validate that the product catalog feature works end-to-end after implementation.

## Prerequisites

- Spec 1 (Brand Foundation) is implemented and running.
- Spec 2 (CMS Content Management) Cloudinary setup is configured.
- Supabase project is configured and accessible.
- Environment variables for Supabase, Cloudinary, and OpenRouter (`OPENROUTER_API_KEY`) are populated.
- Database tables `categories`, `subcategories`, `products`, `product_images`, and `product_accordion_sections` exist.

## 1. Start the Development Server

```bash
pnpm dev
```

Open the admin products page at `http://localhost:3000/admin/products`.

## 2. Create a Category and Subcategory

1. Navigate to **Admin → Categories**.
2. Create a category with Arabic and English names, for example Makeup.
3. Create a subcategory under it, for example Lipstick.
4. Verify both appear in the category list with auto-generated slugs.

**Expected outcome**: Category and subcategory are stored with unique slugs, names in both locales, and the correct parent relationship.

## 3. Create a Product

1. Navigate to **Admin → Products → New**.
2. Fill Arabic and English names and summaries.
3. Set a price, for example 250 EGP, and a higher compare-at price, for example 350 EGP.
4. Select the category and subcategory created above.
5. Upload up to 10 images and mark one as primary.
6. Add one or more accordion sections with Arabic and English headings and descriptions.
7. Click the AI enhance button to generate suggestions for the title, slug, summary, or descriptions; review and edit before saving.
8. Save the product as active.

**Expected outcome**: Product is stored with localized content, images, accordion sections, and a valid unique slug. AI suggestions are editable and require review.

## 4. Browse by Category

1. Open `http://localhost:3000/shop?category=makeup`.
2. Verify the product appears with Arabic name, price, compare-at price struck through, and primary image.
3. Switch to `http://localhost:3000/en/shop?category=makeup` and verify English content and LTR layout.

**Expected outcome**: Only active products in the active category are displayed with correct localized content and offer styling.

## 5. Search the Catalog

1. Search for an Arabic keyword matching the product name, summary, or accordion description.
2. Verify the product appears in results.
3. Search for the same product using its English name.
4. Search for a draft or archived product and verify it does not appear.

**Expected outcome**: Search returns matching active products in both languages and excludes inactive products.

## 6. Test Featured and Best Seller Lists

1. Mark the product as featured and best seller.
2. Visit the landing page or a test route that renders featured products.
3. Verify the product appears.
4. Deactivate the product and verify it disappears from both lists.

**Expected outcome**: Curated lists include only active products flagged accordingly.

## 7. Delete a Product

1. Delete the product from the admin list.
2. Verify the product detail page returns a 404 or empty state.
3. Verify associated images are removed from Cloudinary.

**Expected outcome**: Product and all associated image assets are removed; no orphaned media remains.

## 8. Validate Error Handling

1. Attempt to create a product with a compare-at price equal to or lower than the price.
2. Attempt to upload an 11th image.
3. Attempt to delete a category that has products.
4. Attempt to create a product with a duplicate slug.

**Expected outcome**: Each operation is rejected with a clear error and no partial data is saved.

## 9. Run Build and Lint

```bash
pnpm lint
pnpm build
```

**Expected outcome**: Both commands complete without errors.

## Related Artifacts

- Data model: [data-model.md](data-model.md)
- TypeScript contracts: [contracts/catalog.ts](contracts/catalog.ts)
- Feature spec: [spec.md](spec.md)
