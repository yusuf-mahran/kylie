'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { CategoryFormSchema, type CategoryFormSchemaType } from '@/features/catalog/schemas';
import type { Category, Subcategory, MediaAsset } from '@/features/catalog/types';
import { BrandButton } from '@/components/shared/brand-button';
import ImageUploadField from '@/components/admin/cms/image-upload-field';

type CategoryFormProps = {
  category?: Category | null;
  subcategories?: Subcategory[];
  onSave: (data: CategoryFormSchemaType) => Promise<void>;
  onDelete?: () => Promise<void>;
  onAddSubcategory?: (data: Omit<Subcategory, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdateSubcategory?: (id: string, data: Partial<Omit<Subcategory, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  onDeleteSubcategory?: (id: string) => Promise<void>;
};

export default function CategoryForm({
  category,
  subcategories = [],
  onSave,
  onDelete,
  onAddSubcategory,
  onUpdateSubcategory,
  onDeleteSubcategory,
}: CategoryFormProps) {
  const t = useTranslations('Catalog');
  const [saveError, setSaveError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormSchemaType>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      slug: category?.slug ?? '',
      name_ar: category?.name_ar ?? '',
      name_en: category?.name_en ?? '',
      image: category?.image ?? null,
      sort_order: category?.sort_order ?? 0,
      is_active: category?.is_active ?? true,
    },
  });

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {saveError && (
        <div className="bg-rose/10 text-rose p-3 rounded-md text-sm">{saveError}</div>
      )}
      <form
        onSubmit={handleSubmit(async (data) => {
          setSaveError(null);
          try {
            await onSave(data);
          } catch (err) {
            const message = err instanceof Error ? err.message : t('genericError');
            setSaveError(message);
          }
        })}
        className="flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">{t('name_ar')}</label>
            <input
              {...register('name_ar')}
              className="w-full border rounded px-3 py-2"
              dir="rtl"
            />
            {errors.name_ar && <p className="text-rose text-sm">{errors.name_ar.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">{t('name_en')}</label>
            <input
              {...register('name_en')}
              className="w-full border rounded px-3 py-2"
              dir="ltr"
            />
            {errors.name_en && <p className="text-rose text-sm">{errors.name_en.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">{t('slug')}</label>
          <input
            {...register('slug')}
            className="w-full border rounded px-3 py-2"
            dir="ltr"
          />
          {errors.slug && <p className="text-rose text-sm">{errors.slug.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">{t('image')}</label>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <ImageUploadField
                currentImage={field.value ?? undefined}
                onUpload={async (asset) => field.onChange(asset as MediaAsset)}
                onRemove={field.value ? async () => field.onChange(null) : undefined}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">{t('sortOrder')}</label>
            <input
              type="number"
              {...register('sort_order', { valueAsNumber: true })}
              className="w-full border rounded px-3 py-2"
            />
            {errors.sort_order && <p className="text-rose text-sm">{errors.sort_order.message}</p>}
          </div>
          <label className="flex items-center gap-2 self-end">
            <input type="checkbox" {...register('is_active')} />
            <span className="text-sm font-medium">{t('isActive')}</span>
          </label>
        </div>

        <div className="flex gap-3">
          <BrandButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('saving') : t('save')}
          </BrandButton>
          {onDelete && (
            <BrandButton type="button" variant="secondary" onClick={onDelete}>
              {t('delete')}
            </BrandButton>
          )}
        </div>
      </form>

      {category && onAddSubcategory && (
        <SubcategorySection
          categoryId={category.id}
          subcategories={subcategories}
          onAdd={async (data) => {
            setSaveError(null);
            try {
              await onAddSubcategory(data);
            } catch (err) {
              const message = err instanceof Error ? err.message : t('genericError');
              setSaveError(message);
            }
          }}
          onUpdate={async (id, data) => {
            setSaveError(null);
            try {
              await onUpdateSubcategory?.(id, data);
            } catch (err) {
              const message = err instanceof Error ? err.message : t('genericError');
              setSaveError(message);
            }
          }}
          onDelete={async (id) => {
            setSaveError(null);
            try {
              await onDeleteSubcategory?.(id);
            } catch (err) {
              const message = err instanceof Error ? err.message : t('genericError');
              setSaveError(message);
            }
          }}
        />
      )}
    </div>
  );
}

type SubcategorySectionProps = {
  categoryId: string;
  subcategories: Subcategory[];
  onAdd: (data: Omit<Subcategory, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdate?: (id: string, data: Partial<Omit<Subcategory, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
};

function SubcategorySection({ categoryId, subcategories, onAdd, onUpdate, onDelete }: SubcategorySectionProps) {
  const t = useTranslations('Catalog');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Omit<Subcategory, 'id' | 'created_at' | 'updated_at'>>({
    defaultValues: {
      category_id: categoryId,
      slug: '',
      name_ar: '',
      name_en: '',
      sort_order: 0,
      is_active: true,
    },
  });

  const handleAdd = async (data: Omit<Subcategory, 'id' | 'created_at' | 'updated_at'>) => {
    await onAdd(data);
    reset();
  };

  return (
    <div className="flex flex-col gap-4 border-t pt-6">
      <h3 className="font-bold text-lg">{t('subcategories')}</h3>
      {subcategories.length === 0 && <p className="text-sm opacity-70">{t('noSubcategories')}</p>}
      <ul className="flex flex-col gap-3">
        {subcategories.map((sub) => (
          <SubcategoryItem
            key={sub.id}
            subcategory={sub}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </ul>
      <form onSubmit={handleSubmit(handleAdd)} className="flex flex-col gap-3 border rounded-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">{t('name_ar')}</label>
            <input {...register('name_ar')} className="w-full border rounded px-3 py-2" dir="rtl" />
            {errors.name_ar && <p className="text-rose text-sm">{errors.name_ar.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">{t('name_en')}</label>
            <input {...register('name_en')} className="w-full border rounded px-3 py-2" dir="ltr" />
            {errors.name_en && <p className="text-rose text-sm">{errors.name_en.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">{t('slug')}</label>
            <input {...register('slug')} className="w-full border rounded px-3 py-2" dir="ltr" />
          </div>
          <div>
            <label className="block text-sm font-medium">{t('sortOrder')}</label>
            <input
              type="number"
              {...register('sort_order', { valueAsNumber: true })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('is_active')} />
          <span className="text-sm font-medium">{t('isActive')}</span>
        </label>
        <BrandButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('saving') : t('newSubcategory')}
        </BrandButton>
      </form>
    </div>
  );
}

type SubcategoryItemProps = {
  subcategory: Subcategory;
  onUpdate?: (id: string, data: Partial<Omit<Subcategory, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
};

function SubcategoryItem({ subcategory, onUpdate, onDelete }: SubcategoryItemProps) {
  const t = useTranslations('Catalog');
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<Omit<Subcategory, 'id' | 'created_at' | 'updated_at'>>({
    defaultValues: {
      category_id: subcategory.category_id,
      slug: subcategory.slug,
      name_ar: subcategory.name_ar,
      name_en: subcategory.name_en,
      sort_order: subcategory.sort_order,
      is_active: subcategory.is_active,
    },
  });

  return (
    <li className="border rounded-md p-3">
      <form onSubmit={handleSubmit((data) => onUpdate?.(subcategory.id, data))} className="flex flex-col gap-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input {...register('name_ar')} className="border rounded px-3 py-2" dir="rtl" />
          <input {...register('name_en')} className="border rounded px-3 py-2" dir="ltr" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input {...register('slug')} className="border rounded px-3 py-2" dir="ltr" />
          <input type="number" {...register('sort_order', { valueAsNumber: true })} className="border rounded px-3 py-2" />
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register('is_active')} />
            <span className="text-sm">{t('isActive')}</span>
          </label>
        </div>
        <div className="flex gap-2">
          <BrandButton type="submit" disabled={isSubmitting} size="sm">
            {t('update')}
          </BrandButton>
          {onDelete && (
            <BrandButton type="button" variant="secondary" size="sm" onClick={() => onDelete(subcategory.id)}>
              {t('delete')}
            </BrandButton>
          )}
        </div>
      </form>
    </li>
  );
}
