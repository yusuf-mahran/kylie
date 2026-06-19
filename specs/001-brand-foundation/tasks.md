# Tasks: Brand Foundation

**Input**: Design documents from `/specs/001-brand-foundation/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `quickstart.md`

**Goal**: Produce an Arabic-first, RTL-native storefront foundation with English secondary, a consistent brand token system, and reusable base components.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and initialize the component library.

- [X] T001 Install project dependencies: `pnpm add next-intl @supabase/supabase-js zustand @tanstack/react-query react-hook-form zod @hookform/resolvers lucide-react clsx tailwind-merge`
- [X] T002 [P] Initialize shadcn/ui: run `pnpm dlx shadcn@latest init`, select **Radix** library and **Luma** preset, confirm TypeScript and Tailwind v4 detection.
- [X] T003 Verify `src/lib/utils.ts` exports a `cn(...inputs: ClassValue[])` helper using `clsx` and `tailwind-merge`. If it does not exist, create it with that exact implementation.

**Checkpoint**: `package.json` contains all dependencies and `src/lib/utils.ts` exists.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Configure internationalization, routing, and the root layout before any user story work begins.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 [P] Create `src/i18n/routing.ts` with the following exact content:

  ```ts
  import { defineRouting } from "next-intl/routing";

  export const routing = defineRouting({
    locales: ["ar", "en"],
    defaultLocale: "ar",
    localePrefix: "as-needed",
  });
  ```

- [X] T005 [P] Create `src/i18n/request.ts` with the following exact content:

  ```ts
  import { getRequestConfig } from "next-intl/server";
  import { hasLocale } from "next-intl";
  import { routing } from "./routing";

  export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
      ? requested
      : routing.defaultLocale;

    return {
      locale,
      messages: (await import(`../messages/${locale}.json`)).default,
    };
  });
  ```

- [X] T006 [P] Create `src/i18n/navigation.ts` with the following exact content:

  ```ts
  import { createNavigation } from "next-intl/navigation";
  import { routing } from "./routing";

  export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
  ```

- [X] T007 Create `src/middleware.ts` with the following exact content:

  ```ts
  import createMiddleware from "next-intl/middleware";
  import { routing } from "./i18n/routing";

  export default createMiddleware(routing);

  export const config = {
    matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
  };
  ```

- [X] T008 Update `next.config.ts` to wrap the exported config with `createNextIntlPlugin()`. The final file should import `createNextIntlPlugin from "next-intl/plugin"` and export `withNextIntl(nextConfig)`.
- [X] T009 [P] Create `src/messages/ar.json` with Arabic translations for `HomePage`, `Common`, and `Badges` namespaces. Include at least: `HomePage.title`, `HomePage.subtitle`, `HomePage.cta`, `HomePage.description`, and the Common labels from the spec.
- [X] T010 [P] Create `src/messages/en.json` with the English equivalents of every key in `src/messages/ar.json`. Both files MUST have identical key structures.
- [X] T011 Create `src/components/shared/rtl-provider.tsx` as a Client Component (`"use client"`) that reads the locale with `useLocale()`, sets `document.documentElement.dir` and `document.documentElement.lang` in a `useEffect`, and renders its children inside a `<div dir={...}>`. See `data-model.md` for the prop shape.
- [X] T012 Create `src/app/[locale]/layout.tsx` as an async Server Component that: validates the `locale` param with `hasLocale`, calls `setRequestLocale(locale)`, dynamically imports `../../messages/${locale}.json`, and wraps children in `NextIntlClientProvider` and `RTLProvider`.
- [X] T013 Update `src/app/layout.tsx` to import and configure Cairo, Tajawal, and Inter via `next/font/google`. Apply their CSS variables to the `<html>` tag. Set default `lang="ar"` and `dir="rtl"` on `<html>`. Use `font-display: swap` for all fonts.

**Checkpoint**: `pnpm build` compiles without the "Couldn't find next-intl config file" error.

---

## Phase 3: User Story 1 — Arabic-First Store Experience (Priority: P1) 🎯 MVP

**Goal**: Arabic shoppers see the store in Arabic with RTL layout and native Arabic fonts.

**Independent Test**: Open `http://localhost:3000/`. Verify Arabic text, RTL direction, and Cairo/Tajawal fonts.

