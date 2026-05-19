import { Flame, Zap } from "lucide-react";

export function StreakWidget({ streak, xp, target = 5 }: { streak: number; xp: number; target?: number }) {
  const pct = Math.min(100, (streak / target) * 100);
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-warning)]/20">
            <Flame className="h-6 w-6 text-[var(--color-warning)]" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--color-fg-subtle)]">My streak</p>
            <p className="text-2xl font-bold text-white">{streak}<span className="text-base font-normal text-white/50">/{target}</span></p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-[var(--color-fg-subtle)]">Total XP</p>
          <p className="flex items-center justify-end gap-1 text-2xl font-bold text-[var(--color-primary)]">
            <Zap className="h-5 w-5" />{xp}
          </p>
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-[var(--color-primary)] transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
