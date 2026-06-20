export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import { createServerClient } from '@/lib/supabase/server';
import { CmsRepository } from '@/repositories/cms.repository';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { Heading, BodyText } from '@/components/shared/typography';
import ReelsClient from './reels-client';

export default async function ReelsPage() {
  const t = await getTranslations('CMS');

  let reels;
  try {
    const supabase = createServerClient();
    const repo = new CmsRepository(supabase);
    reels = await repo.getReels();
  } catch {
    return (
      <SectionWrapper>
        <Heading as="h1" size="2xl">{t('reels')}</Heading>
        <BodyText>{t('databaseUnavailable')}</BodyText>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <Heading as="h1" size="2xl">{t('reels')}</Heading>
      <BodyText size="lg" muted className="mb-6">
        {t('reelsDescription')}
      </BodyText>
      <ReelsClient reels={reels} />
    </SectionWrapper>
  );
}
