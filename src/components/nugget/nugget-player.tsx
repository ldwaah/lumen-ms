"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/markdown-content";
import { captureEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Question = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type Props = {
  nuggetId: string;
  title: string;
  content: string;
  durationMin: number;
  questions: Question[];
  previousScore?: number | null;
  programTitle?: string;
};

export function NuggetPlayer({
  nuggetId,
  title,
  content,
  durationMin,
  questions,
  previousScore,
  programTitle,
}: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<"learn" | "quiz" | "done">("learn");
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    xp: number;
    streak: number;
  } | null>(null);

  const current = questions[qIndex];

  useEffect(() => {
    captureEvent("program_step_started", {
      step_title: title,
      program_title: programTitle ?? null,
    });
  }, [nuggetId, title, programTitle]);

  function handleCheck() {
    if (selected === null || !current) return;
    setRevealed(true);
    if (selected === current.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  }

  async function submitCompletion(finalCorrect: number) {
    const scorePct = Math.round((finalCorrect / questions.length) * 100);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/nuggets/${nuggetId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: scorePct, minutesStudied: durationMin }),
      });
      const data = await res.json();
      setResult({
        score: scorePct,
        xp: data.xp ?? 0,
        streak: data.currentStreak ?? 1,
      });
      captureEvent("program_step_completed", {
        step_title: title,
        program_title: programTitle ?? null,
      });
      setPhase("done");
    } finally {
      setSubmitting(false);
    }
  }

  function handleNext() {
    if (qIndex < questions.length - 1) {
      setQIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      submitCompletion(correctCount);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <AnimatePresence mode="wait">
        {phase === "learn" && (
          <motion.section
            key="learn"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass rounded-3xl p-6 md:p-8"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Micro-lesson · {durationMin} min
            </p>
            <h1 className="mt-2 text-2xl font-bold text-white">{title}</h1>
            {previousScore != null && (
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                Previous best: {previousScore}%
              </p>
            )}
            <div className="mt-6">
              <MarkdownContent content={content} />
            </div>
            <Button className="mt-8 w-full" size="lg" onClick={() => setPhase("quiz")}>
              Check your understanding
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.section>
        )}

        {phase === "quiz" && current && (
          <motion.section
            key={`q-${qIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass rounded-3xl p-6 md:p-8"
          >
            <p className="text-sm text-[var(--color-fg-muted)]">
              Question {qIndex + 1} of {questions.length}
            </p>
            <h2 className="mt-3 text-xl font-semibold text-white">{current.prompt}</h2>
            <ul className="mt-6 space-y-3">
              {current.options.map((opt, idx) => {
                const isSelected = selected === idx;
                const isCorrect = idx === current.correctIndex;
                let style = "border-white/10 bg-white/5 hover:bg-white/10";
                if (revealed && isCorrect)
                  style = "border-[var(--color-success)] bg-[var(--color-success)]/15";
                else if (revealed && isSelected && !isCorrect)
                  style = "border-[var(--color-danger)] bg-[var(--color-danger)]/15";
                else if (isSelected)
                  style = "border-[var(--color-primary)] bg-[var(--color-primary)]/15";

                return (
                  <li key={idx}>
                    <button
                      type="button"
                      disabled={revealed}
                      onClick={() => setSelected(idx)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all",
                        style,
                      )}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-white">{opt}</span>
                      {revealed && isCorrect && (
                        <CheckCircle2 className="ml-auto h-5 w-5 text-[var(--color-success)]" />
                      )}
                      {revealed && isSelected && !isCorrect && (
                        <XCircle className="ml-auto h-5 w-5 text-[var(--color-danger)]" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {revealed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 rounded-xl bg-white/5 px-4 py-3 text-sm text-[var(--color-fg-muted)]"
              >
                {current.explanation}
              </motion.p>
            )}

            <div className="mt-6">
              {!revealed ? (
                <Button className="w-full" disabled={selected === null} onClick={handleCheck}>
                  Check answer
                </Button>
              ) : (
                <Button className="w-full" onClick={handleNext} disabled={submitting}>
                  {qIndex < questions.length - 1 ? "Next question" : "Finish nugget"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.section>
        )}

        {phase === "done" && result && (
          <motion.section
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-8 text-center"
          >
            <Sparkles className="mx-auto h-12 w-12 text-[var(--color-warning)]" />
            <h2 className="mt-4 text-2xl font-bold text-white">Nugget complete!</h2>
            <p className="mt-2 text-5xl font-bold text-[var(--color-primary)]">{result.score}%</p>
            <p className="mt-2 text-[var(--color-fg-muted)]">
              +{result.xp} XP · {result.streak} day streak
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button variant="secondary" onClick={() => router.push("/learn")}>
                Back to path
              </Button>
              <Button onClick={() => router.push("/courses")}>Browse courses</Button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
