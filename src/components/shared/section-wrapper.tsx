import { cn } from "@/lib/utils";

export function SectionWrapper({
  children,
  className,
  padded = true,
  contained = true,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
  contained?: boolean;
}) {
  return (
    <section
      className={cn(
        contained && "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
        padded && "py-12 md:py-16 lg:py-20",
        className
      )}
    >
      {children}
    </section>
  );
}
