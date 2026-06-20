'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { SectionFormSchema, type SectionFormData } from '@/features/brand/schemas';
import type { CmsSection } from '@/features/brand/types';
import { BrandButton } from '@/components/shared/brand-button';

type SectionFormProps = {
  section: CmsSection;
  onSave: (data: SectionFormData) => Promise<void>;
};

export default function SectionForm({
  section,
  onSave,
}: SectionFormProps) {
  const t = useTranslations('CMS');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SectionFormData>({
    resolver: zodResolver(SectionFormSchema),
    defaultValues: {
      content_ar: section.content_ar,
      content_en: section.content_en,
      is_active: section.is_active ?? true,
      sort_order: section.sort_order ?? 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-6 max-w-2xl">
      <fieldset className="border rounded-md p-4">
        <legend className="font-bold px-2">{t('arabic')}</legend>
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium">{t('headline')}</label>
            <input
              {...register('content_ar.headline')}
              className="w-full border rounded px-3 py-2"
              dir="rtl"
            />
            {errors.content_ar?.headline && (
              <p className="text-rose text-sm">{errors.content_ar.headline.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">{t('subheading')}</label>
            <input
              {...register('content_ar.subheading')}
              className="w-full border rounded px-3 py-2"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">{t('body')}</label>
            <textarea
              {...register('content_ar.body')}
              className="w-full border rounded px-3 py-2"
              rows={4}
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">{t('cta')}</label>
            <input
              {...register('content_ar.cta')}
              className="w-full border rounded px-3 py-2"
              dir="rtl"
            />
            {errors.content_ar?.cta && (
              <p className="text-rose text-sm">{errors.content_ar.cta.message}</p>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset className="border rounded-md p-4">
        <legend className="font-bold px-2">{t('english')}</legend>
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium">{t('headline')}</label>
            <input
              {...register('content_en.headline')}
              className="w-full border rounded px-3 py-2"
              dir="ltr"
            />
            {errors.content_en?.headline && (
              <p className="text-rose text-sm">{errors.content_en.headline.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">{t('subheading')}</label>
            <input
              {...register('content_en.subheading')}
              className="w-full border rounded px-3 py-2"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">{t('body')}</label>
            <textarea
              {...register('content_en.body')}
              className="w-full border rounded px-3 py-2"
              rows={4}
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">{t('cta')}</label>
            <input
              {...register('content_en.cta')}
              className="w-full border rounded px-3 py-2"
              dir="ltr"
            />
            {errors.content_en?.cta && (
              <p className="text-rose text-sm">{errors.content_en.cta.message}</p>
            )}
          </div>
        </div>
      </fieldset>

      <label className="flex items-center gap-2">
        <input type="checkbox" {...register('is_active')} />
        <span className="text-sm font-medium">{t('active')}</span>
      </label>

      <div>
        <label className="block text-sm font-medium">{t('sortOrder')}</label>
        <input
          type="number"
          {...register('sort_order', { valueAsNumber: true })}
          className="w-20 border rounded px-3 py-2"
        />
      </div>

      <BrandButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? t('saving') : t('save')}
      </BrandButton>
    </form>
  );
}
