'use client';

import Btn from '@/components/ui/Btn';
import Img from '@/components/ui/Img';
import { Typography } from '@/components/ui/Typography';
import clsx from 'clsx';
import { useParams } from 'next/navigation';

type StartContentProps = {
  flag: string;
  headline: string;
  cta: string;
  iconText: string;
};

export default function StartContent({
  flag,
  headline,
  cta,
  iconText,
}: StartContentProps) {
  const { locale } = useParams();

  return (
    <div className="relative md:col-span-5 flex flex-col justify-center items-start gap-4">
      <Typography
        variant="subtitle1"
        className="w-fit border border-border rounded-default px-4 py-2 text-center"
      >
        {flag}
      </Typography>
      <Typography variant="h1" className="max-w-120 font-heading">
        {headline}
      </Typography>
      <Btn variant="secondary" className="w-40">
        {cta}
      </Btn>
      <div
        className={clsx(
          'w-fit h-fit flex flex-col items-center gap-1 max-w-40 pt-4 max-md:absolute max-md:inset-full max-md:-translate-y-2/3',
          locale === 'ar'
            ? 'max-md:translate-x-9/10'
            : 'max-md:-translate-x-9/10',
        )}
      >
        <div className="md:h-24 md:w-24 h-16 w-16 shrink-0">
          <Img
            src="/imgs/strawberry_icon.png"
            width={250}
            height={100}
            className="bg-transparent"
          />
        </div>
        <Typography variant="caption" className="text-center min-w-32">
          {iconText}
        </Typography>
      </div>
    </div>
  );
}
