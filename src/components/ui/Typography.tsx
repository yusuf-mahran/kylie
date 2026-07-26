import { ReactNode, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline';

type TypographyElement =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'div';

const variantStyles: Record<TypographyVariant, string> = {
  h1: 'text-5xl font-bold leading-tight tracking-tight',
  h2: 'text-4xl font-bold leading-tight tracking-tight',
  h3: 'text-3xl font-semibold leading-snug tracking-tight',
  h4: 'text-2xl font-semibold leading-snug',
  h5: 'text-xl font-semibold leading-normal',
  h6: 'text-lg font-semibold leading-normal',
  subtitle1: 'text-lg font-medium leading-relaxed',
  subtitle2: 'text-base font-medium leading-relaxed',
  body1: 'text-base font-normal leading-relaxed',
  body2: 'text-sm font-normal leading-relaxed',
  caption: 'text-xs font-normal leading-tight',
  overline: 'text-xs font-bold leading-tight uppercase tracking-wider',
};

const elementMap: Record<TypographyVariant, TypographyElement> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'p',
  subtitle2: 'p',
  body1: 'p',
  body2: 'p',
  caption: 'span',
  overline: 'span',
};

interface TypographyProps {
  variant?: TypographyVariant;
  children: ReactNode;
  className?: string;
  as?: TypographyElement;
  style?: CSSProperties;
}

export const Typography = ({
  variant = 'body1',
  children,
  className,
  as,
  style,
}: TypographyProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Element = (as || elementMap[variant]) as any;
  const baseStyles = variantStyles[variant];

  return (
    <Element className={cn(baseStyles, className)} style={style}>
      {children}
    </Element>
  );
};

// Preset components for convenience
export const H1 = ({
  children,
  className,
  ...props
}: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h1" className={className} {...props}>
    {children}
  </Typography>
);

export const H2 = ({
  children,
  className,
  ...props
}: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h2" className={className} {...props}>
    {children}
  </Typography>
);

export const H3 = ({
  children,
  className,
  ...props
}: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h3" className={className} {...props}>
    {children}
  </Typography>
);

export const H4 = ({
  children,
  className,
  ...props
}: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h4" className={className} {...props}>
    {children}
  </Typography>
);

export const H5 = ({
  children,
  className,
  ...props
}: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h5" className={className} {...props}>
    {children}
  </Typography>
);

export const H6 = ({
  children,
  className,
  ...props
}: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h6" className={className} {...props}>
    {children}
  </Typography>
);

export const Subtitle1 = ({
  children,
  className,
  ...props
}: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="subtitle1" className={className} {...props}>
    {children}
  </Typography>
);

export const Subtitle2 = ({
  children,
  className,
  ...props
}: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="subtitle2" className={className} {...props}>
    {children}
  </Typography>
);

export const Body1 = ({
  children,
  className,
  ...props
}: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="body1" className={className} {...props}>
    {children}
  </Typography>
);

export const Body2 = ({
  children,
  className,
  ...props
}: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="body2" className={className} {...props}>
    {children}
  </Typography>
);

export const Caption = ({
  children,
  className,
  ...props
}: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="caption" className={className} {...props}>
    {children}
  </Typography>
);

export const Overline = ({
  children,
  className,
  ...props
}: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="overline" className={className} {...props}>
    {children}
  </Typography>
);
