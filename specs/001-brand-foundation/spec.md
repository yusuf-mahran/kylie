# Feature Specification: Brand Foundation

**Feature Branch**: `[001-brand-foundation]`

**Created**: 2026-06-19

**Status**: Draft

**Input**: User description: "read @PLAN.md and create specification for phase 0: brand-foundation"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Arabic-First Store Experience (Priority: P1)

An Egyptian Arabic-speaking woman opens the store on her phone. She sees the interface in Arabic, reads headings and buttons in a native Arabic typeface, and the layout flows naturally from right to left.

**Why this priority**: The target market is Arabic-speaking Egyptian women. An RTL-native, fully Arabic experience is the baseline expectation; anything less feels foreign and hurts trust.

**Independent Test**: Open the store with Arabic locale. Verify that all visible text is Arabic, the layout is RTL, and headings/body text use the brand Arabic fonts.

**Acceptance Scenarios**:

1. **Given** a shopper has set Arabic as her preferred language, **When** she opens the store, **Then** every label, button, and heading appears in Arabic with RTL layout.
2. **Given** a shopper browses on a mobile phone, **When** she reads product names and CTAs, **Then** the Arabic display and body fonts render correctly without layout shift.

---

### User Story 2 - English Language Fallback (Priority: P1)

A bilingual shopper or non-Arabic visitor switches the store to English. The layout flips to left-to-right, text becomes English, and the same brand identity is preserved.

**Why this priority**: English is the secondary language for the brand. Supporting it expands reach while keeping Arabic primary.

**Independent Test**: Switch locale to English. Verify layout becomes LTR, text is English, and fonts fall back to the Latin typeface gracefully.

**Acceptance Scenarios**:

1. **Given** a visitor selects English, **When** the page reloads, **Then** all user-facing text is in English and the layout direction is LTR.
2. **Given** a visitor switches back to Arabic, **When** the page updates, **Then** the layout returns to RTL and text returns to Arabic.

---

### User Story 3 - Consistent Brand Look and Feel (Priority: P2)

The development team builds new screens using a shared set of colors, fonts, spacing, and components. Every screen looks like it belongs to the same brand without ad-hoc styling decisions.

**Why this priority**: A clean, minimal, stunning identity depends on consistency. A shared foundation reduces design drift and speeds up later feature work.

**Independent Test**: Inspect any new screen built during later phases. Verify it uses only the approved brand tokens and reusable base components.

**Acceptance Scenarios**:

1. **Given** a developer adds a new page, **When** she applies the shared buttons, badges, typography, and section wrapper, **Then** the page matches the brand palette and spacing scale automatically.
2. **Given** a reviewer audits the codebase, **When** she searches for hardcoded colors or fonts, **Then** none exist outside the token definitions.

---

### User Story 4 - Responsive Across Devices (Priority: P3)

A shopper browses the store on a small phone, a tablet, or a desktop monitor. The layout adapts cleanly at each breakpoint without horizontal scroll or broken components.

**Why this priority**: The audience is mobile-first, but the store must remain usable and polished on larger screens.

**Independent Test**: Resize the viewport across mobile, tablet, and desktop widths. Verify the layout and components adapt without overflow or clipping.

**Acceptance Scenarios**:

1. **Given** a shopper uses a 375px-wide phone, **When** she views the home page, **Then** content fits within the screen and text remains readable.
2. **Given** a shopper uses a 1280px desktop, **When** she views the same page, **Then** content is contained and visually balanced.

---

### Edge Cases

- Missing translation keys MUST fall back to the Arabic translation to protect the primary-market experience.
- How does the system handle mixed Arabic and English text in a single sentence?
- Viewports between 320px and 375px MUST scale fluidly without horizontal overflow.
- Arabic fonts MUST load with `font-display: swap`; text remains visible in system fallback fonts until Cairo/Tajawal load.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The platform MUST support Arabic as the default language.
- **FR-002**: The platform MUST support English as a secondary language.
- **FR-003**: The platform MUST switch text direction to RTL for Arabic and LTR for English automatically based on the active locale.
- **FR-004**: All user-facing text MUST be defined in translation files; no hardcoded Arabic or English text is allowed in UI code.
- **FR-005**: The visual design MUST use the brand color palette: cream (`#FFFAF3`), sand (`#FFF2DB`), gold (`#FFE5BF`), and rose (`#F62440`).
- **FR-006**: Typography MUST use Cairo for Arabic headings, Tajawal for Arabic body text, and Inter for Latin fallback.
- **FR-007**: The design system MUST provide consistent spacing, border radius, and shadow tokens.
- **FR-008**: Reusable base components MUST be available: RTL wrapper, primary/secondary/ghost buttons, badges for "جديد / New", "عرض / Offer", and "الأكثر مبيعاً / Best Seller", section container, and typography components.
- **FR-009**: The layout MUST adapt to mobile (375px+), tablet (768px+), and desktop (1280px+) viewports.
- **FR-010**: Arabic MUST be served at the root path (`/`) with no locale prefix; English MUST be served at `/en`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Arabic text renders with the Cairo/Tajawal fonts and RTL layout is applied automatically when Arabic is the active locale.
- **SC-002**: English text renders with LTR layout and the Inter Latin fallback when English is the active locale.
- **SC-003**: All base components render correctly in both Arabic and English without visual breakage.
- **SC-004**: A code audit finds zero hardcoded Arabic or English strings in UI components.
- **SC-005**: The interface adapts cleanly across 375px, 768px, and 1280px viewports with no horizontal overflow.
- **SC-006**: An isolated in-app demo page exists that renders all base components in both Arabic and English for stakeholder review.

## Assumptions

- The target market is Arabic-speaking Egyptian women, and mobile traffic is the primary use case.
- Brand colors and fonts are fixed based on the provided design direction and will not change during later phases.
- No dark mode is required for the MVP.
- Translation files will be the single source of truth for all user-facing text, including static marketing copy and common labels.

## Clarifications

### Session 2026-06-19

- Q: What should display when a translation key is missing? → A: Fall back to the Arabic translation.
- Q: What happens on viewports narrower than 375px? → A: Support 320px–375px with fluid scaling and no horizontal overflow.
- Q: How should the layout behave if Arabic fonts fail to load? → A: Use `font-display: swap` so text renders in system fallback fonts first, then swaps to Cairo/Tajawal once loaded.
- Q: How should Arabic and English locales be represented in URLs? → A: Arabic is served at `/` with no prefix; English is served at `/en`.
- Q: How should base components be reviewed before later phases depend on them? → A: Create an isolated in-app demo page (e.g., `/style-guide`) showing components in both locales.
