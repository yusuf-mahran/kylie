'use client';

import clsx from 'clsx';
import { ComponentPropsWithoutRef, ReactElement, useId } from 'react';

type BtnProps = ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'secondary' | 'icon';
  as?: 'a' | 'button';
  icon?: ReactElement;
  showIconBg?: boolean;
  iconPadding?: string;
} & { href?: string };

const variantStyles: Record<string, string> = {
  primary: 'bg-primary-500 text-white',
  secondary: 'bg-neutral-100 border border-border text-neutral-900',
  icon: 'text-inherit',
};

export default function Btn({
  variant = 'primary',
  as = 'button',
  href,
  icon,
  showIconBg = true,
  iconPadding = 'p-1',
  className,
  children,
  ...props
}: BtnProps) {
  const uid = useId();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Element = as as any;

  const overlayBg =
    variant === 'primary'
      ? 'linear-gradient(315deg, var(--color-primary-600), var(--color-primary-700))'
      : variant === 'secondary'
        ? 'linear-gradient(315deg, var(--color-neutral-300), var(--color-neutral-200))'
        : 'linear-gradient(315deg, var(--color-primary-200), var(--color-primary-100))';

  return (
    <>
      <style>{`
        .btn-${uid}::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 0;
          top: 0;
          left: 0;
          z-index: -1;
          border-radius: inherit;
          background: ${overlayBg};
          transition: all 0.3s ease;
          pointer-events: none;
        }
        .btn-${uid}:hover::after {
          top: auto;
          bottom: 0;
          height: 100%;
        }
        .btn-${uid}:active {
          top: 2px;
        }
      `}</style>
      <Element
        href={href}
        className={clsx(
          'flex justify-center items-center cursor-pointer relative rounded-default text-sm font-medium transition-colors duration-300 z-1 overflow-hidden',
          showIconBg
            ? variant === 'icon'
              ? `btn-${uid} bg-primary-200`
              : `btn-${uid}`
            : '',
          variantStyles[variant],
          variant === 'icon' ? iconPadding : 'px-4 py-2',
          className ?? '',
        )}
        {...props}
      >
        {variant === 'icon' && icon ? (
          <span className="flex items-center justify-center size-5">
            {icon}
          </span>
        ) : (
          children
        )}
      </Element>
    </>
  );
}
