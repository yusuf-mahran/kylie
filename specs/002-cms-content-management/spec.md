# Feature Specification: CMS Content Management

**Feature Branch**: `[002-cms-content-management]`

**Created**: 2026-06-19

**Status**: Draft

**Input**: User description: "Allow the store owner to edit landing page content from the admin dashboard without touching code."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Edit Landing Page Sections (Priority: P1)

The store owner opens the admin dashboard, navigates to the CMS module, and edits the hero, vision, about, and footer sections. For each section she updates the Arabic and English text independently and uploads or replaces background images. She saves the changes and the landing page updates immediately.

**Why this priority**: The landing page is the brand's digital storefront. The owner must be able to refresh marketing copy and visuals without waiting for a developer or a code deployment.

**Independent Test**: Open the CMS module, edit the hero section in Arabic and English, upload a new hero image, save, and verify the landing page reflects all changes without redeploying.

**Acceptance Scenarios**:

1. **Given** the store owner is on the CMS section editor, **When** she updates the Arabic headline and saves, **Then** the Arabic landing page displays the new headline.
2. **Given** the store owner updates the English version of the same section, **When** she saves, **Then** the English landing page displays the new text while the Arabic page remains unchanged.
3. **Given** the store owner replaces a section image, **When** she saves, **Then** the old image is removed from media storage and the new image appears on the landing page.

---

### User Story 2 - Manage Social Media Links (Priority: P1)

The store owner adds or updates links to the brand's Instagram, TikTok, Facebook, and WhatsApp accounts from the admin dashboard. The footer and any other relevant area of the landing page display only the active links.

**Why this priority**: Social proof and direct customer contact channels are essential for a new cosmetics brand. The owner must control which platforms are promoted.

**Independent Test**: Add an Instagram URL and a WhatsApp number in the CMS social links area, disable Facebook, and verify only Instagram and WhatsApp appear on the landing page.

**Acceptance Scenarios**:

1. **Given** the store owner adds an active Instagram link, **When** she saves, **Then** the landing page footer shows the Instagram link.
2. **Given** the store owner disables the Facebook link, **When** she saves, **Then** the Facebook link no longer appears on the landing page.
3. **Given** a visitor clicks an active social link, **When** the link opens, **Then** it navigates to the exact URL entered by the owner.

---

### User Story 3 - Manage Promotional Reels (Priority: P2)

The store owner adds short promotional videos (reels) to the landing page. Each reel has an external video URL and a cover image. She can reorder reels, activate or deactivate individual reels, and replace cover images.

**Why this priority**: Reels showcase products and brand personality. Making them CMS-driven lets the marketing team refresh content frequently.

**Independent Test**: Add a reel with a video URL and cover image, reorder it to the top, and verify it appears first in the landing page reels slider.

**Acceptance Scenarios**:

1. **Given** the store owner adds a new reel with a cover image and video URL, **When** she activates and saves it, **Then** the reel appears in the landing page reels section.
2. **Given** the store owner changes the sort order of reels, **When** she saves, **Then** the landing page displays reels in the new order.
3. **Given** the store owner replaces a reel cover image, **When** she saves, **Then** the old cover image is removed from media storage and the new cover appears.

---

### User Story 4 - View Locale-Aware Landing Page (Priority: P1)

A shopper visits the store and sees the landing page in Arabic with RTL layout. She switches to English and sees the same sections in English with LTR layout. All text, images, reels, and social links come from the CMS.

**Why this priority**: The brand is Arabic-first but must support English gracefully. Content must be locale-aware so both markets see relevant copy.

**Independent Test**: Visit the landing page in Arabic and verify Arabic CMS content; switch to English and verify English CMS content and LTR layout.

**Acceptance Scenarios**:

1. **Given** a shopper opens the landing page in Arabic, **When** the page loads, **Then** every section displays Arabic text from the CMS with RTL layout.
2. **Given** a shopper switches to English, **When** the page updates, **Then** every section displays English text from the CMS with LTR layout.
3. **Given** a CMS section is marked inactive, **When** the page loads, **Then** that section is not displayed in either locale.

---

### Edge Cases

