'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import SectionForm from '@/components/admin/cms/section-form';
import ImageUploadField from '@/components/admin/cms/image-upload-field';
import type { CmsSection } from '@/features/brand/types';
import type { SectionFormData } from '@/features/brand/schemas';
import { updateSection, addSectionImage, removeSectionImage } from '@/actions/cms.actions';

type SectionEditorProps = {
  section: CmsSection;
};

export default function SectionEditor({ section }: SectionEditorProps) {
  const t = useTranslations('CMS');

  const handleSave = useCallback(
    async (data: SectionFormData) => {
      await updateSection(section.section_key, data);
    },
    [section.section_key]
  );

  const handleUploadImage = useCallback(
    async (asset: { public_id: string; secure_url: string }) => {
      await addSectionImage(section.section_key, asset);
    },
    [section.section_key]
  );

  const handleRemoveImage = useCallback(
    async (publicId: string) => {
      await removeSectionImage(section.section_key, publicId);
    },
    [section.section_key]
  );

  const canAddMoreImages = section.images.length < 5;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-3 flex-wrap">
        {section.images.map((img) => (
          <ImageUploadField
            key={img.public_id}
            currentImage={img}
            onUpload={handleUploadImage}
            onRemove={() => handleRemoveImage(img.public_id)}
          />
        ))}
        {canAddMoreImages && (
          <ImageUploadField onUpload={handleUploadImage} />
        )}
      </div>
      {!canAddMoreImages && (
        <p className="text-sm opacity-70">{t('maxImagesReached')}</p>
      )}
      <SectionForm
        section={section}
        onSave={handleSave}
      />
    </div>
  );
}
