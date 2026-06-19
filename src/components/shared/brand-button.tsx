import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const brandButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-rose text-cream shadow-soft hover:bg-rose/90 active:bg-rose/95",
        secondary:
          "border border-rose bg-transparent text-rose hover:bg-rose/10 active:bg-rose/15",
        ghost: "bg-transparent text-rose hover:bg-rose/10 active:bg-rose/15",
      },
      size: {
        default: "h-10 gap-2 px-5 py-2",
        sm: "h-9 gap-1.5 px-3 text-xs",
        lg: "h-12 gap-2 px-8 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface BrandButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof brandButtonVariants> {
  asChild?: boolean;
}

export function BrandButton({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: BrandButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      className={cn(brandButtonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
