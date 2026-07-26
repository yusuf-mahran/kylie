import { getTranslations } from 'next-intl/server';
import FullBg from '@/components/ui/FullBg';
import StartContent from '@/components/landing/hero/StartContent';
import EndContent from '@/components/landing/hero/EndContent';
import HeroImg from '@/components/landing/hero/HeroImg';
import BottomContent from '@/components/landing/hero/BottomContent';

export default async function HeroLayout() {
  const t = await getTranslations('Hero');

  return (
    <section className="relative w-full min-h-dvh -mt-24 grid md:grid-rows-6 pt-30 pb-6 text-white">
      <FullBg className="bg-primary-500 rounded-b-default" />

      {/* TOP HERO */}
      <div className="relative md:row-span-5 grid md:grid-cols-12 gap-2 border-b border-b-border">
        <StartContent
          flag={t('flag')}
          headline={t('headline')}
          cta={t('cta')}
          iconText={t('iconText')}
        />
        <HeroImg />
        <EndContent
          flag={t('secondaryFlag')}
          headline={t('secondaryHeadline')}
        />
      </div>

      {/* BOTTOM HERO */}
      <div className="w-full md:row-span-1 flex max-md:flex-col justify-between gap-5 py-4">
        <BottomContent
          percentage={t('percentage')}
          percentTitle={t('percentTitle')}
          flag={t('bottomFlag')}
          flagText={t('bottomText')}
        />
      </div>
    </section>
  );
}
