'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import Logo from '@/components/ui/Logo';
import Img from '@/components/ui/Img';
import { Typography } from '@/components/ui/Typography';
import Btn from '@/components/ui/Btn';
import { Home } from '@mui/icons-material';

interface AuthShellProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthShell({
  children,
  title,
  subtitle,
}: AuthShellProps) {
  const t = useTranslations('Auth');

  return (
    <section className="relative w-full max-md:min-h-dvh grid items-start justify-center md:grid-cols-2 grid-cols-1 max-md:grid-rows-[max(20vh,20rem)_1fr] gap-3">
      <div className="w-full md:h-[calc(100dvh-2rem)] h-full md:sticky md:top-3 max-md:row-span-1">
        <div className="relative w-full h-full min-h-55 md:min-h-full rounded-default">
          <Img
            src="/imgs/red-beauty-set.jpg"
            alt={t('authImageAlt')}
            width={720}
            height={720}
            loading="eager"
            className="grayscale-50"
          />
        </div>
      </div>
      <div className="w-full md:min-h-[calc(100dvh-2rem)] min-h-dvh max-md:h-full rounded-default bg-primary-100 flex justify-center items-center max-md:row-span-3">
        <div className="w-full flex flex-col justify-start items-center gap-5 lg:p-12 md:px-4 md:py-8 p-4 max-w-2xl">
          <div className="w-full flex flex-col justify-center items-start">
            <div className="w-full flex justify-start items-center gap-2 mb-4">
              <Btn
                variant="icon"
                as="a"
                href="/"
                icon={<Home className="text-black" />}
                aria-label={t('backToHome')}
                className="border border-border"
              />
              <Logo className="text-4xl font-light" />
            </div>
            <Typography variant="h1" className="font-heading">
              {title}
            </Typography>
            <Typography>{subtitle}</Typography>
          </div>
          <div className="w-full flex flex-col justify-center items-center">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
