# Data Model: CMS Content Management

## Entity: `CmsSection`

Landing page section keyed by a well-known name.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | uuid | Primary key | Internal identifier |
| `section_key` | text | Unique, not null | `hero`, `vision`, `about`, `footer` |
| `content_ar` | jsonb | Not null | Structured Arabic content: `{ headline?, subheading?, body?, cta? }` |
| `content_en` | jsonb | Not null | Structured English content: `{ headline?, subheading?, body?, cta? }` |
| `images` | jsonb[] | Default `[]` | Ordered array of `MediaAsset` objects; max 5 items |
| `is_active` | boolean | Default `true` | Controls storefront visibility |
| `sort_order` | int | Not null | Display order on landing page |
| `updated_at` | timestamptz | Auto-updated | Last modification timestamp |

**Validation rules**:
- `content_*.headline` is required, max 120 characters.
- `content_*.cta` is required, max 240 characters.
- `content_*.subheading` and `content_*.body` are optional.
- `images` array must not exceed 5 items.

---

## Entity: `SocialLink`

Social media link promoted on the landing page (typically footer).

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | uuid | Primary key | Internal identifier |
| `platform` | text | Unique, not null | `instagram`, `tiktok`, `facebook`, `whatsapp` |
| `url` | text | Not null | External profile/link URL |
| `is_active` | boolean | Default `true` | Controls storefront visibility |

**Validation rules**:
- `platform` must be one of the supported values.
- `url` must be a valid URL string; empty values hide the link.

---

## Entity: `Reel`

Promotional video reel shown in a slider on the landing page.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | uuid | Primary key | Internal identifier |
| `video_url` | text | Not null | External video URL (YouTube, TikTok, direct mp4) |
| `cover_image` | jsonb | Nullable | `MediaAsset` object |
| `sort_order` | int | Not null | Display order in reels slider |
| `is_active` | boolean | Default `true` | Controls storefront visibility |

**Validation rules**:
- `video_url` is required.
- `cover_image` is optional; when absent the storefront renders a fallback.
- Maximum 10 active reels enforced at application level.

---

## Value Object: `MediaAsset`

Stored image reference used by `CmsSection.images` and `Reel.cover_image`.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `public_id` | text | Not null | Cloudinary public ID, e.g., `kylie/cms/hero/abc123` |
| `secure_url` | text | Not null | Publicly accessible HTTPS URL |

**Validation rules**:
- Both fields are required; bare URLs are never persisted alone.
- `public_id` is used for server-side deletion when the asset is replaced or removed.

---

## Relationships

- A `CmsSection` owns zero to many `MediaAsset` items (embedded in `images` array).
- A `Reel` optionally references one `MediaAsset` (embedded in `cover_image`).
- `SocialLink` is independent; no foreign relationships.

## State Transitions

- `CmsSection.is_active`: `true` → `false` hides the section from the storefront; no other state machine.
- `SocialLink.is_active`: `true` → `false` hides the link.
- `Reel.is_active`: `true` → `false` hides the reel.
- Media asset deletion: when an image is replaced/removed, the old `public_id` is destroyed in Cloudinary before the database record is updated.
