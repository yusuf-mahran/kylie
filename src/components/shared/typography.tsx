import { cn } from "@/lib/utils";

const headingSizes = {
  xl: "text-2xl md:text-3xl",
  "2xl": "text-3xl md:text-4xl",
  "3xl": "text-4xl md:text-5xl",
  "4xl": "text-5xl md:text-6xl",
};

export function Heading({
  children,
  className,
  as: Component = "h1",
  size = "2xl",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4";
  size?: keyof typeof headingSizes;
}) {
  return (
    <Component
      className={cn(
        "font-heading font-extrabold tracking-tight text-foreground",
        headingSizes[size],
        className
      )}
    >
      {children}
    </Component>
  );
}

const subheadingSizes = {
  lg: "text-xl md:text-2xl",
  xl: "text-2xl md:text-3xl",
  "2xl": "text-3xl md:text-4xl",
};

export function Subheading({
  children,
  className,
  as: Component = "h2",
  size = "lg",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "h3" | "h4";
  size?: keyof typeof subheadingSizes;
}) {
  return (
    <Component
      className={cn(
        "font-heading font-bold tracking-tight text-foreground",
        subheadingSizes[size],
        className
      )}
    >
      {children}
    </Component>
  );
}

const bodySizes = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
};

export function BodyText({
  children,
  className,
  size = "base",
  muted = false,
}: {
  children: React.ReactNode;
  className?: string;
  size?: keyof typeof bodySizes;
  muted?: boolean;
}) {
  return (
    <p
      className={cn(
        "font-sans leading-relaxed",
        bodySizes[size],
        muted ? "text-muted-foreground" : "text-foreground",
        className
      )}
    >
      {children}
    </p>
  );
}

export function Caption({
  children,
  className,
  muted = false,
}: {
  children: React.ReactNode;
  className?: string;
  muted?: boolean;
}) {
  return (
    <span
      className={cn(
        "font-sans text-sm",
        muted ? "text-muted-foreground" : "text-foreground",
        className
      )}
    >
      {children}
    </span>
  );
}
