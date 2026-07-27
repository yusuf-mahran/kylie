'use client';

import { Link } from '@/i18n/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  const t = useTranslations('Navbar');

  return (
    <Link
      href="/"
      className={clsx(
        'font-bold tracking-tight transition-colors text-center inline-block',
        className ?? 'text-2xl',
      )}
    >
      {t('logo')}
    </Link>
  );
}
