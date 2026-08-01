'use client';

import { Link as LinkIntl } from '@/i18n/navigation';
import Link from 'next/link';
import { ArrowUpward } from '@mui/icons-material';
import { useParams } from 'next/navigation';

type AnchorProps = {
  href: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showIcon?: boolean;
  noIntl?: boolean;
  children: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<'a'>;

const sizeStyles: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
};

export default function Anchor({
  href,
  size = 'md',
  showIcon = false,
  noIntl = false,
  className,
  children,
  ...props
}: AnchorProps) {
  const { locale } = useParams();

  if (noIntl)
    return (
      <Link
        href={href}
        className={`transition-all hover:text-primary-700 ${sizeStyles[size]} ${className ?? ''}`.trim()}
        {...props}
      >
        {children}
      </Link>
    );

  return (
    <LinkIntl
      href={href}
      className={`transition-all hover:text-primary-700 ${sizeStyles[size]} ${className ?? ''}`.trim()}
      {...props}
    >
      {children}
      {showIcon && (
        <ArrowUpward className={locale === 'ar' ? '-rotate-45' : 'rotate-45'} />
      )}
    </LinkIntl>
  );
}
