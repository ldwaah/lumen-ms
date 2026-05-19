"use client";

import { useState } from "react";
import { saveDailyCheckIn } from "@/app/actions/ms";
import { Button } from "@/components/ui/button";

interface Props {
  existing?: {
    energy: number;
    mood: number;
    pain: number;
    brainFog: number;
    sleepHours?: number | null;
    stress?: number | null;
    notes?: string | null;
  } | null;
}

function Slider({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: number;
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <label className="font-medium text-white">{label}</label>
        <span className="text-[var(--color-primary)]">{value}/10</span>
      </div>
      <input
        type="range"
        name={name}
        min={1}
        max={10}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-[var(--color-primary)]"
      />
    </div>
  );
}

export function CheckInForm({ existing }: Props) {
  return (
    <form action={saveDailyCheckIn} className="space-y-4">
      <Slider name="energy" label="Energy" defaultValue={existing?.energy ?? 5} />
      <Slider name="mood" label="Mood" defaultValue={existing?.mood ?? 5} />
      <Slider name="pain" label="Pain" defaultValue={existing?.pain ?? 3} />
      <Slider name="brainFog" label="Brain fog" defaultValue={existing?.brainFog ?? 4} />
      <Slider name="stress" label="Stress" defaultValue={existing?.stress ?? 4} />
      <div>
        <label className="mb-1 block text-sm font-medium text-white">
          Sleep (hours)
        </label>
        <input
          type="number"
          name="sleepHours"
          step={0.5}
          min={0}
          max={24}
          defaultValue={existing?.sleepHours ?? 7}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-white">
          Notes (optional)
        </label>
        <textarea
          name="notes"
          rows={2}
          defaultValue={existing?.notes ?? ""}
          placeholder="Anything notable today?"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40"
        />
      </div>
      <Button type="submit" className="w-full">
        {existing ? "Update check-in" : "Save check-in"}
      </Button>
    </form>
  );
}
