import { auth } from "@/lib/auth";
import { getRecentCheckIns, getTodayCheckIn, getMedications } from "@/lib/ms-data";
import { TrackerTabs } from "@/components/track/tracker-tabs";
import { SafetyFooter } from "@/components/layout/safety-footer";

export default async function TrackPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const [checkIns, todayCheckIn, medications] = await Promise.all([
    getRecentCheckIns(userId, 30),
    getTodayCheckIn(userId),
    getMedications(userId),
  ]);

  const chartData = checkIns.map((c) => ({
    date: c.date.toISOString(),
    energy: c.energy,
    mood: c.mood,
    pain: c.pain,
    brainFog: c.brainFog,
  }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Tracker</h1>
        <p className="mt-1 text-[var(--color-fg-muted)]">
          Log symptoms, medications, and relapses. Spot patterns over time.
        </p>
      </header>
      <div className="glass rounded-3xl p-6">
        <TrackerTabs
          checkIns={chartData}
          todayCheckIn={
            todayCheckIn
              ? {
                  date: todayCheckIn.date.toISOString(),
                  energy: todayCheckIn.energy,
                  mood: todayCheckIn.mood,
                  pain: todayCheckIn.pain,
                  brainFog: todayCheckIn.brainFog,
                }
              : null
          }
          medications={medications}
        />
      </div>
      <SafetyFooter />
    </div>
  );
}
