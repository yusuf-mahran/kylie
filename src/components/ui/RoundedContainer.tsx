import { ComponentPropsWithoutRef } from 'react';

type ImgProps = ComponentPropsWithoutRef<'div'> & {
  width?: number | string;
  height?: number | string;
  className?: string;
};

export default function RoundedContainer({
  width = '100%',
  height = '100%',
  className,
  children,
  ...props
}: ImgProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-default ${className ?? ''}`.trim()}
      style={{ width, height }}
      {...props}
    >
      {children}
    </div>
  );
}
