import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { RTLProvider } from '@/providers/shared/rtl-provider';
import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/shared/navigation/Navbar';
import Footer from '@/components/shared/navigation/Footer';

export const metadata: Metadata = {
  title: 'Kylie',
  description: 'متجر مستحضرات تجميل راقي — كايلي',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);

  const messages = (await import(`@/messages/${locale}.json`)).default;

  const isArabic = locale === 'ar';

  const { fontVariables, fontClassNames } = isArabic
    ? await import('@/lib/fonts/ar')
    : await import('@/lib/fonts/en');

  return (
    <html
      lang={locale}
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`${fontVariables} ${fontClassNames} min-h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <RTLProvider>
            <div className="mx-auto w-full max-w-[2180px] xl:px-8 px-4">
              <Navbar />
              <div className="w-full -mt-1">{children}</div>
              <Footer />
            </div>
          </RTLProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
