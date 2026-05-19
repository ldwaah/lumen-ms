import Link from "next/link";
import { auth } from "@/lib/auth";
import { getGreeting } from "@/lib/utils";
import {
  getContinueNugget,
  getRecommendedNuggets,
  getUserStats,
} from "@/lib/data";
import { StreakWidget } from "@/components/dashboard/streak-widget";
import { Badge } from "@/components/ui/Badge";
import { ChevronRight, Sparkles } from "lucide-react";

export default async function LearnPage() {
  const session = await auth();
  const userId = session!.user!.id;
  const [user, continueNugget, recommended] = await Promise.all([
    getUserStats(userId),
    getContinueNugget(userId),
    getRecommendedNuggets(userId, 4),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          {getGreeting(user?.name ?? "Learner")}
        </h1>
        <p className="mt-1 text-[var(--color-fg-muted)]">
          Little and often is the name of the game — a few minutes keeps knowledge fresh.
        </p>
      </header>

      <StreakWidget streak={user?.currentStreak ?? 0} xp={user?.xp ?? 0} />

      {continueNugget && (
        <section className="glass rounded-3xl p-6">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Badge tone="info">Continue learning</Badge>
              <h2 className="mt-3 text-xl font-semibold text-white">{continueNugget.title}</h2>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                {continueNugget.course.subject.name} · {continueNugget.course.title}
              </p>
            </div>
          </div>
          <Link
            href={`/nuggets/${continueNugget.id}`}
            className="mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-8 text-base font-semibold text-[#0a1024] sm:w-auto"
          >
            Resume nugget <ChevronRight className="h-4 w-4" />
          </Link>
        </section>
      )}

      <section className="glass rounded-3xl p-6">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[var(--color-violet)]" />
          <h2 className="text-lg font-semibold text-white">Recommended for you</h2>
        </div>
        {recommended.length === 0 ? (
          <p className="text-sm text-[var(--color-fg-muted)]">You have completed all available nuggets. Great work!</p>
        ) : (
          <ul className="space-y-3">
            {recommended.map((n) => (
              <li key={n.id}>
                <Link
                  href={`/nuggets/${n.id}`}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10"
                >
                  <div>
                    <p className="font-medium text-white">{n.title}</p>
                    <p className="text-xs text-[var(--color-fg-subtle)]">{n.course.subject.name} · ~{n.durationMin} min</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/40" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="glass rounded-3xl p-6">
        <h2 className="text-lg font-semibold text-white">Focus & stretch</h2>
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
          Complete more nuggets to unlock personalised focus areas and stretch challenges powered by your learning data.
        </p>
      </section>
    </div>
  );
}
