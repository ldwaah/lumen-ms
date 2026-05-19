import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCourseWithNuggets } from "@/lib/data";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await auth();
  const course = await getCourseWithNuggets(courseId, session!.user!.id);
  if (!course) notFound();

  const total = course.nuggets.length;
  const done = course.nuggets.filter((n) => n.progress[0]?.completed).length;
  const completion = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <Link
        href="/programs"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-fg-muted)] hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" /> Programs
      </Link>
      <h1 className="text-2xl font-bold text-white">{course.title}</h1>
      <p className="text-sm text-[var(--color-fg-muted)]">{course.subject.name}</p>
      {course.description && (
        <p className="text-sm text-[var(--color-fg-muted)]">{course.description}</p>
      )}

      <section className="glass rounded-2xl p-5">
        <div className="flex items-center gap-6">
          <ProgressRing value={completion} size={80}>
            {completion === 100 ? (
              <Check className="h-6 w-6 text-[var(--color-primary)]" />
            ) : (
              <span className="text-sm font-bold text-white">{completion}%</span>
            )}
          </ProgressRing>
          <div>
            <p className="text-xs uppercase text-[var(--color-fg-subtle)]">Progress</p>
            <p className="text-2xl font-bold text-white">
              {done}/{total} steps
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">Program steps</h2>
        <ul className="space-y-2">
          {course.nuggets.map((n) => {
            const p = n.progress[0];
            const doneN = p?.completed;
            return (
              <li key={n.id}>
                <Link
                  href={`/programs/steps/${n.id}`}
                  className="glass flex items-center justify-between rounded-xl px-4 py-3 transition hover:bg-white/10"
                >
                  <div>
                    <p className="font-medium text-white">{n.title}</p>
                    <p className="text-xs text-[var(--color-fg-subtle)]">
                      ~{n.durationMin} min · {n._count.questions} reflection questions
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {doneN && <Check className="h-4 w-4 text-[var(--color-success)]" />}
                    <ChevronRight className="h-4 w-4 text-white/40" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
