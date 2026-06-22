'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { BrandBadge } from '@/components/shared/brand-badge';
import type { ProductWithRelations } from '@/features/catalog/types';
import {
  getProductName,
  getProductSummary,
  getPrimaryImage,
  isOnOffer,
  formatPrice,
} from '@/features/catalog/utils';

type ProductCardProps = {
  product: ProductWithRelations;
  locale: 'ar' | 'en';
};

export default function ProductCard({ product, locale }: ProductCardProps) {
  const t = useTranslations('Shop');
  const name = getProductName(product, locale);
  const summary = getProductSummary(product, locale);
  const primaryImage = getPrimaryImage(product.images);
  const onOffer = isOnOffer(product);

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-card hover:shadow-modal transition-shadow"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-sand">
        {primaryImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={primaryImage.image.secure_url}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/placeholder.svg"
            alt={name}
            className="object-cover w-full h-full"
          />
        )}
        {onOffer && (
          <div className="absolute top-2 start-2">
            <BrandBadge variant="offer">{t('offer')}</BrandBadge>
          </div>
        )}
        {product.is_best_seller && !onOffer && (
          <div className="absolute top-2 start-2">
            <BrandBadge variant="bestSeller">{t('bestSeller')}</BrandBadge>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-foreground line-clamp-1">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{summary}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-rose">{formatPrice(product.price, locale)} {t('currency')}</span>
          {onOffer && product.compare_price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compare_price, locale)} {t('currency')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
