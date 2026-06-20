export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import { createServerClient } from '@/lib/supabase/server';
import { CmsRepository } from '@/repositories/cms.repository';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { Heading, BodyText } from '@/components/shared/typography';
import SocialLinksClient from './social-links-client';

export default async function SocialLinksPage() {
  const t = await getTranslations('CMS');

  let links;
  try {
    const supabase = createServerClient();
    const repo = new CmsRepository(supabase);
    links = await repo.getSocialLinks();
  } catch {
    return (
      <SectionWrapper>
        <Heading as="h1" size="2xl">{t('socialLinks')}</Heading>
        <BodyText>{t('databaseUnavailable')}</BodyText>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <Heading as="h1" size="2xl">{t('socialLinks')}</Heading>
      <BodyText size="lg" muted className="mb-6">
        {t('socialLinksDescription')}
      </BodyText>
      <SocialLinksClient links={links} />
    </SectionWrapper>
  );
}
