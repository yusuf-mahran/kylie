import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="w-full min-h-dvh bg-muted text-foreground py-20 border border-border-strong">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4 font-heading">
          {t('headline')}
        </h1>
        <p className="text-lg mb-8">{t('subheading')}</p>
        <button className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark">
          {t('cta')}
        </button>
      </div>
    </section>
  );
}