### Implementation for User Story 1

- [X] T014 [US1] Verify `src/messages/ar.json` contains complete Arabic copy for the home page demo, including `HomePage.title` = "كايلي" or equivalent brand name.
- [X] T015 [US1] Verify `src/app/layout.tsx` defaults to `lang="ar" dir="rtl"` and loads Cairo (700/800) and Tajawal (400/500) with Arabic subsets.
- [X] T016 [US1] Create a minimal `src/app/[locale]/page.tsx` Server Component that uses `useTranslations("HomePage")` and renders the Arabic title, subtitle, and CTA text from translations.
- [X] T017 [US1] Run `pnpm dev`, open `/`, and confirm the page text is Arabic and `<html dir="rtl" lang="ar">`. Take a screenshot or note the result.

**Checkpoint**: User Story 1 is independently viewable at `/`.

---

## Phase 4: User Story 2 — English Language Fallback (Priority: P1)

**Goal**: English shoppers can switch to English and see an LTR layout with Latin fallback fonts.

**Independent Test**: Open `http://localhost:3000/en`. Verify English text, LTR direction, and Inter font fallback.

### Implementation for User Story 2

- [X] T018 [US2] Verify `src/messages/en.json` contains complete English equivalents for every key used on the home page.
- [X] T019 [US2] Update `src/app/[locale]/page.tsx` to render translations that switch automatically based on the active locale. No hardcoded Arabic or English text should remain in the component.
- [X] T020 [US2] Run `pnpm dev`, open `/en`, and confirm the page text is English and `<html dir="ltr" lang="en">` after `RTLProvider` updates the DOM.
- [X] T021 [US2] Switch from `/en` back to `/` and confirm the layout returns to RTL and text returns to Arabic.

**Checkpoint**: User Stories 1 AND 2 both work at `/` and `/en`.

---

## Phase 5: User Story 3 — Consistent Brand Look and Feel (Priority: P2)

**Goal**: Developers have brand colors, fonts, spacing, and reusable components that keep every screen visually consistent.

**Independent Test**: Inspect the style-guide page. Verify every component uses only brand tokens and no hardcoded colors/fonts exist in component code.

### Implementation for User Story 3

- [X] T022 [P] [US3] Update `src/app/globals.css` to register brand colors in `@theme inline`: `--color-cream: #fffaf3;`, `--color-sand: #fff2db;`, `--color-gold: #ffe5bf;`, `--color-rose: #f62440;`.
- [X] T023 [P] [US3] Update `src/app/globals.css` to set `--font-sans` to a stack starting with Tajawal and Inter, and `--font-heading` to a stack starting with Cairo and Inter.
- [X] T024 [P] [US3] Update `src/app/globals.css` to set the brand radius scale: `--radius-sm: 4px;`, `--radius-md: 8px;`, `--radius-lg: 16px;`, and shadow scale: `--shadow-soft`, `--shadow-card`, `--shadow-modal`.
- [X] T025 [US3] Update the `:root` CSS variables in `src/app/globals.css` to map shadcn semantic tokens to brand colors: `--background: #fffaf3;`, `--foreground: #1f1f1f;`, `--primary: #f62440;`, `--primary-foreground: #fffaf3;`, `--secondary: #ffe5bf;`, `--muted: #ffe5bf;`, `--border: #ffe5bf;`, `--ring: #f62440;`, `--card: #fff2db;`, `--popover: #fff2db;`, `--accent: #fff2db;`.
- [X] T026 [P] [US3] Create `src/components/shared/typography.tsx` exporting `Heading`, `Subheading`, `BodyText`, and `Caption` components. Each must use `font-heading` or `font-sans` and accept `className` for overrides. See `data-model.md` for exact prop shapes.
- [X] T027 [P] [US3] Create `src/components/shared/brand-button.tsx` using `class-variance-authority` with `primary` (rose bg, cream text), `secondary` (rose outline, transparent bg), and `ghost` (transparent, rose text) variants. Support `asChild` for use with `Link`.
- [X] T028 [P] [US3] Create `src/components/shared/brand-badge.tsx` with `new` (gold bg), `offer` (rose bg, cream text), and `bestSeller` (sand bg, gold border) variants.
- [X] T029 [US3] Create `src/components/shared/section-wrapper.tsx` that renders a `<section>` with optional `contained` (max-width 7xl + horizontal padding) and `padded` (vertical rhythm) props.
- [X] T030 [US3] Run `grep -R "#FFFAF3\|#FFF2DB\|#FFE5BF\|#F62440" src/components src/app --include="*.tsx" --include="*.ts"` and confirm no hardcoded brand hex codes exist outside `globals.css`.

