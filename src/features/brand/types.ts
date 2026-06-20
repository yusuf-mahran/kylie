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
