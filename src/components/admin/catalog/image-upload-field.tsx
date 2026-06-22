'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary';
import type { ProductImageFormData, MediaAsset } from '@/features/catalog/types';
import { BrandButton } from '@/components/shared/brand-button';

type ProductImageUploadFieldProps = {
  images: ProductImageFormData[];
  onChange: (images: ProductImageFormData[]) => void;
};

export default function ProductImageUploadField({ images, onChange }: ProductImageUploadFieldProps) {
  const t = useTranslations('Catalog');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (typeof result.info === 'object' && result.info) {
      setUploading(true);
      setError(null);
      const asset = {
        public_id: result.info.public_id as string,
        secure_url: result.info.secure_url as string,
      } as MediaAsset;

      const nextImages = [
        ...images,
        {
          image: asset,
          sort_order: images.length,
          is_primary: images.length === 0,
        },
      ];
      onChange(nextImages);
      setUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const nextImages = images.filter((_, i) => i !== index).map((img, i) => ({
      ...img,
      sort_order: i,
    }));
    if (nextImages.length > 0 && !nextImages.some((img) => img.is_primary)) {
      nextImages[0].is_primary = true;
    }
    onChange(nextImages);
  };

  const handleSetPrimary = (index: number) => {
    const nextImages = images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));
    onChange(nextImages);
  };

  const canAddMore = images.length < 10;

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-rose text-sm">{error}</p>}
      <div className="flex flex-wrap gap-3">
        {images.map((img, index) => (
          <div
            key={`${img.image.public_id}-${index}`}
            className={`relative w-24 h-24 overflow-hidden rounded-md border ${img.is_primary ? 'ring-2 ring-rose' : ''}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.image.secure_url}
              alt=""
              className="object-cover w-full h-full"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 bg-rose text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              ×
            </button>
            {!img.is_primary && (
              <button
                type="button"
                onClick={() => handleSetPrimary(index)}
                className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1 rounded"
              >
                {t('markAsPrimary')}
              </button>
            )}
          </div>
        ))}
        {canAddMore && (
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
            onSuccess={handleSuccess}
          >
            {({ open }) => (
              <BrandButton
                type="button"
                variant="secondary"
                onClick={() => open()}
                disabled={uploading}
                className="w-24 h-24"
              >
                {uploading ? t('uploading') : t('addImage')}
              </BrandButton>
            )}
          </CldUploadWidget>
        )}
      </div>
      {!canAddMore && <p className="text-sm opacity-70">{t('maxImagesError')}</p>}
    </div>
  );
}
