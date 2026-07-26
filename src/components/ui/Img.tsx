import Image from 'next/image';
import type { ComponentPropsWithoutRef } from 'react';
import RoundedContainer from './RoundedContainer';

type ImgProps = Omit<ComponentPropsWithoutRef<typeof Image>, 'src' | 'alt'> & {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
};

const defaultSrc = '/imgs/girl-eating-strawberry-stockcake.jpg';

export default function Img({
  src = defaultSrc,
  alt = 'Image',
  width = 350,
  height = 450,
  className,
  ...props
}: ImgProps) {
  return (
    <RoundedContainer className={`group bg-neutral-200 ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 group-hover:rotate-3"
        {...props}
      />
    </RoundedContainer>
  );
}
