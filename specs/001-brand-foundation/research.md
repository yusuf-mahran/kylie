# Research: Brand Foundation

## Decision: next-intl v4 with Next.js 16

**Decision**: Use next-intl v4 configured via the `next-intl/plugin` in `next.config.ts`.

**Rationale**:
- next-intl v4 requires the plugin to alias `next-intl/config` to the project's `src/i18n/request.ts` file. Without the plugin, the config resolves to a placeholder stub that throws at runtime.
- The plugin auto-discovers `src/i18n/request.ts`, keeping configuration minimal.
- It supports App Router Server Components, async `getRequestConfig`, and typed routing/navigation.

**Alternatives considered**:
- Manual `IntlProvider` wiring — rejected because it loses request-scoped locale handling and typed navigation.
- Custom i18n implementation — rejected because next-intl provides routing, RTL/LTR direction, and message loading out of the box.

## Decision: Arabic default at `/`, English at `/en`

**Decision**: Use `localePrefix: 'as-needed'` so Arabic is served at `/` and English at `/en`.

**Rationale**:
- Keeps URLs short for the primary Arabic audience.
- English remains shareable and indexable at `/en/*`.
- Aligns with the Arabic-first market positioning.

**Alternatives considered**:
- Always prefix (`/ar/`, `/en/`) — rejected because it adds unnecessary path segments for the default locale.
- Subdomains — rejected because they complicate deployment and SEO for a single-market MVP.

## Decision: TailwindCSS v4 `@theme inline` for Brand Tokens

**Decision**: Register brand colors, fonts, radius, and shadows inside the `@theme inline` block in `src/app/globals.css`.

**Rationale**:
- TailwindCSS v4 moves theme configuration to CSS via `@theme inline`.
- CSS variables map cleanly to shadcn's semantic tokens (`--color-primary`, `--color-background`, etc.).
- Brand colors can coexist with shadcn's color system by overriding semantic tokens.

**Alternatives considered**:
- Tailwind v3 `tailwind.config.js` — rejected because the project uses Tailwind v4.
- Pure CSS custom properties without `@theme` — rejected because it loses Tailwind utility class generation.

## Decision: next/font/google with `font-display: swap`

**Decision**: Load Cairo, Tajawal, and Inter via `next/font/google` with `display: 'swap'`.

**Rationale**:
- `next/font` self-hosts fonts, eliminating external network requests and layout shift.
- `display: swap` keeps text visible during font loading, satisfying the font-loading edge case from the spec.
- Arabic fonts Cairo and Tajawal are available on Google Fonts with the required weights.

**Alternatives considered**:
- External Google Fonts `<link>` — rejected because it causes layout shift and privacy concerns.
- Local font files — rejected because Google Fonts availability simplifies setup and Next.js handles optimization.

## Decision: Shadcn/UI Luma Preset with Custom Theme Override

**Decision**: Initialize shadcn/ui with the Luma preset, then override semantic tokens to match the brand palette.

**Rationale**:
- Luma provides a clean, minimal base that aligns with the brand aesthetic.
- Overriding CSS variables (`--background`, `--primary`, etc.) maps shadcn primitives to brand colors.
- Only the Button primitive is needed for this phase; additional primitives can be added later.

**Alternatives considered**:
- Custom component library from scratch — rejected because shadcn provides accessible, tested primitives.
- Other shadcn presets — rejected because Luma's neutral palette is closest to the cream/sand brand base.

## Decision: Next.js 16 `middleware.ts` for next-intl

**Decision**: Keep the intl middleware in `src/middleware.ts` despite Next.js 16 deprecating the middleware convention in favor of `proxy.ts`.

**Rationale**:
- next-intl v4's `createMiddleware` expects the middleware file convention.
- Turbopack dev mode fails to resolve the intl config when only `proxy.ts` is present.
- The deprecation warning is harmless and does not block builds or runtime behavior.

**Alternatives considered**:
- Migrate to `proxy.ts` — rejected because it breaks next-intl v4 dev-mode resolution.
- Dual `middleware.ts` + `proxy.ts` — rejected to avoid duplicate logic and potential conflicts.
