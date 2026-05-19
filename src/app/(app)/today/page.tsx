import Link from "next/link";
import { auth } from "@/lib/auth";
import { getGreeting } from "@/lib/utils";
import { getUserStats, getContinueNugget } from "@/lib/data";
import { getMSProfile, getTodayCheckIn } from "@/lib/ms-data";
import { CheckInForm } from "@/components/today/check-in-form";
import { StreakWidget } from "@/components/dashboard/streak-widget";
import { SafetyFooter } from "@/components/layout/safety-footer";
import { Badge } from "@/components/ui/Badge";
import { ChevronRight, MessageCircle, Sparkles } from "lucide-react";
import { COACH_QUICK_PROMPTS } from "@/lib/ms-types";
import { redirect } from "next/navigation";

export default async function TodayPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const [profile, user, continueNugget, todayCheckIn] = await Promise.all([
    getMSProfile(userId),
    getUserStats(userId),
    getContinueNugget(userId),
    getTodayCheckIn(userId),
  ]);

  if (!profile?.onboardingDone) {
    redirect("/onboarding");
  }

  const lowEnergy = profile.lowEnergyMode;

  return (
    <div className={`space-y-6 ${profile.largeText ? "text-lg" : ""}`}>
      <header>
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          {getGreeting(user?.name ?? "friend")}
        </h1>
        <p className="mt-1 text-[var(--color-fg-muted)]">
          Navigate MS with clarity — one small step at a time.
        </p>
      </header>

      {!lowEnergy && (
        <StreakWidget streak={user?.currentStreak ?? 0} xp={user?.xp ?? 0} />
      )}

      <section className="glass rounded-3xl p-6">
        <Badge tone="info">
          {todayCheckIn ? "Today's check-in ✓" : "Daily check-in"}
        </Badge>
        <p className="mt-2 mb-4 text-sm text-[var(--color-fg-muted)]">
          30 seconds — track how you&apos;re feeling today.
        </p>
        {!todayCheckIn ? (
          <CheckInForm />
        ) : (
          <div>
            <p className="text-sm text-white">
              Energy {todayCheckIn.energy}/10 · Mood {todayCheckIn.mood}/10 · Pain{" "}
              {todayCheckIn.pain}/10
            </p>
            <Link
              href="/track"
              className="mt-3 inline-block text-sm text-[var(--color-primary)]"
            >
              Update in tracker →
            </Link>
          </div>
        )}
      </section>

      {!lowEnergy && continueNugget && (
        <section className="glass rounded-3xl p-6">
          <Badge tone="info">Continue program</Badge>
          <h2 className="mt-3 text-xl font-semibold text-white">
            {continueNugget.title}
          </h2>
          <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
            {continueNugget.course.subject.name} · {continueNugget.course.title}
          </p>
          <Link
            href={`/programs/steps/${continueNugget.id}`}
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-8 text-base font-semibold text-[#0a1024] sm:w-auto"
          >
            Continue <ChevronRight className="h-4 w-4" />
          </Link>
        </section>
      )}

      <section className="glass rounded-3xl p-6">
        <div className="mb-4 flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-[var(--color-violet)]" />
          <h2 className="text-lg font-semibold text-white">AI Coach</h2>
        </div>
        <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
          Your daily coaching companion — not medical advice.
        </p>
        <div className="flex flex-wrap gap-2">
          {COACH_QUICK_PROMPTS.slice(0, lowEnergy ? 2 : 4).map((p) => (
            <Link
              key={p}
              href={`/coach?q=${encodeURIComponent(p)}`}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-white/10"
            >
              {p}
            </Link>
          ))}
        </div>
        <Link
          href="/coach"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)]"
        >
          Open coach chat <ChevronRight className="h-4 w-4" />
        </Link>
      </section>

      {!lowEnergy && (
        <section className="glass rounded-3xl p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--color-violet)]" />
            <h2 className="text-lg font-semibold text-white">Today&apos;s micro-action</h2>
          </div>
          <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
            Take one small step: complete your check-in, read one program step, or
            message your coach. Every action counts.
          </p>
        </section>
      )}

      <SafetyFooter />
    </div>
  );
}
