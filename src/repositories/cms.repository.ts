import { createServerClient } from '@/lib/supabase/server';
import type {
  CmsSection,
  CmsSectionKey,
  SocialLink,
  Reel,
  MediaAsset,
} from '@/features/brand/types';
import type { LocaleContent } from '@/features/brand/types';

export class CmsRepository {
  private supabase: ReturnType<typeof createServerClient>;

  constructor(supabase: ReturnType<typeof createServerClient>) {
    this.supabase = supabase;
  }

  async getSectionByKey(key: CmsSectionKey): Promise<CmsSection> {
    const { data, error } = await this.supabase
      .from('cms_sections')
      .select('*')
      .eq('section_key', key)
      .single();
    if (error) throw error;
    return data as CmsSection;
  }

  async getAllSections(): Promise<CmsSection[]> {
    const { data, error } = await this.supabase
      .from('cms_sections')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data as CmsSection[];
  }

  async updateSection(
    key: CmsSectionKey,
    data: {
      content_ar?: LocaleContent;
      content_en?: LocaleContent;
      is_active?: boolean;
      sort_order?: number;
    }
  ): Promise<void> {
    const { error } = await this.supabase
      .from('cms_sections')
      .update(data)
      .eq('section_key', key);
    if (error) throw error;
  }

  async addSectionImage(key: CmsSectionKey, asset: MediaAsset): Promise<void> {
    const section = await this.getSectionByKey(key);
    if (section.images.length >= 5) {
      throw new Error(`Maximum 5 images allowed per section`);
    }
    const { error } = await this.supabase
      .from('cms_sections')
      .update({ images: [...section.images, asset] })
      .eq('section_key', key);
    if (error) throw error;
  }

  async removeSectionImage(key: CmsSectionKey, publicId: string): Promise<void> {
    const section = await this.getSectionByKey(key);
    const { error } = await this.supabase
      .from('cms_sections')
      .update({ images: section.images.filter((img) => img.public_id !== publicId) })
      .eq('section_key', key);
    if (error) throw error;
  }

  async getSocialLinks(): Promise<SocialLink[]> {
    const { data, error } = await this.supabase
      .from('cms_social_links')
      .select('*');
    if (error) throw error;
    return data as SocialLink[];
  }

  async updateSocialLink(id: string, data: Partial<SocialLink>): Promise<void> {
    const { error } = await this.supabase
      .from('cms_social_links')
      .update(data)
      .eq('id', id);
    if (error) throw error;
  }

  async getReels(): Promise<Reel[]> {
    const { data, error } = await this.supabase
      .from('cms_reels')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data as Reel[];
  }

  async addReel(data: Omit<Reel, 'id'>): Promise<Reel> {
    const { count, error: countError } = await this.supabase
      .from('cms_reels')
      .select('*', { count: 'exact', head: true });
    if (countError) throw countError;
    if ((count ?? 0) >= 10) {
      throw new Error('Maximum 10 reels allowed');
    }
    const { data: newReel, error } = await this.supabase
      .from('cms_reels')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return newReel as Reel;
  }

  async updateReel(id: string, data: Partial<Omit<Reel, 'id'>>): Promise<void> {
    const { error } = await this.supabase
      .from('cms_reels')
      .update(data)
      .eq('id', id);
    if (error) throw error;
  }

  async removeReel(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('cms_reels')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  async updateReelCover(id: string, asset: MediaAsset): Promise<void> {
    const { error } = await this.supabase
      .from('cms_reels')
      .update({ cover_image: asset })
      .eq('id', id);
    if (error) throw error;
  }
}
