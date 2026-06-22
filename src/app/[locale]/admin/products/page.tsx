export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import { createServerClient } from '@/lib/supabase/server';
import { ProductRepository } from '@/repositories/product.repository';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { Heading, BodyText } from '@/components/shared/typography';
import { Link } from '@/i18n/navigation';

export default async function ProductsAdminPage() {
  const t = await getTranslations('Catalog');
  let result: Awaited<ReturnType<ProductRepository['getProducts']>> = {
    data: [],
    total: 0,
    page: 1,
    pageSize: 24,
  };
  try {
    const supabase = createServerClient();
    const repo = new ProductRepository(supabase);
    result = await repo.getProducts({ pageSize: 100 });
  } catch {
    // Fall through to empty state
  }

  return (
    <SectionWrapper>
      <div className="flex items-center justify-between">
        <Heading as="h1" size="2xl">
          {t('products')}
        </Heading>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-rose text-cream px-4 py-2"
        >
          {t('newProduct')}
        </Link>
      </div>

      {result.data.length === 0 ? (
        <BodyText className="mt-6">{t('noProducts')}</BodyText>
      ) : (
        <div className="flex flex-col gap-3 mt-6">
          {result.data.map((product) => (
            <Link
              key={product.id}
              href={`/admin/products/${product.id}`}
              className="border rounded-md p-4 hover:bg-sand transition-colors"
            >
              <div className="flex items-center justify-between">
                <span>
                  {product.name_ar} / {product.name_en}
                </span>
                <span className="text-sm">
                  {product.price} {t('price')}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  {t(product.status)}
                </span>
                <span className="text-xs opacity-70">
                  {product.category.name_ar}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}