- If a CMS section has no content for the active locale, the system MUST fall back to Arabic content to protect the primary-market experience.
- If all images are removed from a section, the section MUST render without images rather than showing a broken image placeholder.
- If a section is inactive, it MUST be hidden from the storefront regardless of whether it has content or images.
- If a social link URL is invalid or empty, the link MUST not render on the storefront.
- If a reel has no cover image, the video URL link MUST still render using a sensible fallback.
- If two sections have the same sort order, the system MUST still produce a stable, predictable display order.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The store owner MUST be able to edit landing page section content in Arabic and English independently, using a hybrid of structured fields (headline, subheading, CTA text) and an optional rich body field per section.
- **FR-014**: The CMS MUST enforce validation rules on section structured fields: headline and CTA are required, with maximum lengths of 120 characters for headline and 240 characters for CTA; subheading and rich body remain optional.
- **FR-002**: The store owner MUST be able to upload, replace, and remove images associated with each CMS section, up to a maximum of 5 images per section.
- **FR-003**: Every uploaded image MUST be stored as a structured media asset containing both a unique public identifier and a public URL.
- **FR-004**: When an image is replaced or removed, the old image asset MUST be permanently deleted from media storage using its unique identifier. If deletion fails, the operation MUST abort and the admin MUST see an error so the CMS record and storage remain in sync.
- **FR-005**: The store owner MUST be able to manage social media links for Instagram, TikTok, Facebook, and WhatsApp.
- **FR-006**: Each social link MUST support an active/inactive state.
- **FR-007**: The store owner MUST be able to add, edit, reorder, activate, deactivate, and remove promotional reels, up to a maximum of 10 active reels.
- **FR-008**: Each reel MUST have an external video URL and an optional cover image stored as a structured media asset.
- **FR-009**: CMS sections, social links, and reels MUST each support an active/inactive state and a sort order.
- **FR-010**: The landing page MUST display only active CMS content in the defined sort order.
- **FR-011**: Content changes made in the admin dashboard MUST reflect on the storefront without requiring a code deployment.
- **FR-013**: When two admins edit the same CMS item concurrently, the most recent save MUST take precedence (last write wins); no merge conflict UI is required for the initial release.
- **FR-012**: Credentials used to delete media assets from storage MUST remain server-side only and MUST never be exposed to the browser.

### Key Entities *(include if feature involves data)*

- **CmsSection**: A landing page section keyed by name (e.g., hero, vision, about, footer). Stores independent Arabic and English content as a hybrid of structured fields (headline, subheading, CTA text) plus an optional rich body field, along with an ordered collection of media assets, active state, and sort order.
- **SocialLink**: A social media platform entry with a URL and active state.
- **Reel**: A promotional video entry with an external video URL, an optional cover media asset, sort order, and active state.
- **MediaAsset**: A stored image reference containing a unique public identifier and a public URL, used for sections and reel covers.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of landing page text is sourced from CMS sections rather than hardcoded in the storefront.
- **SC-002**: Content changes made in the admin dashboard appear on the storefront within 10 seconds without a code deployment.
- **SC-003**: 100% of uploaded images are stored as structured media assets (identifier + URL); no bare image URLs are persisted.
- **SC-004**: Every image replacement or removal triggers permanent deletion of the old asset from media storage using its stored identifier.
- **SC-005**: Arabic and English content are independently editable and correctly displayed per active locale.
- **SC-006**: All active CMS sections, reels, and social links appear on the storefront in their defined order.
- **SC-007**: Inactive CMS sections, social links, and reels do not appear on the storefront.

## Assumptions

- Spec 1 (Brand Foundation) is complete before implementation, including locale switching and the RTL/LTR layout system.
- Admin authentication and role-based access control will be implemented in a later spec; for now, write operations are assumed to be invoked by an authenticated admin.
- A media storage service and the necessary credentials are available for image hosting and server-side deletion.
- Landing page layout, visual design, and component assembly are defined separately in Spec 4 (Landing Experience).
- The initial set of landing page sections is limited to hero, vision, about, and footer; additional sections may be added later using the same CMS structure.

## Clarifications

### Session 2026-06-19

- Q: How should the Arabic and English content of each CMS section be structured? → A: Hybrid: structured fields per section (headline, subheading, CTA text) plus an optional rich body field.
- Q: How should the system handle concurrent edits to the same CMS section, social link, or reel? → A: Last write wins; no merge conflict UI for the initial release.
- Q: If media deletion fails, should the database record still be removed? → A: No, abort the operation and show the admin an error to keep CMS and storage in sync.
- Q: What is the maximum number of images allowed per CMS section, and what is the maximum number of reels allowed? → A: 5 images per section, 10 reels total.
- Q: Should the CMS enforce required-field and length validation on section content? → A: Yes: headline and CTA are required with max lengths of 120 and 240 characters; subheading and rich body are optional.
