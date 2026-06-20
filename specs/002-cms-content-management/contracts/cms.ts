/**
 * CMS Contracts
 *
 * TypeScript interfaces and repository contract for the CMS Content Management feature.
 * These contracts define the public surface of the CMS domain and are consumed by
 * admin dashboard pages and storefront landing sections.
 */

export type LocaleContent = {
  headline?: string;
  subheading?: string;
  body?: string;
  cta?: string;
};

export type MediaAsset = {
  public_id: string;
  secure_url: string;
};

export type CmsSectionKey = 'hero' | 'vision' | 'about' | 'footer';

export type CmsSection = {
  id: string;
  section_key: CmsSectionKey;
  content_ar: LocaleContent;
  content_en: LocaleContent;
  images: MediaAsset[];
  is_active: boolean;
  sort_order: number;
  updated_at: string;
};

export type SocialPlatform = 'instagram' | 'tiktok' | 'facebook' | 'whatsapp';

export type SocialLink = {
  id: string;
  platform: SocialPlatform;
  url: string;
  is_active: boolean;
};

export type Reel = {
  id: string;
  video_url: string;
  cover_image: MediaAsset | null;
  sort_order: number;
  is_active: boolean;
};

export type CmsRepositoryContract = {
  // Sections
  getSectionByKey(key: CmsSectionKey): Promise<CmsSection>;
  getAllSections(): Promise<CmsSection[]>;
  updateSection(
    key: CmsSectionKey,
    data: {
      content_ar?: LocaleContent;
      content_en?: LocaleContent;
      images?: MediaAsset[];
      is_active?: boolean;
      sort_order?: number;
    }
  ): Promise<void>;
  addSectionImage(key: CmsSectionKey, asset: MediaAsset): Promise<void>;
  removeSectionImage(key: CmsSectionKey, publicId: string): Promise<void>;

  // Social links
  getSocialLinks(): Promise<SocialLink[]>;
  updateSocialLink(id: string, data: Partial<SocialLink>): Promise<void>;

  // Reels
  getReels(): Promise<Reel[]>;
  addReel(data: Omit<Reel, 'id'>): Promise<Reel>;
  updateReel(id: string, data: Partial<Omit<Reel, 'id'>>): Promise<void>;
  removeReel(id: string): Promise<void>;
  updateReelCover(id: string, asset: MediaAsset): Promise<void>;
};

export type CloudinaryActionsContract = {
  deleteCloudinaryAsset(publicId: string): Promise<void>;
};
