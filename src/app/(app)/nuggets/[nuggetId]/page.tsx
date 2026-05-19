import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getNuggetForPlayer } from "@/lib/data";
import { NuggetPlayer } from "@/components/nugget/nugget-player";
import { ChevronLeft } from "lucide-react";

export default async function NuggetPage({
  params,
}: {
  params: Promise<{ nuggetId: string }>;
}) {
  const { nuggetId } = await params;
  const session = await auth();
  const nugget = await getNuggetForPlayer(nuggetId, session!.user!.id);
  if (!nugget) notFound();

  const questions = nugget.questions.map((q) => ({
    id: q.id,
    prompt: q.prompt,
    options: JSON.parse(q.options) as string[],
    correctIndex: q.correctIndex,
    explanation: q.explanation,
  }));

  return (
    <div>
      <Link href={`/courses/${nugget.courseId}`} className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--color-fg-muted)] hover:text-white">
        <ChevronLeft className="h-4 w-4" /> {nugget.course.title}
      </Link>
      <NuggetPlayer
        nuggetId={nugget.id}
        title={nugget.title}
        content={nugget.content}
        durationMin={nugget.durationMin}
        questions={questions}
        previousScore={nugget.progress[0]?.score ?? null}
      />
    </div>
  );
}
