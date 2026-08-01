import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { RTLProvider } from '@/providers/shared/rtl-provider';
import { AuthProvider } from '@/providers/auth/auth-provider';
import { ToastProvider } from '@/providers/shared/toast-provider';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

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

  const messages = (await import(`@/messages/${locale}.json`)).default;

  const isArabic = locale === 'ar';

  const { fontVariables, fontClassNames } = isArabic
    ? await import('@/lib/fonts/ar')
    : await import('@/lib/fonts/en');

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AuthProvider>
        <ToastProvider>
          <RTLProvider>
            <div
              lang={locale}
              dir={isArabic ? 'rtl' : 'ltr'}
              className={`${fontVariables} ${fontClassNames} w-full mx-auto overflow-x-hidden`}
            >
              {children}
            </div>
          </RTLProvider>
        </ToastProvider>
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
