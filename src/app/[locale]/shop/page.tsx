export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { CategoryRepository } from '@/repositories/category.repository';
import { ProductRepository } from '@/repositories/product.repository';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { Heading, BodyText } from '@/components/shared/typography';
import ProductGrid from '@/components/shop/product-grid';
import CategoryFilter from '@/components/shop/category-filter';
import SearchInput from '@/components/shop/search-input';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; subcategory?: string; q?: string }>;
};

export default async function ShopPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category: categorySlug, subcategory: subcategorySlug, q: query } = await searchParams;
  const t = await getTranslations('Shop');

  const supabase = createServerClient();
  const categoryRepo = new CategoryRepository(supabase);
  const productRepo = new ProductRepository(supabase);

  const categories = await categoryRepo.getActiveCategoriesWithSubcategories();

  async function handleSearch(searchQuery: string) {
    'use server';
    if (searchQuery.trim().length === 0) {
      redirect('/shop');
    }
    redirect(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
  }

  let result;
  if (query && query.trim().length > 0) {
    result = await productRepo.searchProducts(query.trim(), { pageSize: 24 });
  } else {
    result = await productRepo.getProducts({
      categorySlug,
      subcategorySlug,
      status: 'active',
      pageSize: 24,
    });
  }

  return (
    <SectionWrapper>
      <Heading as="h1" size="3xl">{t('shop')}</Heading>

      <div className="mt-6">
        <SearchInput key={query ?? ''} initialQuery={query} onSearch={handleSearch} />
      </div>

      {!query && (
        <div className="mt-6">
          <CategoryFilter
            categories={categories}
            selectedCategorySlug={categorySlug}
            selectedSubcategorySlug={subcategorySlug}
            locale={locale as 'ar' | 'en'}
          />
        </div>
      )}

      {query && (
        <BodyText size="lg" className="mt-6">
          {t('searchResultsFor', { query })}
        </BodyText>
      )}

      <div className="mt-6">
        {result.data.length === 0 ? (
          <BodyText>{t('noResults')}</BodyText>
        ) : (
          <ProductGrid products={result.data} locale={locale as 'ar' | 'en'} />
        )}
      </div>
    </SectionWrapper>
  );
}
