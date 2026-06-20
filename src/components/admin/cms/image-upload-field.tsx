'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary';
import type { MediaAsset } from '@/features/brand/types';
import { BrandButton } from '@/components/shared/brand-button';

type ImageUploadFieldProps = {
  onUpload: (asset: MediaAsset) => Promise<void>;
  onRemove?: () => Promise<void>;
  currentImage?: MediaAsset | null;
};

export default function ImageUploadField({
  onUpload,
  onRemove,
  currentImage,
}: ImageUploadFieldProps) {
  const t = useTranslations('CMS');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);

  const handleSuccess = async (result: CloudinaryUploadWidgetResults) => {
    if (typeof result.info === 'object' && result.info) {
      setUploading(true);
      setError(null);
      try {
        await onUpload({
          public_id: result.info.public_id as string,
          secure_url: result.info.secure_url as string,
        });
      } catch {
        setError(t('uploadImageError'));
      } finally {
        setUploading(false);
      }
    }
  };

  const handleRemove = async () => {
    if (!onRemove) return;
    setRemoving(true);
    setError(null);
    try {
      await onRemove();
    } catch {
      setError(t('removeImageError'));
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <p className="text-rose text-sm">{error}</p>
      )}
      {currentImage && (
        <div className="relative w-32 h-32 overflow-hidden rounded-md border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage.secure_url}
            alt={t('currentImage')}
            className="object-cover w-full h-full"
          />
          {onRemove && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={removing}
              className="absolute top-1 right-1 bg-rose text-white rounded-full w-5 h-5 flex items-center justify-center text-xs disabled:opacity-50"
            >
              {removing ? '...' : '×'}
            </button>
          )}
        </div>
      )}
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
          >
            {uploading ? t('uploading') : t('uploadImage')}
          </BrandButton>
        )}
      </CldUploadWidget>
    </div>
  );
}
