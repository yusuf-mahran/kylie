'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Logo from '@/components/ui/Logo';
import DesktopMenu from '@/components/shared/navigation/DesktopMenu';
import Btn from '@/components/ui/Btn';
import MobileMenu from '@/components/shared/navigation/MobileMenu';
import { Menu, ShoppingCartOutlined } from '@mui/icons-material';
import LoginBtn from '@/components/shared/auth/LoginBtn';
import GlassBg from '@/components/ui/GlassBg';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations('Navbar');
  const items = t.raw('links') as { label: string; href: string }[];

  return (
    <header className="sticky -top-1 flex items-center justify-between py-4 z-500 border-b border-b-border text-white">
      <GlassBg width="w-dvw bg-primary-500" />
      <Logo />
      <DesktopMenu items={items} />
      <div className="flex items-center gap-1">
        <Btn
          variant="icon"
          as="a"
          href="/cart"
          icon={<ShoppingCartOutlined className="text-black" />}
          aria-label="Display Cart Page"
        />
        <LoginBtn variant="secondary" className="hidden md:inline-flex" />
        <Btn
          variant="icon"
          icon={<Menu />}
          showIconBg={false}
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="md:hidden"
        />
      </div>
      <MobileMenu
        open={menuOpen}
        items={items}
        bottomQuote={t('bottomQuote')}
        onClose={() => setMenuOpen(false)}
      />
    </header>
  );
}