**Checkpoint**: User Stories 1, 2, and 3 all work; brand tokens are centralized in `globals.css`.

---

## Phase 6: User Story 4 — Responsive Across Devices (Priority: P3)

**Goal**: The layout adapts cleanly from small phones to desktop monitors.

**Independent Test**: Resize the browser to 320px, 375px, 768px, and 1280px. Confirm no horizontal overflow and components adapt.

### Implementation for User Story 4

- [X] T031 [US4] Update `src/app/[locale]/page.tsx` to use `SectionWrapper`, `Heading`, `BodyText`, `BrandButton`, and `BrandBadge` components. Render the page content centered with appropriate spacing.
- [X] T032 [US4] Create `src/app/[locale]/style-guide/page.tsx` that renders all base components (`Heading`, `Subheading`, `BodyText`, `Caption`, `BrandButton` variants, `BrandBadge` variants, `SectionWrapper`) in both Arabic and English. Use translations for labels.
- [X] T033 [US4] Verify `SectionWrapper` uses responsive padding (`px-4 sm:px-6 lg:px-8`) and vertical rhythm (`py-12 md:py-16 lg:py-20`) across breakpoints.
- [X] T034 [US4] Open DevTools, resize to 320px, 375px, 768px, and 1280px, and confirm no horizontal scrollbar appears on `/` or `/en/style-guide`.

**Checkpoint**: All user stories are independently functional and responsive.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Quality gates and final validation.

- [X] T035 [P] Run `pnpm lint` and fix any errors.
- [X] T036 [P] Run `pnpm build` and fix any errors.
- [X] T037 Follow the validation steps in `quickstart.md` for `/`, `/en`, and `/style-guide`.
- [X] T038 Verify the checklist in `specs/001-brand-foundation/checklists/requirements.md` still has all items passing after implementation.

**Checkpoint**: Foundation is complete, lint/build pass, and the quickstart validation succeeds.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup. Blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational.
- **User Story 2 (Phase 4)**: Depends on Foundational and US1 (shared home page).
- **User Story 3 (Phase 5)**: Depends on Foundational; can start after US1/2 home page exists.
- **User Story 4 (Phase 6)**: Depends on US3 components.
- **Polish (Phase 7)**: Depends on all user stories.

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational.
- **US2 (P1)**: Can start after Foundational; shares the home page with US1.
- **US3 (P2)**: Can start after Foundational; best validated once US1/2 pages exist.
- **US4 (P3)**: Can start after US3.

### Within Each User Story

- Foundational setup before story-specific tasks.
- Components before pages that use them.
- Manual verification as the final task in each story.

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel.
- All Foundational i18n files (`routing.ts`, `request.ts`, `navigation.ts`, `middleware.ts`, messages) can be created in parallel.
- All brand token tasks in US3 can run in parallel.
- All component creation tasks in US3 can run in parallel.
- `pnpm lint` and `pnpm build` in Polish can run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. **STOP and VALIDATE**: Test `/` in Arabic RTL.
5. Then proceed to US2, US3, US4.

### Incremental Delivery

1. Setup + Foundational → i18n routing works.
2. US1 → Arabic page renders.
3. US2 → English page renders.
4. US3 → Brand tokens and components centralized.
5. US4 → Responsive style-guide page.
6. Polish → lint/build pass.

---

## Notes

- Do not add extra libraries beyond those listed in T001 unless the task explicitly requires it.
- Every component MUST use the `cn()` helper from `src/lib/utils.ts` for class merging.
- All user-facing strings MUST come from `src/messages/ar.json` or `src/messages/en.json`.
- Commit after each task or logical group.
