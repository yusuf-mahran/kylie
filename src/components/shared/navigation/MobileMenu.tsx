'use client';

import { useEffect } from 'react';
import Btn from '@/components/ui/Btn';
import {
  CloseRounded,
  Facebook,
  Instagram,
  PhoneOutlined,
  WhatsApp,
} from '@mui/icons-material';
import RoundedContainer from '@/components/ui/RoundedContainer';
import Logo from '@/components/ui/Logo';
import Anchor from '@/components/ui/Anchor';
import Img from '@/components/ui/Img';
import LoginBtn from '@/components/shared/common/auth/LoginBtn';
import { Typography } from '@/components/ui/Typography';

type NavItem = { label: string; href: string };

type MobileMenuProps = {
  open: boolean;
  items: NavItem[];
  onClose: () => void;
  bottomQuote: string;
};

export default function MobileMenu({
  open,
  items,
  onClose,
  bottomQuote,
}: MobileMenuProps) {
  useEffect(() => {
    const handler = () => {
      onClose();
    };
    if (open) document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [open, onClose]);

  return (
    <div
      className={`fixed top-0 left-1/2 z-500 grid grid-rows-[10dvh_40dvh_1fr] h-dvh w-screen gap-2 bg-surface py-2 px-3 pb-4 text-black transition-transform duration-300 ${
        open ? '-translate-x-1/2' : 'translate-x-full pointer-events-none'
      }`}
    >
      <RoundedContainer
        width="100%"
        height="100%"
        className="bg-primary-500 text-white flex justify-between items-center p-1"
      >
        <Btn
          variant="icon"
          icon={<PhoneOutlined fontSize="large" />}
          showIconBg={false}
        />
        <Logo />
        <Btn
          variant="icon"
          icon={<CloseRounded fontSize="large" className="font-extrabold" />}
          showIconBg={false}
          aria-label="Close menu"
        />
      </RoundedContainer>
      <RoundedContainer
        width="100%"
        height="100%"
        className="bg-primary-50 flex justify-between items-center"
      >
        <nav className="w-full h-[40dvh] flex flex-col justify-evenly items-center px-2">
          {items.map((item) => (
            <Anchor
              key={item.href}
              href={item.href}
              size="2xl"
              showIcon={true}
              className="w-full text-center text-foreground hover:text-primary-800"
            >
              {item.label}
            </Anchor>
          ))}
        </nav>
      </RoundedContainer>
      <RoundedContainer
        width="100%"
        height="100%"
        className="relative overflow-hidden flex justify-between items-center gap-2"
      >
        <div className="w-full h-full flex flex-col justify-between items-start py-2 overflow-hidden">
          <nav className="w-full flex justify-start items-center gap-1">
            <Btn
              variant="icon"
              icon={<Facebook fontSize="medium" />}
              showIconBg={false}
              iconPadding="p-0"
            />
            <Btn
              variant="icon"
              icon={<Instagram fontSize="medium" />}
              showIconBg={false}
              iconPadding="p-0"
            />
            <Btn
              variant="icon"
              icon={<WhatsApp fontSize="medium" />}
              showIconBg={false}
              iconPadding="p-0"
            />
          </nav>
          <Typography variant="h4" as="p" className="text-start w-full">
            {bottomQuote}
          </Typography>
          <LoginBtn className="w-full" />
        </div>
        <div className="w-3/5 h-full shrink-0">
          <Img
            src="/imgs/excited-girl-with-strawberry-hat-bright-red-dress-close-up.jpg"
            loading="eager"
            className="after:absolute after:inset-0 after:w-full after:h-full after:bg-black/30"
          />
        </div>
      </RoundedContainer>
    </div>
  );
}
