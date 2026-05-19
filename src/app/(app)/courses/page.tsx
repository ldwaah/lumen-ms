import Link from "next/link";
import { auth } from "@/lib/auth";
import { getSubjectsWithCourses } from "@/lib/data";
import { prisma } from "@/lib/db";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Calculator, Leaf } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  calculator: Calculator,
  leaf: Leaf,
};

export default async function CoursesPage() {
  const session = await auth();
  const userId = session!.user!.id;
  const subjects = await getSubjectsWithCourses();

  const progress = await prisma.nuggetProgress.findMany({
    where: { userId, completed: true },
    include: { nugget: true },
  });
  const completedIds = new Set(progress.map((p) => p.nuggetId));
  const scores = progress.filter((p) => p.score != null);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">My Courses</h1>
      {subjects.map((subject) => {
        const Icon = iconMap[subject.icon] ?? Calculator;

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
                const cScores = scores.filter((p) => cIds.includes(p.nuggetId));
                const cAvg =
                  cScores.length > 0
                    ? Math.round(cScores.reduce((a, p) => a + (p.score ?? 0), 0) / cScores.length)
                    : 0;

                return (
                  <li key={course.id}>
                    <Link href={`/courses/${course.id}`} className="glass flex gap-4 rounded-2xl p-4 transition hover:brightness-110">
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                        style={{ background: `linear-gradient(135deg, ${subject.color}44, ${subject.color}88)` }}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-white">{course.title}</h3>
                        <p className="mt-1 line-clamp-1 text-xs text-[var(--color-fg-muted)]">{course.description}</p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          <div>
                            <p className="text-[10px] uppercase text-[var(--color-fg-subtle)]">Completion {cPct}%</p>
                            <ProgressBar value={cPct} className="mt-1" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase text-[var(--color-fg-subtle)]">Avg score {cAvg}%</p>
                            <ProgressBar value={cAvg} color="green" className="mt-1" />
                          </div>
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
    </div>
  );
}
