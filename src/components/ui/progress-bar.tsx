import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  color = "blue",
  className,
}: {
  value: number;
  color?: "blue" | "green";
  className?: string;
}) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-black/20", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500",
          color === "green" ? "bg-[var(--color-success)]" : "bg-[var(--color-primary)]",
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
