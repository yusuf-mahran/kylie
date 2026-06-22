export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Heading, BodyText, Caption } from '@/components/shared/typography';
import { BrandButton } from '@/components/shared/brand-button';
import { BrandBadge } from '@/components/shared/brand-badge';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { createServerClient } from '@/lib/supabase/server';
import { CmsRepository } from '@/repositories/cms.repository';
import {
  getFeaturedProducts,
  getBestSellers,
} from '@/features/catalog/server-utils';
import ProductGrid from '@/components/shop/product-grid';

type Props = {
  params: Promise<{ locale: string }>;
};

async function getCmsData() {
  try {
    const supabase = createServerClient();
    const repo = new CmsRepository(supabase);
    const [sections, socialLinks, reels, featured, bestSellers] =
      await Promise.all([
        repo.getAllSections(),
        repo.getSocialLinks(),
        repo.getReels(),
        getFeaturedProducts(4).catch(() => []),
        getBestSellers(4).catch(() => []),
      ]);
    return { sections, socialLinks, reels, featured, bestSellers };
  } catch {
    return {
      sections: [],
      socialLinks: [],
      reels: [],
      featured: [],
      bestSellers: [],
    };
  }
}

export default async function HomePage({ params }: Props) {
  const { locale: currentLocale } = await params;
  const t = await getTranslations();
  const { sections, socialLinks, reels, featured, bestSellers } =
    await getCmsData();

  const hero = sections.find((s) => s.section_key === 'hero' && s.is_active);
  const heroContent = hero
    ? currentLocale === 'ar'
      ? hero.content_ar
      : hero.content_en
    : null;
  const fallbackContent = hero?.content_ar;
  const displayContent = heroContent?.headline ? heroContent : fallbackContent;

  return (
    <SectionWrapper>
      {displayContent && (
        <div className="flex flex-col items-center gap-4 text-center mb-12">
          {displayContent.headline && (
            <Heading as="h1" size="4xl">
              {displayContent.headline}
            </Heading>
          )}
          {displayContent.subheading && (
            <BodyText size="lg" muted>
              {displayContent.subheading}
            </BodyText>
          )}
          {displayContent.body && <BodyText>{displayContent.body}</BodyText>}
          {displayContent.cta && (
            <BrandButton asChild>
              <Link href="/shop">{displayContent.cta}</Link>
            </BrandButton>
          )}
        </div>
      )}

      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <BrandBadge variant="new">{t('Badges.new')}</BrandBadge>
          <BrandBadge variant="offer">{t('Badges.offer')}</BrandBadge>
          <BrandBadge variant="bestSeller">{t('Badges.bestSeller')}</BrandBadge>
        </div>

        <Heading as="h1" size="4xl">
          {t('HomePage.title')}
        </Heading>

        <BodyText size="lg" muted>
          {t('HomePage.description')}
        </BodyText>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <BrandButton asChild>
            <Link href="/shop">{t('HomePage.cta')}</Link>
          </BrandButton>
          <BrandButton variant="secondary">{t('HomePage.cta')}</BrandButton>
          <BrandButton variant="ghost">{t('HomePage.cta')}</BrandButton>
        </div>

        <Caption muted>{t('HomePage.subtitle')}</Caption>
      </div>

      {socialLinks.filter((l) => l.is_active).length > 0 && (
        <div className="flex justify-center gap-4 mt-8 pt-8 border-t">
          {socialLinks
            .filter((l) => l.is_active && l.url)
            .map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline"
              >
                {link.platform}
              </a>
            ))}
        </div>
      )}

      {featured.length > 0 && (
        <div className="mt-12 pt-8 border-t">
          <Heading as="h2" size="2xl" className="mb-6">
            {t('Badges.bestSeller')}
          </Heading>
          <ProductGrid
            products={featured}
            locale={currentLocale as 'ar' | 'en'}
          />
        </div>
      )}

      {bestSellers.length > 0 && (
        <div className="mt-12 pt-8 border-t">
          <Heading as="h2" size="2xl" className="mb-6">
            {t('Badges.bestSeller')}
          </Heading>
          <ProductGrid
            products={bestSellers}
            locale={currentLocale as 'ar' | 'en'}
          />
        </div>
      )}

      {reels.filter((r) => r.is_active).length > 0 && (
        <div className="flex gap-4 overflow-x-auto mt-8 pt-8 border-t">
          {reels
            .filter((r) => r.is_active)
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((reel) => (
              <a
                key={reel.id}
                href={reel.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-40 h-60 bg-sand rounded-md overflow-hidden relative"
              >
                {reel.cover_image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={reel.cover_image.secure_url}
                    alt="Reel cover"
                    className="object-cover w-full h-full"
                  />
                )}
              </a>
            ))}
        </div>
      )}
    </SectionWrapper>
  );
}
