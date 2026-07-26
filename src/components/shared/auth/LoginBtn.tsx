import Btn from '@/components/ui/Btn';
import { useTranslations } from 'next-intl';
import { ComponentPropsWithoutRef } from 'react';

type LoginBtnProps = ComponentPropsWithoutRef<'button'> & {
  variant?: 'secondary' | 'primary' | 'icon' | undefined;
};

export default function LoginBtn({ variant, ...props }: LoginBtnProps) {
  const t = useTranslations('Navbar');

  return (
    <Btn variant={variant} {...props}>
      {t('cta')}
    </Btn>
  );
}
