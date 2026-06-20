'use server';

import { createServerClient } from '@/lib/supabase/server';
import { CmsRepository } from '@/repositories/cms.repository';
import { deleteCloudinaryAsset } from './cloudinary.actions';
import type { CmsSectionKey, SocialLink, Reel } from '@/features/brand/types';
import type { SectionFormData } from '@/features/brand/schemas';

export async function updateSection(key: CmsSectionKey, data: SectionFormData) {
  const supabase = createServerClient();
  const repo = new CmsRepository(supabase);
  await repo.updateSection(key, {
    content_ar: data.content_ar,
    content_en: data.content_en,
    is_active: data.is_active,
    sort_order: data.sort_order,
  });
}

export async function addSectionImage(key: CmsSectionKey, asset: { public_id: string; secure_url: string }) {
  const supabase = createServerClient();
  const repo = new CmsRepository(supabase);
  await repo.addSectionImage(key, asset);
}

export async function removeSectionImage(key: CmsSectionKey, publicId: string) {
  const result = await deleteCloudinaryAsset(publicId);
  if (!result.success) {
    throw new Error(result.error);
  }
  const supabase = createServerClient();
  const repo = new CmsRepository(supabase);
  await repo.removeSectionImage(key, publicId);
}

export async function getSocialLinks() {
  const supabase = createServerClient();
  const repo = new CmsRepository(supabase);
  return repo.getSocialLinks();
}

export async function updateSocialLink(id: string, data: Partial<SocialLink>) {
  const supabase = createServerClient();
  const repo = new CmsRepository(supabase);
  await repo.updateSocialLink(id, data);
}

export async function getReels() {
  const supabase = createServerClient();
  const repo = new CmsRepository(supabase);
  return repo.getReels();
}

export async function addReel(data: Omit<Reel, 'id'>) {
  const supabase = createServerClient();
  const repo = new CmsRepository(supabase);
  return repo.addReel(data);
}

export async function updateReel(id: string, data: Partial<Omit<Reel, 'id'>>) {
  const supabase = createServerClient();
  const repo = new CmsRepository(supabase);
  if ('cover_image' in data) {
    const existing = await repo.getReels();
    const reel = existing.find((r) => r.id === id);
    if (reel?.cover_image?.public_id) {
      await deleteCloudinaryAsset(reel.cover_image.public_id);
    }
  }
  await repo.updateReel(id, data);
}

export async function removeReel(id: string) {
  const supabase = createServerClient();
  const repo = new CmsRepository(supabase);
  const existing = await repo.getReels();
  const reel = existing.find((r) => r.id === id);
  if (reel?.cover_image?.public_id) {
    await deleteCloudinaryAsset(reel.cover_image.public_id);
  }
  await repo.removeReel(id);
}

export async function updateReelCover(id: string, asset: { public_id: string; secure_url: string }) {
  const supabase = createServerClient();
  const repo = new CmsRepository(supabase);
  const existing = await repo.getReels();
  const reel = existing.find((r) => r.id === id);
  if (reel?.cover_image?.public_id) {
    await deleteCloudinaryAsset(reel.cover_image.public_id);
  }
  await repo.updateReelCover(id, asset);
}
