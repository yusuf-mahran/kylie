import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { RTLProvider } from '@/providers/shared/rtl-provider';
import type { Metadata } from 'next';
import './globals.css';

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

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const messages = (await import(`../../messages/${locale}.json`)).default;

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
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <RTLProvider>{children}</RTLProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
