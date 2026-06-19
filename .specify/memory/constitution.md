<!--
Sync Impact Report
- Version change: template → 1.0.0
- Modified principles: N/A (all new from template placeholders)
- Added sections: Core Principles, Technology Stack & Architecture, Development Standards, Governance
- Removed sections: N/A
- Templates requiring updates:
  - .specify/templates/plan-template.md ✅ no changes needed
  - .specify/templates/spec-template.md ✅ no changes needed
  - .specify/templates/tasks-template.md ✅ no changes needed
- Follow-up TODOs: none
-->

# Kylie Cosmetics Constitution

## Core Principles

### I. Repository Pattern

UI components and pages MUST NOT import or call the Supabase client directly. All data access MUST go through typed repository classes located in `src/repositories/`. Repository classes MUST be the only modules that interact with Supabase Auth, Database, and Storage.

**Rationale**: Enforces separation of concerns, keeps credentials and query logic out of the UI, and makes the data layer independently testable and replaceable.

### II. Server-First Rendering

Pages and layouts MUST be Server Components by default. Client Components MUST be used only when interactivity, browser-only APIs, or React lifecycle logic is required. Client Component boundaries SHOULD be as small and as deep in the tree as possible.

**Rationale**: Minimizes client JavaScript, improves First Contentful Paint, keeps data fetching close to the data source, and protects secrets from leaking to the browser.

### III. Arabic-First, RTL-Native

Arabic (`ar`) MUST be the default locale and the primary layout direction MUST be RTL. English (`en`) is a secondary locale and MUST switch the layout to LTR automatically. All user-facing strings MUST live in translation files; no hardcoded Arabic or English text is allowed in components.

**Rationale**: The target market is Arabic-speaking Egyptian women. An RTL-native, fully Arabic experience is a competitive requirement, not a translation afterthought.

### IV. Brand Token System

All visual styling MUST use the project design tokens. Colors MUST be restricted to the brand palette: cream (`#FFFAF3`), sand (`#FFF2DB`), gold (`#FFE5BF`), and rose (`#F62440`) for brand surfaces and actions. Typography MUST use Cairo for Arabic display text, Tajawal for Arabic body text, and Inter for Latin fallback.

**Rationale**: A clean, minimal, and stunning identity depends on consistency. Tokens eliminate ad-hoc values and speed up design decisions across the platform.

### V. Clean, Focused Components

Every component MUST have a single, clearly defined responsibility. Components SHOULD be short enough to read without excessive scrolling. Any deviation from standard patterns MUST be justified in a code comment or design document.

**Rationale**: Short, single-responsibility components are easier to read, test, maintain, and reuse across the storefront and the admin dashboard.

## Technology Stack & Architecture

The project is built on the following stack:

- **Framework**: Next.js 16 App Router, TypeScript, strict mode enabled.
- **Styling**: TailwindCSS 4, Shadcn/UI primitives, CSS Modules for scoped overrides when needed.
- **State**: Zustand for client state, React Query for server state and caching.
- **Forms**: React Hook Form with Zod validation.
- **Internationalization**: next-intl for routing, locale detection, and translation management.
- **Backend**: Supabase for Auth, PostgreSQL, and Storage.

The architecture follows a feature-based folder structure under `src/features/`, shared repositories under `src/repositories/`, and shared UI primitives under `src/components/`. Server Components are the default; Client Components are opt-in. Supabase client setup uses environment variables, and placeholder values are acceptable only during the foundation phase.

## Development Standards

All work MUST follow these standards:

- **Mobile-first responsive design**: base styles target 375px+, `md` targets 768px+, `lg` targets 1280px+.
- **No hardcoded strings**: every user-facing label, message, and CTA MUST come from translation files.
- **Build and lint compliance**: all code MUST pass `pnpm lint` and `pnpm build` without errors.
- **TypeScript discipline**: strict mode is enabled; any use of `any` or non-null assertions MUST be justified.
- **Accessibility**: interactive elements MUST have accessible labels, focus states, and keyboard support.
- **Performance**: product list pages and landing sections MUST use Server Components where possible; images MUST use `next/image` with correct `sizes` and lazy loading.

## Governance

This constitution supersedes all other project practices. Amendments require an update to this document, a documented rationale, a semantic version bump, and explicit approval.

- **MAJOR**: backward-incompatible governance changes or principle redefinitions.
- **MINOR**: new principles, sections, or materially expanded guidance.
- **PATCH**: clarifications, wording improvements, typo fixes, or non-semantic refinements.

Every pull request MUST verify compliance with these principles. The `PLAN.md` at the repository root is the authoritative implementation reference and MUST stay aligned with the constitution.

**Version**: 1.0.0 | **Ratified**: 2026-06-18 | **Last Amended**: 2026-06-18
