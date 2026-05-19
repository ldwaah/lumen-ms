import * as React from "react";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "default" | "success" | "warning" | "danger" | "info" | "violet";
}

export function Badge({ className, tone = "default", ...props }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide uppercase",
        tone === "default" && "bg-white/8 text-white/85",
        tone === "success" && "bg-[var(--color-success)]/14 text-[#7feb95]",
        tone === "warning" && "bg-[var(--color-warning)]/14 text-[#ffd084]",
        tone === "danger" && "bg-[var(--color-danger)]/14 text-[#ff97ad]",
        tone === "info" && "bg-[var(--color-primary)]/14 text-[#8acaff]",
        tone === "violet" && "bg-[var(--color-violet)]/14 text-[#cab8ff]",
        className,
      )}
      {...props}
    />
  );
}
