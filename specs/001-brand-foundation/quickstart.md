# Quickstart: Brand Foundation Validation

## Prerequisites

- Node.js and pnpm installed
- Dependencies installed: `pnpm install`

## Run the Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

## Validate Arabic RTL

1. Open `http://localhost:3000/`.
2. Confirm the page renders in Arabic.
3. Confirm the `<html>` element has `dir="rtl"` and `lang="ar"`.
4. Confirm headings use Cairo and body text uses Tajawal.
5. Confirm the brand colors (cream background, rose CTA) are applied.

## Validate English LTR

1. Open `http://localhost:3000/en`.
2. Confirm the page renders in English.
3. Confirm the `<html>` element updates to `dir="ltr"` and `lang="en"`.
4. Confirm Latin text uses Inter.

## Validate Base Components

1. Open `http://localhost:3000/style-guide` (or the agreed demo-page path).
2. Verify `Heading`, `Subheading`, `BodyText`, and `Caption` render in both locales.
3. Verify `BrandButton` primary, secondary, and ghost variants render correctly.
4. Verify `BrandBadge` new, offer, and best-seller variants render correctly.
5. Verify `SectionWrapper` contains content with consistent vertical rhythm and max-width.

## Validate Build and Lint

```bash
pnpm lint
pnpm build
```

Both commands MUST exit with no errors.

## Validate Responsiveness

1. Use browser DevTools to resize the viewport to:
   - 320px wide
   - 375px wide
   - 768px wide
   - 1280px wide
2. Confirm no horizontal overflow at any width.
3. Confirm text remains readable and components adapt cleanly.

## Expected Outcomes

- Arabic content at `/` with RTL layout and Cairo/Tajawal fonts.
- English content at `/en` with LTR layout and Inter fallback.
- No hardcoded Arabic or English strings in UI components.
- All base components render correctly in both locales.
- Build and lint pass cleanly.
