'use client';

import { useTranslations } from 'next-intl';
import type { ProductAccordionSectionFormData } from '@/features/catalog/types';
import { BrandButton } from '@/components/shared/brand-button';

type AccordionSectionsFieldProps = {
  sections: ProductAccordionSectionFormData[];
  onChange: (sections: ProductAccordionSectionFormData[]) => void;
};

export default function AccordionSectionsField({ sections, onChange }: AccordionSectionsFieldProps) {
  const t = useTranslations('Catalog');

  const handleAdd = () => {
    onChange([
      ...sections,
      {
        heading_ar: '',
        heading_en: '',
        description_ar: '',
        description_en: '',
        sort_order: sections.length,
      },
    ]);
  };

  const handleRemove = (index: number) => {
    onChange(
      sections
        .filter((_, i) => i !== index)
        .map((sec, i) => ({ ...sec, sort_order: i }))
    );
  };

  const handleChange = (
    index: number,
    field: keyof ProductAccordionSectionFormData,
    value: string
  ) => {
    const next = sections.map((sec, i) => (i === index ? { ...sec, [field]: value } : sec));
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-bold">{t('accordionSections')}</h3>
      {sections.length === 0 && <p className="text-sm opacity-70">{t('noAccordionSections')}</p>}
      {sections.map((sec, index) => (
        <div key={index} className="border rounded-md p-4 flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">{t('heading_ar')}</label>
              <input
                value={sec.heading_ar}
                onChange={(e) => handleChange(index, 'heading_ar', e.target.value)}
                className="w-full border rounded px-3 py-2"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">{t('heading_en')}</label>
              <input
                value={sec.heading_en}
                onChange={(e) => handleChange(index, 'heading_en', e.target.value)}
                className="w-full border rounded px-3 py-2"
                dir="ltr"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">{t('description_ar')}</label>
              <textarea
                value={sec.description_ar}
                onChange={(e) => handleChange(index, 'description_ar', e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows={3}
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">{t('description_en')}</label>
              <textarea
                value={sec.description_en}
                onChange={(e) => handleChange(index, 'description_en', e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows={3}
                dir="ltr"
              />
            </div>
          </div>
          <BrandButton type="button" variant="secondary" size="sm" onClick={() => handleRemove(index)}>
            {t('removeSection')}
          </BrandButton>
        </div>
      ))}
      <BrandButton type="button" variant="secondary" onClick={handleAdd}>
        {t('addSection')}
      </BrandButton>
    </div>
  );
}
