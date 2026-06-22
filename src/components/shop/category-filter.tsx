'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { CategoryWithSubcategories } from '@/features/catalog/types';
import { getCategoryName, getSubcategoryName } from '@/features/catalog/utils';

type CategoryFilterProps = {
  categories: CategoryWithSubcategories[];
  selectedCategorySlug?: string;
  selectedSubcategorySlug?: string;
  locale: 'ar' | 'en';
};

export default function CategoryFilter({
  categories,
  selectedCategorySlug,
  selectedSubcategorySlug,
  locale,
}: CategoryFilterProps) {
  const t = useTranslations('Shop');
  const selectedCategory = categories.find((c) => c.slug === selectedCategorySlug);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="font-bold mb-2">{t('categories')}</h3>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/shop"
            className={`px-3 py-1 rounded-full text-sm border ${
              !selectedCategorySlug ? 'bg-rose text-cream border-rose' : 'bg-transparent border-border'
            }`}
          >
            {t('allCategories')}
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className={`px-3 py-1 rounded-full text-sm border ${
                selectedCategorySlug === category.slug
                  ? 'bg-rose text-cream border-rose'
                  : 'bg-transparent border-border'
              }`}
            >
              {getCategoryName(category, locale)}
            </Link>
          ))}
        </div>
      </div>

      {selectedCategory && selectedCategory.subcategories.length > 0 && (
        <div>
          <h3 className="font-bold mb-2">{t('subcategories')}</h3>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/shop?category=${selectedCategory.slug}`}
              className={`px-3 py-1 rounded-full text-sm border ${
                !selectedSubcategorySlug ? 'bg-rose text-cream border-rose' : 'bg-transparent border-border'
              }`}
            >
              {t('allSubcategories')}
            </Link>
            {selectedCategory.subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/shop?category=${selectedCategory.slug}&subcategory=${sub.slug}`}
                className={`px-3 py-1 rounded-full text-sm border ${
                  selectedSubcategorySlug === sub.slug
                    ? 'bg-rose text-cream border-rose'
                    : 'bg-transparent border-border'
                }`}
              >
                {getSubcategoryName(sub, locale)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
