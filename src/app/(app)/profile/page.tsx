import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { User, Mail, Flame, LogOut } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user!.id },
  });

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
            <p className="font-semibold text-white">My streak</p>
            <p className="text-sm text-[var(--color-fg-muted)]">
              {user?.currentStreak ?? 0} day current · {user?.longestStreak ?? 0} day best
            </p>
          </div>
        </div>
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
    </div>
  );
}
