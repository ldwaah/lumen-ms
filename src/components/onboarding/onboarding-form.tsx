"use client";

import { useState } from "react";
import { saveOnboarding } from "@/app/actions/ms";
import { MS_TYPES, GOAL_SUGGESTIONS } from "@/lib/ms-types";
import { Button } from "@/components/ui/button";

export function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  function toggleGoal(goal: string) {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal],
    );
  }

  return (
    <form action={saveOnboarding} className="space-y-6">
      {step === 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">About your MS</h2>
          <p className="text-sm text-[var(--color-fg-muted)]">
            This helps Lumen personalise your experience. You can update this anytime.
          </p>
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              MS type
            </label>
            <select
              name="msType"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
              defaultValue="Unsure"
            >
              {MS_TYPES.map((t) => (
                <option key={t} value={t} className="bg-[#1a2548]">
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Diagnosis date (optional)
            </label>
            <input
              type="date"
              name="diagnosisDate"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Current DMT (optional)
            </label>
            <input
              type="text"
              name="currentDMT"
              placeholder="e.g. Ocrevus, Kesimpta"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40"
            />
          </div>
          <Button type="button" onClick={() => setStep(1)} className="w-full">
            Continue
          </Button>
        </section>
      )}

      {step === 1 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Your goals</h2>
          <p className="text-sm text-[var(--color-fg-muted)]">
            Pick what matters most right now. You can add more later.
          </p>
          <div className="space-y-2">
            {GOAL_SUGGESTIONS.map((goal) => (
              <label
                key={goal}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10"
              >
                <input
                  type="checkbox"
                  name="goals"
                  value={goal}
                  checked={selectedGoals.includes(goal)}
                  onChange={() => toggleGoal(goal)}
                  className="h-5 w-5 rounded"
                />
                <span className="text-sm text-white">{goal}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button type="button" onClick={() => setStep(2)} className="flex-1">
              Continue
            </Button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Accessibility & consent</h2>
          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <input type="checkbox" name="largeText" className="h-5 w-5" />
            <span className="text-sm text-white">Larger text</span>
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <input type="checkbox" name="highContrast" className="h-5 w-5" />
            <span className="text-sm text-white">High contrast mode</span>
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <input type="checkbox" name="lowEnergyMode" className="h-5 w-5" />
            <span className="text-sm text-white">
              Low energy mode (simplified dashboard)
            </span>
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <input
              type="checkbox"
              name="aiConsent"
              defaultChecked
              className="h-5 w-5"
            />
            <span className="text-sm text-white">
              I consent to AI coaching (not medical advice)
            </span>
          </label>
          <p className="text-xs text-[var(--color-fg-subtle)]">
            Lumen is not a substitute for medical care. Your data stays private and
            you can export or delete it anytime.
          </p>
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button type="submit" className="flex-1">
              Get started
            </Button>
          </div>
        </section>
      )}
    </form>
  );
}
