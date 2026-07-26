import { getTranslations } from 'next-intl/server';

export default async function HugeLogo() {
  const t = await getTranslations('Navbar');

  return (
    <>
      <style>
        {`
          :is([class*="u-text-style-"], h1, h2, h3, h4, h5, h6, p, blockquote) {
              display: flow-root;
          }
          :is([class*="u-text-style-"], h1, h2, h3, h4, h5, h6, p, blockquote)::before {
              content: "";
              display: table;
              margin-bottom: calc(-0.5lh + 0.5em);
          }
          :is([class*="u-text-style-"], h1, h2, h3, h4, h5, h6, p, blockquote)::after {
              content: "";
              display: table;
              margin-bottom: calc(-0.5lh + 0.33em);
          }
        `}
      </style>

      <div className="overflow-hidden origin-bottom scale-y-80">
        <p className="text-[30vw] font-heading w-full text-center font-bold">
          {t('logo')}
        </p>
      </div>
    </>
  );
}
