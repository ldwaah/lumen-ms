import { auth } from "@/lib/auth";
import { getCoaches, getUserSessions } from "@/lib/ms-data";
import { Badge } from "@/components/ui/Badge";
import { Calendar, ExternalLink } from "lucide-react";
import { SafetyFooter } from "@/components/layout/safety-footer";

export default async function SessionsPage() {
  const session = await auth();
  const userId = session!.user!.id;
  const [coaches, sessions] = await Promise.all([
    getCoaches(),
    getUserSessions(userId),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Human coach sessions</h1>
        <p className="mt-1 text-[var(--color-fg-muted)]">
          Book time with certified MS coaches, nurses, and specialists.
        </p>
        <Badge tone="info" className="mt-2">
          Phase 2 — Cal.com booking integration
        </Badge>
      </header>

      {sessions.length > 0 && (
        <section className="glass rounded-3xl p-6">
          <h2 className="mb-4 font-semibold text-white">Upcoming sessions</h2>
          <ul className="space-y-3">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <p className="font-medium text-white">{s.coach.name}</p>
                <p className="text-xs text-[var(--color-fg-muted)]">
                  {s.scheduledAt.toLocaleString("en-GB")} · {s.status}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">Coach directory</h2>
        <ul className="space-y-3">
          {coaches.map((coach) => {
            const specialties = JSON.parse(coach.specialties || "[]") as string[];
            return (
              <li key={coach.id} className="glass rounded-2xl p-5">
                <p className="font-semibold text-white">{coach.name}</p>
                <p className="text-sm text-[var(--color-primary)]">{coach.title}</p>
                {coach.bio && (
                  <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{coach.bio}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-1">
                  {specialties.map((s: string) => (
                    <span
                      key={s}
                      className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                {coach.calComUrl && (
                  <a
                    href={coach.calComUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[#0a1024]"
                  >
                    <Calendar className="h-4 w-4" />
                    Book via Cal.com
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <p className="text-xs text-[var(--color-fg-subtle)]">
        Video sessions powered by Daily.co (coming soon). Payments via Stripe (coming soon).
      </p>
      <SafetyFooter />
    </div>
  );
}
