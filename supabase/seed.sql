INSERT INTO cms_sections (section_key, content_ar, content_en, images, is_active, sort_order)
VALUES
  ('hero', '{"headline": "", "subheading": "", "body": "", "cta": ""}', '{"headline": "", "subheading": "", "body": "", "cta": ""}', '{}', true, 0),
  ('vision', '{"headline": "", "subheading": "", "body": "", "cta": ""}', '{"headline": "", "subheading": "", "body": "", "cta": ""}', '{}', true, 1),
  ('about', '{"headline": "", "subheading": "", "body": "", "cta": ""}', '{"headline": "", "subheading": "", "body": "", "cta": ""}', '{}', true, 2),
  ('footer', '{"headline": "", "subheading": "", "body": "", "cta": ""}', '{"headline": "", "subheading": "", "body": "", "cta": ""}', '{}', true, 3)
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO cms_social_links (platform, url, is_active)
VALUES
  ('instagram', '', false),
  ('tiktok', '', false),
  ('facebook', '', false),
  ('whatsapp', '', false)
ON CONFLICT (platform) DO NOTHING;
