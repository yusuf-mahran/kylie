import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        new: "bg-gold text-foreground",
        offer: "bg-rose text-cream",
        bestSeller: "border border-gold bg-sand text-foreground",
      },
    },
    defaultVariants: {
      variant: "new",
    },
  }
);

export interface BrandBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function BrandBadge({ className, variant, ...props }: BrandBadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  );
}
