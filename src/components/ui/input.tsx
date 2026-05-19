import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-11 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white shadow-sm transition-colors placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";
