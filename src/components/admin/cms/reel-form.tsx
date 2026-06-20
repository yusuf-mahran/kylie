'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ImageUploadField from './image-upload-field';
import { BrandButton } from '@/components/shared/brand-button';
import type { MediaAsset } from '@/features/brand/types';

type ReelFormData = {
  video_url: string;
  sort_order: number;
  is_active: boolean;
  cover_image?: MediaAsset | null;
};

type ReelFormProps = {
  initialData?: ReelFormData;
  onSave: (data: ReelFormData & { cover_image?: MediaAsset | null }) => Promise<void>;
  onDelete?: () => Promise<void>;
};

export default function ReelForm({ initialData, onSave, onDelete }: ReelFormProps) {
  const t = useTranslations('CMS');
  const [videoUrl, setVideoUrl] = useState(initialData?.video_url ?? '');
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order ?? 0);
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [coverImage, setCoverImage] = useState<MediaAsset | null>(initialData?.cover_image ?? null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        video_url: videoUrl,
        sort_order: sortOrder,
        is_active: isActive,
        cover_image: coverImage,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="border rounded-md p-4 flex flex-col gap-3">
      <div>
        <label className="block text-sm font-medium">{t('videoUrl')}</label>
        <input
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://youtube.com/..."
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="flex items-center gap-4">
        <div>
          <label className="block text-sm font-medium">{t('sortOrder')}</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-20 border rounded px-3 py-2"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          {t('active')}
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium">{t('coverImage')}</label>
        <ImageUploadField
          currentImage={coverImage}
          onUpload={async (asset) => setCoverImage(asset)}
          onRemove={async () => setCoverImage(null)}
        />
      </div>
      <div className="flex gap-2">
        <BrandButton onClick={handleSave} disabled={saving} variant="secondary">
          {saving ? t('saving') : t('save')}
        </BrandButton>
        {onDelete && (
          <BrandButton onClick={handleDelete} disabled={deleting} variant="ghost">
            {deleting ? t('deleting') : t('delete')}
          </BrandButton>
        )}
      </div>
    </div>
  );
}
