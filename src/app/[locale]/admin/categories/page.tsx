export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import { createServerClient } from '@/lib/supabase/server';
import { CategoryRepository } from '@/repositories/category.repository';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { Heading, BodyText } from '@/components/shared/typography';
import { Link } from '@/i18n/navigation';

export default async function CategoriesAdminPage() {
  const t = await getTranslations('Catalog');
  let categories: Awaited<ReturnType<CategoryRepository['getCategoriesWithSubcategories']>> = [];
  try {
    const supabase = createServerClient();
    const repo = new CategoryRepository(supabase);
    categories = await repo.getCategoriesWithSubcategories();
  } catch {
    // Fall through to empty state
  }

  return (
    <SectionWrapper>
      <div className="flex items-center justify-between">
        <Heading as="h1" size="2xl">{t('categories')}</Heading>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-rose text-cream px-4 py-2"
        >
          {t('newCategory')}
        </Link>
      </div>

      {categories.length === 0 ? (
        <BodyText className="mt-6">{t('noCategories')}</BodyText>
      ) : (
        <div className="flex flex-col gap-3 mt-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/admin/categories/${category.id}`}
              className="border rounded-md p-4 hover:bg-sand transition-colors"
            >
              <div className="flex items-center justify-between">
                <span>{category.name_ar} / {category.name_en}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${category.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {category.is_active ? t('active') : t('inactive')}
                </span>
              </div>
              {category.subcategories.length > 0 && (
                <p className="text-sm opacity-70 mt-2">
                  {category.subcategories.map((s) => s.name_ar).join('، ')}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}
