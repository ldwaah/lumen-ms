import { cn } from "@/lib/utils";

interface Props {
  size?: number;
  className?: string;
  showWordmark?: boolean;
}

export function Logo({ size = 32, className, showWordmark = true }: Props) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="lumen-grad" x1="0" y1="0" x2="40" y2="40">
            <stop stopColor="#3DA9FF" />
            <stop offset="0.5" stopColor="#A98BFF" />
            <stop offset="1" stopColor="#FF7BB5" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="18" stroke="url(#lumen-grad)" strokeWidth="2.5" />
        <circle cx="20" cy="20" r="6" fill="url(#lumen-grad)" />
        <circle cx="20" cy="6" r="2" fill="#3DA9FF" />
        <circle cx="34" cy="20" r="2" fill="#4EE066" />
        <circle cx="20" cy="34" r="2" fill="#FF7BB5" />
        <circle cx="6" cy="20" r="2" fill="#A98BFF" />
      </svg>
      {showWordmark && (
        <span className="font-bold text-lg tracking-tight text-white">
          Lumen
        </span>
      )}
    </span>
  );
}
