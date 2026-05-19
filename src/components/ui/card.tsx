import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  glow = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { glow?: boolean }) {
  return (
    <div
      className={cn(
        "glass rounded-3xl p-6 relative overflow-hidden",
        glow &&
          "before:content-[''] before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-[var(--color-primary)]/15 before:via-transparent before:to-[var(--color-violet)]/10 before:pointer-events-none",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between mb-4", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold tracking-tight text-white",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-[var(--color-fg-muted)]", className)}
      {...props}
    />
  );
}
