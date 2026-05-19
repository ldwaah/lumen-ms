"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Gauge,
  User,
  LogOut,
  Flame,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { signOutAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

interface Props {
  user: { name: string; xp: number; currentStreak: number };
}

const links = [
  { href: "/learn", label: "My Path", icon: LayoutDashboard },
  { href: "/learn/catalogue", label: "Courses", icon: BookOpen },
  { href: "/learn/progress", label: "Progress", icon: Gauge },
  { href: "/learn/profile", label: "Profile", icon: User },
];

export function LearnNav({ user }: Props) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col p-5 border-r border-white/8 bg-[var(--color-bg-soft)]/80 backdrop-blur-md z-40">
        <Link href="/learn" className="mb-8 inline-flex">
          <Logo />
        </Link>

        <div className="mb-6 rounded-2xl p-4 bg-gradient-to-br from-[var(--color-primary)]/15 to-[var(--color-violet)]/15 border border-white/8">
          <div className="text-xs uppercase tracking-widest text-white/55 mb-1">
            Today
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{user.xp}</span>
            <span className="text-sm text-white/65">XP</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-sm text-[#ffd084]">
            <Flame className="h-4 w-4" />
            <span className="font-semibold">{user.currentStreak}</span>
            <span className="text-white/55 text-xs">day streak</span>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {links.map((l) => {
            const active =
              pathname === l.href ||
              (l.href !== "/learn" && pathname.startsWith(l.href));
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-[var(--color-primary)]/20 text-white border border-[var(--color-primary)]/30"
                    : "text-white/70 hover:text-white hover:bg-white/8",
                )}
              >
                <Icon className="h-4.5 w-4.5" />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-white/55 hover:text-white hover:bg-white/8 transition-all"
          >
            <LogOut className="h-4.5 w-4.5" />
            Sign out
          </button>
        </form>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-bg-soft)]/95 backdrop-blur-md border-t border-white/8 px-2 py-1.5 grid grid-cols-4 gap-1">
        {links.map((l) => {
          const active =
            pathname === l.href ||
            (l.href !== "/learn" && pathname.startsWith(l.href));
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 rounded-xl text-[10px] font-medium transition-all",
                active
                  ? "bg-[var(--color-primary)]/20 text-white"
                  : "text-white/55",
              )}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              {l.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
