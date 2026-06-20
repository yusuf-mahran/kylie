export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { Heading, BodyText } from '@/components/shared/typography';

const SECTION_KEYS = ['hero', 'vision', 'about', 'footer'] as const;

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CmsAdminPage({ params }: Props) {
  await params;
  const t = await getTranslations('CMS');

  return (
    <SectionWrapper>
      <Heading as="h1" size="2xl">{t('contentManagement')}</Heading>
      <div className="flex flex-col gap-3 mt-6">
        <BodyText size="lg" muted>{t('sections')}</BodyText>
        {SECTION_KEYS.map((key) => (
          <Link
            key={key}
            href={`/admin/cms/sections/${key}`}
            className="border rounded-md p-4 hover:bg-sand transition-colors capitalize"
          >
            {t(`section_${key}`)}
          </Link>
        ))}
        <BodyText size="lg" muted className="mt-6">{t('other')}</BodyText>
        <Link
          href="/admin/cms/social"
          className="border rounded-md p-4 hover:bg-sand transition-colors"
        >
          {t('socialLinks')}
        </Link>
        <Link
          href="/admin/cms/reels"
          className="border rounded-md p-4 hover:bg-sand transition-colors"
        >
          {t('reels')}
        </Link>
      </div>
    </SectionWrapper>
  );
}
