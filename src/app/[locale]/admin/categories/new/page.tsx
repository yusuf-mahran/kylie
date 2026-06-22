export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { Heading } from '@/components/shared/typography';
import CategoryForm from '@/components/admin/catalog/category-form';
import { createCategory } from '@/actions/catalog.actions';
import type { CategoryFormSchemaType } from '@/features/catalog/schemas';

export default async function NewCategoryPage() {
  const t = await getTranslations('Catalog');

  async function handleSave(data: CategoryFormSchemaType) {
    'use server';
    await createCategory(data);
    redirect('/admin/categories');
  }

  return (
    <SectionWrapper>
      <Heading as="h1" size="2xl">{t('newCategory')}</Heading>
      <div className="mt-6">
        <CategoryForm onSave={handleSave} />
      </div>
    </SectionWrapper>
  );
}
