-- ============================================================
-- Migration: Create CMS tables (pages, sections, page_sections, site_settings)
-- ============================================================
-- Ensure pgcrypto is available for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ============================================================
-- 1. Pages
-- ============================================================
create table pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  -- 'home', 'about', 'contact'
  title text not null,
  meta jsonb default '{}',
  -- seo title/description/og image
  created_at timestamptz default now()
);

-- ============================================================
-- 2. Sections (reusable content instances)
-- ============================================================
create table sections (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  -- 'home-hero', 'footer-main', 'contact-info'
  type text not null,
  -- 'hero' | 'about_story' | 'contact_details' | 'footer' | ...
  content jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- ============================================================
-- 3. Join table — controls WHICH sections appear on WHICH pages, and order
-- ============================================================
create table page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references pages(id) on delete cascade,
  section_id uuid references sections(id) on delete cascade,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  unique (page_id, section_id)
);

-- ============================================================
-- 4. Global site data (key-value, extensible, no migrations needed for new keys)
-- ============================================================
create table site_settings (
  key text primary key,
  -- 'logo', 'social_links', 'nav_menu', 'contact_info'
  value jsonb not null,
  updated_at timestamptz default now()
);

-- ============================================================
-- Indexes
-- ============================================================
create index idx_page_sections_page_id on page_sections(page_id);

create index idx_page_sections_section_id on page_sections(section_id);

create index idx_page_sections_visible on page_sections(page_id, is_visible, sort_order);

-- ============================================================
-- Updated_at trigger (reusable)
-- ============================================================
create or replace function update_updated_at()
returns trigger as $fn$
begin
  new.updated_at = now();
  return new;
end;
$fn$ language 'plpgsql';

create trigger trg_update_sections_updated_at before update on sections for each row execute function update_updated_at();

create trigger trg_update_site_settings_updated_at before update on site_settings for each row execute function update_updated_at();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
-- Pattern:
--   anon          → can SELECT (public read access for the frontend)
--   authenticated → can INSERT / UPDATE / DELETE (admin management)
-- --- pages ---
alter table pages enable row level security;

create policy "anon can read pages" on pages for select using (true);

create policy "authenticated can insert pages" on pages for insert with check (auth.uid() is not null);

create policy "authenticated can update pages" on pages for update using (auth.uid() is not null);

create policy "authenticated can delete pages" on pages for delete using (auth.uid() is not null);

-- --- sections ---
alter table sections enable row level security;

create policy "anon can read sections" on sections for select using (true);

create policy "authenticated can insert sections" on sections for insert with check (auth.uid() is not null);

create policy "authenticated can update sections" on sections for update using (auth.uid() is not null);

create policy "authenticated can delete sections" on sections for delete using (auth.uid() is not null);

-- --- page_sections ---
alter table page_sections enable row level security;

create policy "anon can read page_sections" on page_sections for select using (true);

create policy "authenticated can insert page_sections" on page_sections for insert with check (auth.uid() is not null);

create policy "authenticated can update page_sections" on page_sections for update using (auth.uid() is not null);

create policy "authenticated can delete page_sections" on page_sections for delete using (auth.uid() is not null);

-- --- site_settings ---
alter table site_settings enable row level security;

create policy "anon can read site_settings" on site_settings for select using (true);

create policy "authenticated can insert site_settings" on site_settings for insert with check (auth.uid() is not null);

create policy "authenticated can update site_settings" on site_settings for update using (auth.uid() is not null);

create policy "authenticated can delete site_settings" on site_settings for delete using (auth.uid() is not null);