import type { Product, ProductImage, Category, Subcategory, ProductAccordionSection } from './types';

export function isOnOffer(product: Pick<Product, 'price' | 'compare_price'>): boolean {
  return product.compare_price != null && product.compare_price > product.price;
}

export function formatPrice(price: number, locale: 'ar' | 'en' = 'ar'): string {
  const formatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(price);
}

export function calculateDiscountPercent(
  product: Pick<Product, 'price' | 'compare_price'>
): number | null {
  if (!isOnOffer(product)) return null;
  const discount = ((product.compare_price! - product.price) / product.compare_price!) * 100;
  return Math.round(discount);
}

export function isFeaturedProduct(product: Pick<Product, 'is_featured'>): boolean {
  return product.is_featured;
}

export function isBestSellerProduct(product: Pick<Product, 'is_best_seller'>): boolean {
  return product.is_best_seller;
}

export function getPrimaryImage(images: ProductImage[]): ProductImage | null {
  if (images.length === 0) return null;
  const primary = images.find((img) => img.is_primary);
  return primary ?? images.sort((a, b) => a.sort_order - b.sort_order)[0];
}

export function getProductName(product: Product, locale: 'ar' | 'en'): string {
  return locale === 'en' && product.name_en ? product.name_en : product.name_ar;
}

export function getProductSummary(product: Product, locale: 'ar' | 'en'): string {
  return locale === 'en' && product.summary_en ? product.summary_en : product.summary_ar;
}

export function getCategoryName(category: Category, locale: 'ar' | 'en'): string {
  return locale === 'en' && category.name_en ? category.name_en : category.name_ar;
}

export function getSubcategoryName(subcategory: Subcategory, locale: 'ar' | 'en'): string {
  return locale === 'en' && subcategory.name_en ? subcategory.name_en : subcategory.name_ar;
}

export function getAccordionHeading(section: ProductAccordionSection, locale: 'ar' | 'en'): string {
  return locale === 'en' && section.heading_en ? section.heading_en : section.heading_ar;
}

export function getAccordionDescription(
  section: ProductAccordionSection,
  locale: 'ar' | 'en'
): string {
  return locale === 'en' && section.description_en ? section.description_en : section.description_ar;
}

export function getPlaceholderUrl(): string {
  return '/placeholder.svg';
}

