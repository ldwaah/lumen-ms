import { auth } from "@/lib/auth";
import { getGreeting } from "@/lib/utils";
import { getSubjectMastery, getUserStats } from "@/lib/data";
import { ActivityChart } from "@/components/progress/activity-chart";
import { StreakCalendar } from "@/components/progress/streak-calendar";
import { format, subDays, startOfDay } from "date-fns";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Clock, RotateCcw } from "lucide-react";

export default async function ProgressPage() {
  const session = await auth();
  const userId = session!.user!.id;
  const [user, mastery] = await Promise.all([
    getUserStats(userId),
    getSubjectMastery(userId),
  ]);

  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = startOfDay(subDays(new Date(), 29 - i));
    const log = user?.activities.find((a) => format(a.date, "yyyy-MM-dd") === format(d, "yyyy-MM-dd"));
    return {
      label: format(d, "d"),
      nuggets: log?.nuggetsCompleted ?? 0,
      xp: log?.xpEarned ?? 0,
    };
  });

  const activeDates = (user?.activities ?? [])
    .filter((a) => a.nuggetsCompleted > 0)
    .map((a) => a.date);

  const totalMinutes = (user?.activities ?? []).reduce((s, a) => s + a.minutesStudied, 0);
  const totalNuggets = (user?.progress ?? []).length;

  return (
    <div className="theme-light -mx-4 min-h-[calc(100vh-6rem)] bg-[#f5f4f0] px-4 py-6 md:-mx-8 md:rounded-3xl md:px-8">
      <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>

      <section className="mt-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">{getGreeting(user?.name ?? "Learner")}</h2>
        <p className="mt-2 text-sm text-gray-600">
          Just a few minutes of studying is enough to refresh your memory. Little and often is the name of the game.
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900">My learning activity</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-[#4DA6FF]/10 p-4">
            <RotateCcw className="h-8 w-8 text-[#4DA6FF]" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalNuggets}</p>
              <p className="text-xs text-gray-600">Nuggets completed</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
            <Clock className="h-8 w-8 text-gray-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalMinutes}m</p>
              <p className="text-xs text-gray-600">Time spent studying</p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <ActivityChart data={last30} />
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900">Subject mastery</h3>
        <ul className="mt-4 space-y-4">
          {mastery.map((s) => (
            <li key={s.id}>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-800">{s.name}</span>
                <span className="text-gray-500">{s.completed}/{s.total} nuggets</span>
              </div>
              <ProgressBar value={s.mastery} className="mt-2 !bg-gray-200" />
              {s.avgScore > 0 && (
                <p className="mt-1 text-xs text-gray-500">Average score: {s.avgScore}%</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900">Active days</h3>
        <div className="mt-4">
          <StreakCalendar activeDates={activeDates} />
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Current streak: <strong>{user?.currentStreak ?? 0}</strong> days · Longest:{" "}
          <strong>{user?.longestStreak ?? 0}</strong> days · Total XP: <strong>{user?.xp ?? 0}</strong>
        </p>
      </section>
    </div>
  );
}
