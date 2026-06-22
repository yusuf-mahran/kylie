'use client';

import { useMemo, useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import {
  ProductFormSchema,
  type ProductFormSchemaType,
} from '@/features/catalog/schemas';
import type {
  ProductWithRelations,
  CategoryWithSubcategories,
} from '@/features/catalog/types';
import { BrandButton } from '@/components/shared/brand-button';
import ProductImageUploadField from './image-upload-field';
import AccordionSectionsField from './accordion-sections-field';
import AiEnhanceButton from './ai-enhance-button';

type ProductFormProps = {
  product?: ProductWithRelations | null;
  categories: CategoryWithSubcategories[];
  onSave: (data: ProductFormSchemaType) => Promise<void>;
  onDelete?: () => Promise<void>;
};

export default function ProductForm({
  product,
  categories,
  onSave,
  onDelete,
}: ProductFormProps) {
  const t = useTranslations('Catalog');
  const [saveError, setSaveError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormSchemaType>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: product
      ? {
          slug: product.slug,
          category_id: product.category_id,
          subcategory_id: product.subcategory_id,
          name_ar: product.name_ar,
          name_en: product.name_en,
          summary_ar: product.summary_ar,
          summary_en: product.summary_en,
          price: product.price,
          compare_price: product.compare_price,
          stock_count: product.stock_count,
          is_featured: product.is_featured,
          is_best_seller: product.is_best_seller,
          status: product.status,
          images: product.images.map((img) => ({
            id: img.id,
            image: img.image,
            sort_order: img.sort_order,
            is_primary: img.is_primary,
          })),
          accordion_sections: product.accordion_sections.map((sec) => ({
            id: sec.id,
            heading_ar: sec.heading_ar,
            heading_en: sec.heading_en,
            description_ar: sec.description_ar,
            description_en: sec.description_en,
            sort_order: sec.sort_order,
          })),
        }
      : {
          slug: '',
          category_id: '',
          subcategory_id: null,
          name_ar: '',
          name_en: '',
          summary_ar: '',
          summary_en: '',
          price: 0,
          compare_price: null,
          stock_count: 0,
          is_featured: false,
          is_best_seller: false,
          status: 'draft',
          images: [],
          accordion_sections: [],
        },
  });

  const categoryId = useWatch({ control, name: 'category_id' });
  const subcategories = useMemo(
    () => categories.find((c) => c.id === categoryId)?.subcategories ?? [],
    [categories, categoryId],
  );

  const selectedCategoryName = useMemo(
    () => categories.find((c) => c.id === categoryId)?.name_en ?? '',
    [categories, categoryId],
  );

  const watchedNameAr = useWatch({ control, name: 'name_ar' });
  const watchedNameEn = useWatch({ control, name: 'name_en' });
  const watchedSlug = useWatch({ control, name: 'slug' });
  const watchedSummaryAr = useWatch({ control, name: 'summary_ar' });
  const productContext = {
    name_ar: watchedNameAr,
    name_en: watchedNameEn,
    categoryName: selectedCategoryName,
  };

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        setSaveError(null);
        try {
          await onSave(data);
        } catch (err) {
          const message =
            err instanceof Error ? err.message : t('genericError');
          setSaveError(message);
        }
      })}
      className="flex flex-col gap-6 max-w-4xl"
    >
      {saveError && (
        <div className="bg-rose/10 text-rose p-3 rounded-md text-sm">
          {saveError}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">{t('name_ar')}</label>
          <input
            {...register('name_ar')}
            className="w-full border rounded px-3 py-2"
            dir="rtl"
          />
          {errors.name_ar && (
            <p className="text-rose text-sm">{errors.name_ar.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">{t('name_en')}</label>
          <input
            {...register('name_en')}
            className="w-full border rounded px-3 py-2"
            dir="ltr"
          />
          {errors.name_en && (
            <p className="text-rose text-sm">{errors.name_en.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium">{t('slug')}</label>
          <input
            {...register('slug')}
            className="w-full border rounded px-3 py-2"
            dir="ltr"
          />
          {errors.slug && (
            <p className="text-rose text-sm">{errors.slug.message}</p>
          )}
        </div>
        <div className="pt-6">
          <AiEnhanceButton
            type="slug"
            currentValue={watchedSlug}
            productContext={productContext}
            onSuggestion={(result) => {
              if (result.slug)
                setValue('slug', result.slug, { shouldValidate: true });
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">
              {t('summary_ar')}
            </label>
            <AiEnhanceButton
              type="summary"
              currentValue={watchedSummaryAr}
              productContext={productContext}
              onSuggestion={(result) => {
                setValue('summary_ar', result.ar, { shouldValidate: true });
                setValue('summary_en', result.en, { shouldValidate: true });
              }}
            />
          </div>
          <input
            {...register('summary_ar')}
            className="w-full border rounded px-3 py-2"
            dir="rtl"
          />
          {errors.summary_ar && (
            <p className="text-rose text-sm">{errors.summary_ar.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">{t('summary_en')}</label>
          <input
            {...register('summary_en')}
            className="w-full border rounded px-3 py-2"
            dir="ltr"
          />
          {errors.summary_en && (
            <p className="text-rose text-sm">{errors.summary_en.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">{t('price')}</label>
          <input
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.price && (
            <p className="text-rose text-sm">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">
            {t('comparePrice')}
          </label>
          <input
            type="number"
            step="0.01"
            {...register('compare_price', { valueAsNumber: true })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.compare_price && (
            <p className="text-rose text-sm">{errors.compare_price.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">{t('stock')}</label>
          <input
            type="number"
            {...register('stock_count', { valueAsNumber: true })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">{t('category')}</label>
          <select
            {...register('category_id')}
            className="w-full border rounded px-3 py-2"
            onChange={(e) => {
              register('category_id').onChange(e);
              setValue('subcategory_id', null);
            }}
          >
            <option value="">{t('selectCategory')}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name_ar} / {cat.name_en}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="text-rose text-sm">{errors.category_id.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">
            {t('subcategoryOptional')}
          </label>
          <Controller
            name="subcategory_id"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value || null)}
                className="w-full border rounded px-3 py-2"
                disabled={!categoryId}
              >
                <option value="">{t('selectSubcategory')}</option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name_ar} / {sub.name_en}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">{t('status')}</label>
        <select
          {...register('status')}
          className="w-full border rounded px-3 py-2"
        >
          <option value="draft">{t('draft')}</option>
          <option value="active">{t('active')}</option>
          <option value="archived">{t('archived')}</option>
        </select>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('is_featured')} />
          <span className="text-sm font-medium">{t('featured')}</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('is_best_seller')} />
          <span className="text-sm font-medium">{t('bestSeller')}</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{t('images')}</label>
        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <ProductImageUploadField
              images={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.images && (
          <p className="text-rose text-sm">{errors.images.message}</p>
        )}
      </div>

      <div>
        <Controller
          name="accordion_sections"
          control={control}
          render={({ field }) => (
            <AccordionSectionsField
              sections={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="flex gap-3">
        <BrandButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('saving') : t('save')}
        </BrandButton>
        {onDelete && (
          <BrandButton
            type="button"
            variant="secondary"
            onClick={async () => {
              setSaveError(null);
              try {
                await onDelete();
              } catch (err) {
                const message =
                  err instanceof Error ? err.message : t('genericError');
                setSaveError(message);
              }
            }}
          >
            {t('delete')}
          </BrandButton>
        )}
      </div>
    </form>
  );
}
