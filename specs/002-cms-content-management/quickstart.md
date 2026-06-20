# Quickstart: CMS Content Management Validation

This guide describes how to validate that the CMS feature works end-to-end after implementation.

## Prerequisites

- Spec 1 (Brand Foundation) is implemented and running.
- Supabase project is configured and accessible.
- Cloudinary cloud name and unsigned upload preset are configured.
- Environment variables for Cloudinary and Supabase are populated.
- Database tables `cms_sections`, `cms_social_links`, and `cms_reels` exist with seed rows for `hero`, `vision`, `about`, `footer`.

## 1. Start the Development Server

```bash
pnpm dev
```

Open the admin CMS page at `http://localhost:3000/admin/cms`.

## 2. Edit a Landing Page Section

1. Navigate to **CMS → Sections → Hero**.
2. Enter Arabic headline and CTA text.
3. Enter English headline and CTA text.
4. Upload a hero image using the image picker.
5. Save the section.
6. Open `http://localhost:3000/` and verify the Arabic hero renders with the new text and image.
7. Switch to `http://localhost:3000/en` and verify the English hero renders correctly.

**Expected outcome**: Arabic and English content are independently editable and display in the correct locale and layout direction.

## 3. Replace a Section Image

1. Return to the Hero section editor.
2. Remove or replace the existing image.
3. Save the section.
4. Verify the old image no longer appears on the landing page.
5. Verify the old image is removed from Cloudinary (check the Cloudinary media library or logs).

**Expected outcome**: The old image asset is deleted from media storage and the new image appears on the storefront.

## 4. Manage Social Links

1. Navigate to **CMS → Social Links**.
2. Add or update Instagram and WhatsApp URLs.
3. Disable the Facebook link.
4. Save changes.
5. Open the landing page footer and verify only Instagram and WhatsApp links appear.

**Expected outcome**: Active social links render; inactive links are hidden.

## 5. Manage Reels

1. Navigate to **CMS → Reels**.
2. Add a reel with a video URL and a cover image.
3. Reorder the reel to the top position.
4. Save changes.
5. Open the landing page and verify the reel appears first in the reels slider.

**Expected outcome**: Reels display in the configured order with cover images and link to the provided video URL.

## 6. Validate Error Handling

1. Attempt to replace a section image while offline or with invalid Cloudinary credentials.
2. Verify the operation aborts and an error message is shown to the admin.
3. Verify the database record is not updated.

**Expected outcome**: Failed media deletion aborts the operation and keeps CMS and storage in sync.

## 7. Run Build and Lint

```bash
pnpm lint
pnpm build
```

**Expected outcome**: Both commands complete without errors.

## 8. Locale Fallback Check

1. Save Arabic content for a section but leave the English content empty.
2. Open the English landing page.

**Expected outcome**: The storefront falls back to Arabic content for that section.

## Related Artifacts

- Data model: [data-model.md](data-model.md)
- TypeScript contracts: [contracts/cms.ts](contracts/cms.ts)
- Feature spec: [spec.md](spec.md)
