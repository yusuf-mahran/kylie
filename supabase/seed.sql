-- ============================================================
-- Seed data for CMS tables
-- ============================================================

-- Pages
insert into pages (slug, title, meta) values
  ('home', 'Home', '{"seo_title": "Home", "seo_description": "Welcome to our website"}'),
  ('about', 'About', '{"seo_title": "About Us", "seo_description": "Learn more about us"}'),
  ('contact', 'Contact', '{"seo_title": "Contact", "seo_description": "Get in touch"}');

-- Sections
insert into sections (key, type, content) values
  ('home-hero', 'hero', '{"headline": "Welcome", "subheadline": "We build amazing things", "cta_text": "Get Started", "cta_link": "/contact"}'),
  ('about-story', 'about_story', '{"title": "Our Story", "body": "Founded with passion and dedication."}'),
  ('contact-details', 'contact_details', '{"email": "hello@example.com", "phone": "+1 (555) 123-4567", "address": "123 Main St, City, Country"}'),
  ('footer-main', 'footer', '{"copyright": "© 2026 Your Company. All rights reserved."}');

-- Page Sections (which sections appear on which pages)
insert into page_sections (page_id, section_id, sort_order, is_visible) values
  ((select id from pages where slug = 'home'),    (select id from sections where key = 'home-hero'),       0, true),
  ((select id from pages where slug = 'home'),    (select id from sections where key = 'footer-main'),     99, true),
  ((select id from pages where slug = 'about'),   (select id from sections where key = 'about-story'),     0, true),
  ((select id from pages where slug = 'about'),   (select id from sections where key = 'footer-main'),     99, true),
  ((select id from pages where slug = 'contact'), (select id from sections where key = 'contact-details'), 0, true),
  ((select id from pages where slug = 'contact'), (select id from sections where key = 'footer-main'),     99, true);

-- Site Settings
insert into site_settings (key, value) values
  ('logo', '{"url": "/logo.svg", "alt": "Logo"}'),
  ('social_links', '{"facebook": "https://facebook.com", "twitter": "https://twitter.com", "instagram": "https://instagram.com"}'),
  ('nav_menu', '{"items": [{"label": "Home", "href": "/"}, {"label": "About", "href": "/about"}, {"label": "Contact", "href": "/contact"}]}'),
  ('contact_info', '{"email": "hello@example.com", "phone": "+1 (555) 123-4567"}');
