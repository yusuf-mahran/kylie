'use client';

import { Typography } from '@/components/ui/Typography';
import Btn from '@/components/ui/Btn';
import GlassBg from '@/components/ui/GlassBg';
import { ShoppingCartOutlined } from '@mui/icons-material';
import Link from 'next/link';
import Img from '@/components/ui/Img';

export default function NotFound() {
  return (
    <main className="w-full min-h-screen grid grid-rows-[auto_1fr]">
      <header className="sticky -top-1 w-full flex items-center justify-between py-4 z-500 text-black">
        <GlassBg width="w-dvw bg-primary-100 border-b border-b-border" />
        <Link
          href="/"
          className="font-bold tracking-tight transition-colors text-center inline-block text-2xl"
        >
          Kylie
        </Link>
        <div className="flex items-center gap-1">
          <Btn
            variant="icon"
            as="a"
            href="/cart"
            icon={<ShoppingCartOutlined className="text-black" />}
            aria-label="Display Cart Page"
          />
          <Btn variant="primary" as="a" href="/login">
            Login
          </Btn>
        </div>
      </header>

      <div className="w-full pb-8 flex justify-center items-center overflow-hidden">
        <div className="w-full flex flex-col justify-center items-center gap-6 text-center">
          <h1 className="md:text-[28vw] text-[36vw] font-bold text-primary-400 relative">
            404
            <span className="w-[150%] inline-block absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none">
              <Img
                src="/imgs/red_cloud.png"
                width={1080}
                height={1080}
                className="w-full h-full bg-transparent"
              />
            </span>
          </h1>
          <Typography variant="h1" as="p">
            Maybe We&apos;ve been lost!
          </Typography>
          <Btn href="/" as="a" className="w-fit mx-auto scale-150">
            Back to Home
          </Btn>
        </div>
      </div>
    </main>
  );
}
