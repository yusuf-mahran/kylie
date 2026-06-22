export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { ProductRepository } from '@/repositories/product.repository';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { Heading, BodyText } from '@/components/shared/typography';
import { Link } from '@/i18n/navigation';
import { BrandBadge } from '@/components/shared/brand-badge';
import {
  getProductName,
  getProductSummary,
  getPrimaryImage,
  isOnOffer,
  formatPrice,
  getAccordionHeading,
  getAccordionDescription,
} from '@/features/catalog/utils';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations('Shop');

  const supabase = createServerClient();
  const repo = new ProductRepository(supabase);
  const product = await repo.getProductBySlug(slug);

  if (!product || product.status !== 'active' || !product.category.is_active) {
    notFound();
  }

  const name = getProductName(product, locale as 'ar' | 'en');
  const summary = getProductSummary(product, locale as 'ar' | 'en');
  const primaryImage = getPrimaryImage(product.images);
  const onOffer = isOnOffer(product);

  return (
    <SectionWrapper>
      <Link href="/shop" className="text-sm underline mb-4 inline-block">
        {t('backToShop')}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square overflow-hidden rounded-xl bg-sand">
          {primaryImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryImage.image.secure_url}
              alt={name}
              className="object-cover w-full h-full"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/placeholder.svg" alt={name} className="object-cover w-full h-full" />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Heading as="h1" size="3xl">
            {name}
          </Heading>
          <BodyText size="lg" muted>
            {summary}
          </BodyText>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-rose">
              {formatPrice(product.price, locale as 'ar' | 'en')} {t('currency')}
            </span>
            {onOffer && product.compare_price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compare_price, locale as 'ar' | 'en')} {t('currency')}
              </span>
            )}
            {onOffer && <BrandBadge variant="offer">{t('offer')}</BrandBadge>}
          </div>

          {product.accordion_sections.length > 0 && (
            <div className="flex flex-col gap-3 mt-4">
              {product.accordion_sections.map((section) => (
                <div key={section.id} className="border rounded-md p-4">
                  <h3 className="font-bold">
                    {getAccordionHeading(section, locale as 'ar' | 'en')}
                  </h3>
                  <BodyText className="mt-2">
                    {getAccordionDescription(section, locale as 'ar' | 'en')}
                  </BodyText>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
