'use client';

import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import ReelForm from '@/components/admin/cms/reel-form';
import type { Reel } from '@/features/brand/types';
import { addReel, updateReel, removeReel } from '@/actions/cms.actions';
import { BrandButton } from '@/components/shared/brand-button';

type ReelsClientProps = {
  reels: Reel[];
};

export default function ReelsClient({ reels: initialReels }: ReelsClientProps) {
  const t = useTranslations('CMS');
  const [reels, setReels] = useState(initialReels);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = useCallback(
    async (data: Parameters<typeof addReel>[0]) => {
      const newReel = await addReel(data);
      setReels((prev) => [...prev, newReel]);
      setShowForm(false);
    },
    []
  );

  const handleUpdate = useCallback(
    async (id: string, data: Partial<Omit<Reel, 'id'>>) => {
      await updateReel(id, data);
      setReels((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...data } : r))
      );
    },
    []
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await removeReel(id);
      setReels((prev) => prev.filter((r) => r.id !== id));
    },
    []
  );

  return (
    <div className="flex flex-col gap-4">
      <BrandButton onClick={() => setShowForm(!showForm)}>
        {showForm ? t('cancel') : t('addReel')}
      </BrandButton>

      {showForm && (
        <ReelForm
          onSave={async (data) =>
            handleAdd({
              video_url: data.video_url,
              sort_order: data.sort_order,
              is_active: data.is_active,
              cover_image: data.cover_image ?? null,
            })
          }
        />
      )}

      {reels.map((reel) => (
        <ReelForm
          key={reel.id}
          initialData={reel}
          onSave={async (data) =>
            handleUpdate(reel.id, {
              video_url: data.video_url,
              sort_order: data.sort_order,
              is_active: data.is_active,
              cover_image: data.cover_image ?? null,
            })
          }
          onDelete={async () => handleDelete(reel.id)}
        />
      ))}

      {reels.length === 0 && !showForm && (
        <p>{t('noReels')}</p>
      )}
    </div>
  );
}
