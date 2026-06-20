CREATE TABLE IF NOT EXISTS cms_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  content_ar jsonb NOT NULL DEFAULT '{}',
  content_en jsonb NOT NULL DEFAULT '{}',
  images jsonb[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cms_social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text UNIQUE NOT NULL,
  url text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS cms_reels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_url text NOT NULL,
  cover_image jsonb DEFAULT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true
);
