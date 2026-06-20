'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { SocialLink } from '@/features/brand/types';
import { BrandButton } from '@/components/shared/brand-button';

type SocialLinkFormProps = {
  link: SocialLink;
  onSave: (id: string, data: Partial<SocialLink>) => Promise<void>;
};

export default function SocialLinkForm({ link, onSave }: SocialLinkFormProps) {
  const t = useTranslations('CMS');
  const [url, setUrl] = useState(link.url);
  const [isActive, setIsActive] = useState(link.is_active);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(link.id, { url, is_active: isActive, platform: link.platform });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border rounded-md p-4 flex items-center gap-4">
      <span className="font-medium w-28 capitalize">{link.platform}</span>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={t('url')}
        className="flex-1 border rounded px-3 py-2"
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        {t('active')}
      </label>
      <BrandButton onClick={handleSave} disabled={saving} variant="secondary">
        {saving ? t('saving') : t('save')}
      </BrandButton>
    </div>
  );
}
