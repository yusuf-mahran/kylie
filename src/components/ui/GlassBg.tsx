import clsx from 'clsx';

type GlassBgProps = {
  width?: string;
  height?: string;
};

export default function GlassBg({
  width = 'w-full',
  height = 'h-full',
}: GlassBgProps) {
  return (
    <div
      className={clsx(
        'absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-background/70 backdrop-blur-3xl -z-10',
        width,
        height,
      )}
    />
  );
}
