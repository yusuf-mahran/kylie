export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { CategoryRepository } from '@/repositories/category.repository';
import { ProductRepository } from '@/repositories/product.repository';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { Heading, BodyText } from '@/components/shared/typography';
import ProductForm from '@/components/admin/catalog/product-form';
import { updateProduct, deleteProduct } from '@/actions/catalog.actions';
import type { ProductFormSchemaType } from '@/features/catalog/schemas';

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations('Catalog');

  const supabase = createServerClient();
  const categoryRepo = new CategoryRepository(supabase);
  const productRepo = new ProductRepository(supabase);

  const [categories, product] = await Promise.all([
    categoryRepo.getCategoriesWithSubcategories(),
    productRepo.getProductById(id),
  ]);

  if (!product) {
    notFound();
  }

  async function handleSave(data: ProductFormSchemaType) {
    'use server';
    await updateProduct(id, data);
    redirect('/admin/products');
  }

  async function handleDelete() {
    'use server';
    await deleteProduct(id);
    redirect('/admin/products');
  }

  return (
    <SectionWrapper>
      <Heading as="h1" size="2xl">{t('editProduct')}</Heading>
      <BodyText size="lg" muted className="mt-2">
        {product.name_ar} / {product.name_en}
      </BodyText>
      <div className="mt-6">
        <ProductForm product={product} categories={categories} onSave={handleSave} onDelete={handleDelete} />
      </div>
    </SectionWrapper>
  );
}
