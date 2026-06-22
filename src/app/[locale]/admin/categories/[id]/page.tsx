export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { CategoryRepository } from '@/repositories/category.repository';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { Heading, BodyText } from '@/components/shared/typography';
import CategoryForm from '@/components/admin/catalog/category-form';
import {
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from '@/actions/catalog.actions';
import type { CategoryFormSchemaType, SubcategoryFormSchemaType } from '@/features/catalog/schemas';
import type { Subcategory } from '@/features/catalog/types';

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations('Catalog');

  const supabase = createServerClient();
  const repo = new CategoryRepository(supabase);

  let category;
  let subcategories: Subcategory[] = [];
  try {
    category = await repo.getCategoryById(id);
    if (category) {
      subcategories = await repo.getSubcategories(id);
    }
  } catch {
    category = null;
  }

  if (!category) {
    notFound();
  }

  async function handleSave(data: CategoryFormSchemaType) {
    'use server';
    await updateCategory(id, data);
    redirect('/admin/categories');
  }

  async function handleDelete() {
    'use server';
    await deleteCategory(id);
    redirect('/admin/categories');
  }

  async function handleAddSubcategory(data: Omit<Subcategory, 'id' | 'created_at' | 'updated_at'>) {
    'use server';
    await createSubcategory(id, data as SubcategoryFormSchemaType);
  }

  async function handleUpdateSubcategory(subId: string, data: Partial<Omit<Subcategory, 'id' | 'created_at' | 'updated_at'>>) {
    'use server';
    await updateSubcategory(subId, data as Partial<SubcategoryFormSchemaType>);
  }

  async function handleDeleteSubcategory(subId: string) {
    'use server';
    await deleteSubcategory(subId);
  }

  return (
    <SectionWrapper>
      <Heading as="h1" size="2xl">{t('editCategory')}</Heading>
      <BodyText size="lg" muted className="mt-2">
        {category.name_ar} / {category.name_en}
      </BodyText>
      <div className="mt-6">
        <CategoryForm
          category={category}
          subcategories={subcategories}
          onSave={handleSave}
          onDelete={handleDelete}
          onAddSubcategory={handleAddSubcategory}
          onUpdateSubcategory={handleUpdateSubcategory}
          onDeleteSubcategory={handleDeleteSubcategory}
        />
      </div>
    </SectionWrapper>
  );
}
