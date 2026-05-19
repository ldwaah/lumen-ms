"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Route,
  BookOpen,
  BarChart3,
  Menu,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/learn", label: "Path", icon: Route },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/profile", label: "More", icon: Menu },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#1a1f26] md:hidden">
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs transition-colors",
                active ? "text-white" : "text-white/50",
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-14 items-center justify-center rounded-lg transition-colors",
                  active && "bg-[var(--color-primary)]",
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="sr-only">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function SideNav() {
  const pathname = usePathname();

  const links = [
    { href: "/learn", label: "My Path", icon: Route },
    { href: "/courses", label: "My Courses", icon: BookOpen },
    { href: "/progress", label: "My Dashboard", icon: BarChart3 },
    { href: "/profile", label: "Profile", icon: GraduationCap },
  ];

  return (
    <aside className="hidden w-56 shrink-0 flex-col gap-1 border-r border-[var(--border)] bg-[var(--card)] p-4 md:flex">
      <Link href="/learn" className="mb-6 flex items-center gap-2 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e93d52] text-lg font-bold text-white">
          L
        </span>
        <div>
          <p className="text-sm font-bold tracking-wide text-[#e93d52]">
            LUMEN
          </p>
          <p className="text-[10px] uppercase tracking-widest text-[var(--muted-foreground)]">
            Learn brighter
          </p>
        </div>
      </Link>
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-[var(--color-primary)]/15 text-[var(--color-primary)]"
                : "text-[var(--color-fg-muted)] hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </aside>
  );
}
