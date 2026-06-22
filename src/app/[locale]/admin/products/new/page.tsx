export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { CategoryRepository } from '@/repositories/category.repository';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { Heading } from '@/components/shared/typography';
import ProductForm from '@/components/admin/catalog/product-form';
import { createProduct } from '@/actions/catalog.actions';
import type { ProductFormSchemaType } from '@/features/catalog/schemas';

export default async function NewProductPage() {
  const t = await getTranslations('Catalog');

  const supabase = createServerClient();
  const categoryRepo = new CategoryRepository(supabase);
  const categories = await categoryRepo.getCategoriesWithSubcategories();

  async function handleSave(data: ProductFormSchemaType) {
    'use server';
    await createProduct(data);
    redirect('/admin/products');
  }

  return (
    <SectionWrapper>
      <Heading as="h1" size="2xl">{t('newProduct')}</Heading>
      <div className="mt-6">
        <ProductForm categories={categories} onSave={handleSave} />
      </div>
    </SectionWrapper>
  );
}
