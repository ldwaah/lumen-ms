import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import * as React from "react";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-primary)] hover:bg-[#5cb8ff] active:bg-[#1f88e5] text-[#0a1024] shadow-[0_8px_30px_-12px_rgba(61,169,255,0.7)]",
        secondary:
          "bg-white/8 hover:bg-white/14 text-white border border-white/10",
        ghost: "bg-transparent hover:bg-white/8 text-white/90",
        danger:
          "bg-[var(--color-danger)] hover:bg-[#ff6786] text-white shadow-[0_8px_30px_-12px_rgba(240,76,110,0.6)]",
        success:
          "bg-[var(--color-success)] hover:bg-[#6ef07f] text-[#0a1024]",
        outline:
          "bg-transparent border border-white/15 hover:bg-white/8 text-white",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-14 px-8 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(button({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
