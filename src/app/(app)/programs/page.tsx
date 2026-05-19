import Link from "next/link";
import { auth } from "@/lib/auth";
import { getSubjectsWithCourses } from "@/lib/data";
import { prisma } from "@/lib/db";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Heart, Leaf } from "lucide-react";
import { SafetyFooter } from "@/components/layout/safety-footer";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  heart: Heart,
  leaf: Leaf,
  calculator: Heart,
};

export default async function ProgramsPage() {
  const session = await auth();
  const userId = session!.user!.id;
  const subjects = await getSubjectsWithCourses();

  const progress = await prisma.nuggetProgress.findMany({
    where: { userId, completed: true },
    include: { nugget: true },
  });
  const completedIds = new Set(progress.map((p) => p.nuggetId));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-white">MS Programs</h1>
        <p className="mt-1 text-[var(--color-fg-muted)]">
          Bite-sized education to help you navigate life with MS.
        </p>
      </header>
      {subjects.map((subject) => {
        const Icon = iconMap[subject.icon] ?? Heart;

        return (
          <section key={subject.id}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
              {subject.name}
            </h2>
            <ul className="space-y-3">
              {subject.courses.map((course) => {
                const cIds = course.nuggets.map((n) => n.id);
                const cDone = cIds.filter((id) => completedIds.has(id)).length;
                const cTotal = cIds.length;
                const cPct = cTotal ? Math.round((cDone / cTotal) * 100) : 0;

                return (
                  <li key={course.id}>
                    <Link
                      href={`/programs/${course.id}`}
                      className="glass flex gap-4 rounded-2xl p-4 transition hover:brightness-110"
                    >
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                        style={{
                          background: `linear-gradient(135deg, ${subject.color}44, ${subject.color}88)`,
                        }}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-white">{course.title}</h3>
                        <p className="mt-1 line-clamp-2 text-xs text-[var(--color-fg-muted)]">
                          {course.description}
                        </p>
                        <div className="mt-3">
                          <p className="text-[10px] uppercase text-[var(--color-fg-subtle)]">
                            {cDone}/{cTotal} steps · {cPct}%
                          </p>
                          <ProgressBar value={cPct} className="mt-1" />
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      <SafetyFooter />
    </div>
  );
}
