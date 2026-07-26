type FullBgProps = {
  className?: string;
};

export default function FullBg({ className }: FullBgProps) {
  return (
    <div
      className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-screen h-full -z-10 ${className}`}
    />
  );
}
