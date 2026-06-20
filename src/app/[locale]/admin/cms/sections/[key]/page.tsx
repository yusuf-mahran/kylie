export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import { createServerClient } from '@/lib/supabase/server';
import { CmsRepository } from '@/repositories/cms.repository';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { Heading, BodyText } from '@/components/shared/typography';
import SectionEditor from './section-editor';

type Props = {
  params: Promise<{ locale: string; key: string }>;
};

const VALID_SECTION_KEYS: ('hero' | 'vision' | 'about' | 'footer')[] = ['hero', 'vision', 'about', 'footer'];

export default async function SectionEditPage({ params }: Props) {
  const { key } = await params;
  const t = await getTranslations('CMS');

  if (!VALID_SECTION_KEYS.includes(key as 'hero' | 'vision' | 'about' | 'footer')) {
    return (
      <SectionWrapper>
        <Heading as="h1" size="2xl">{t('invalidSection')}</Heading>
        <BodyText>{t('sectionNotFound', { key })}</BodyText>
      </SectionWrapper>
    );
  }

  let section;
  try {
    const supabase = createServerClient();
    const repo = new CmsRepository(supabase);
    section = await repo.getSectionByKey(key as 'hero' | 'vision' | 'about' | 'footer');
  } catch {
    return (
      <SectionWrapper>
        <Heading as="h1" size="2xl">{t('error')}</Heading>
        <BodyText>{t('databaseUnavailable')}</BodyText>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <Heading as="h1" size="2xl" className="capitalize">
        {t(`section_${key as 'hero' | 'vision' | 'about' | 'footer'}`)}
      </Heading>
      <SectionEditor section={section} />
    </SectionWrapper>
  );
}
