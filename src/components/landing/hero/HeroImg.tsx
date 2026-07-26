'use client';

import Img from '@/components/ui/Img';
import clsx from 'clsx';
import { useParams } from 'next/navigation';

export default function HeroImg() {
  const { locale } = useParams();

  return (
    <>
      <div className="md:col-span-2 max-md:pt-88" />

      <div
        className={clsx(
          'md:w-[35dvw] w-full max-w-120 rotate-12 absolute top-1/2 left-1/2 -translate-y-1/2 -z-10',
          locale === 'ar'
            ? '2xl:-translate-x-1/2 xl:-translate-x-2/3 -translate-x-1/2'
            : '-translate-x-1/2',
        )}
      >
        <Img
          src="/imgs/hero_serum.png"
          width={1080}
          height={1080}
          loading="eager"
          className="bg-transparent pointer-events-none drop-shadow-[0_134px_134px_#000000a5]"
        />
      </div>
    </>
  );
}
