import type { ProductWithRelations } from '@/features/catalog/types';
import ProductCard from './product-card';

type ProductGridProps = {
  products: ProductWithRelations[];
  locale: 'ar' | 'en';
};

export default function ProductGrid({ products, locale }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  );
}
