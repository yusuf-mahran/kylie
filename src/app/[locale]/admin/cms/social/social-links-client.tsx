'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import SocialLinkForm from '@/components/admin/cms/social-link-form';
import type { SocialLink } from '@/features/brand/types';
import { updateSocialLink } from '@/actions/cms.actions';

type SocialLinksClientProps = {
  links: SocialLink[];
};

export default function SocialLinksClient({ links }: SocialLinksClientProps) {
  const t = useTranslations('CMS');

  const handleSave = useCallback(
    async (id: string, data: Partial<SocialLink>) => {
      await updateSocialLink(id, data);
    },
    []
  );

  return (
    <div className="flex flex-col gap-4">
      {links.map((link) => (
        <SocialLinkForm key={link.id} link={link} onSave={handleSave} />
      ))}
      {links.length === 0 && <p>{t('noSocialLinks')}</p>}
    </div>
  );
}
