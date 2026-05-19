import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { signOut } from "@/lib/auth";
import { getMSProfile } from "@/lib/ms-data";
import { updateMSProfile } from "@/app/actions/ms";
import { Button } from "@/components/ui/button";
import { MS_TYPES } from "@/lib/ms-types";
import { SafetyFooter } from "@/components/layout/safety-footer";
import { User, Mail, Flame, LogOut } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();
  const userId = session!.user!.id;
  const [user, profile] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    getMSProfile(userId),
  ]);

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-bold text-white">Profile</h1>

      <section className="glass rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <User className="h-8 w-8 text-white/70" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{user?.name}</p>
            <p className="flex items-center gap-1 text-sm text-[var(--color-fg-muted)]">
              <Mail className="h-3 w-3" /> {user?.email}
            </p>
          </div>
        </div>
      </section>

      <section className="glass rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <Flame className="h-5 w-5 text-[var(--color-warning)]" />
          <div>
            <p className="font-semibold text-white">Activity streak</p>
            <p className="text-sm text-[var(--color-fg-muted)]">
              {user?.currentStreak ?? 0} day current · {user?.longestStreak ?? 0}{" "}
              day best
            </p>
          </div>
        </div>
      </section>

      <section className="glass rounded-2xl p-5">
        <h2 className="mb-4 font-semibold text-white">MS profile</h2>
        <form action={updateMSProfile} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-white">MS type</label>
            <select
              name="msType"
              defaultValue={profile?.msType ?? "Unsure"}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
            >
              {MS_TYPES.map((t) => (
                <option key={t} value={t} className="bg-[#1a2548]">
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-white">Current DMT</label>
            <input
              name="currentDMT"
              defaultValue={profile?.currentDMT ?? ""}
              placeholder="e.g. Ocrevus"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
            />
          </div>
          <label className="flex items-center gap-3 text-sm text-white">
            <input
              type="checkbox"
              name="lowEnergyMode"
              defaultChecked={profile?.lowEnergyMode}
              className="h-5 w-5"
            />
            Low energy mode
          </label>
          <label className="flex items-center gap-3 text-sm text-white">
            <input
              type="checkbox"
              name="largeText"
              defaultChecked={profile?.largeText}
              className="h-5 w-5"
            />
            Larger text
          </label>
          <label className="flex items-center gap-3 text-sm text-white">
            <input
              type="checkbox"
              name="highContrast"
              defaultChecked={profile?.highContrast}
              className="h-5 w-5"
            />
            High contrast
          </label>
          <Button type="submit" className="w-full">
            Save preferences
          </Button>
        </form>
      </section>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <Button type="submit" variant="outline" className="w-full">
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </form>

      <SafetyFooter />
    </div>
  );
}
