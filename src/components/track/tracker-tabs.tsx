"use client";

import { useState } from "react";
import { saveDailyCheckIn, logSymptom, logMedication, logRelapse } from "@/app/actions/ms";
import { CheckInForm } from "@/components/today/check-in-form";
import { SYMPTOM_TYPES, MEDICATION_TYPES } from "@/lib/ms-types";
import { Button } from "@/components/ui/button";
import { WellnessChart } from "@/components/track/wellness-chart";

interface CheckIn {
  date: string;
  energy: number;
  mood: number;
  pain: number;
  brainFog: number;
}

interface Props {
  checkIns: CheckIn[];
  todayCheckIn: CheckIn | null;
  medications: { id: string; name: string; type: string; dose: string | null }[];
}

export function TrackerTabs({ checkIns, todayCheckIn, medications }: Props) {
  const [tab, setTab] = useState<"log" | "trends">("log");
  const [logType, setLogType] = useState<"checkin" | "symptom" | "med" | "relapse">("checkin");

  const tabs = [
    { id: "log" as const, label: "Log" },
    { id: "trends" as const, label: "Trends" },
  ];

  return (
    <div>
      <div className="mb-6 flex gap-2 rounded-full border border-white/10 bg-white/5 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition ${
              tab === t.id
                ? "bg-[var(--color-primary)] text-[#0a1024]"
                : "text-white/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "trends" ? (
        <WellnessChart data={checkIns} />
      ) : (
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            {(
              [
                ["checkin", "Check-in"],
                ["symptom", "Symptom"],
                ["med", "Medication"],
                ["relapse", "Relapse"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setLogType(id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  logType === id
                    ? "bg-white/15 text-white"
                    : "bg-white/5 text-white/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {logType === "checkin" && (
            <CheckInForm
              existing={
                todayCheckIn
                  ? {
                      energy: todayCheckIn.energy,
                      mood: todayCheckIn.mood,
                      pain: todayCheckIn.pain,
                      brainFog: todayCheckIn.brainFog,
                    }
                  : null
              }
            />
          )}

          {logType === "symptom" && (
            <form action={logSymptom} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-white">Symptom type</label>
                <select name="type" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white">
                  {SYMPTOM_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-[#1a2548]">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-white">Severity (1-10)</label>
                <input type="number" name="severity" min={1} max={10} defaultValue={5} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white" />
              </div>
              <input type="hidden" name="startedAt" value={new Date().toISOString()} />
              <Button type="submit" className="w-full">Log symptom</Button>
            </form>
          )}

          {logType === "med" && (
            <form action={logMedication} className="space-y-4">
              {medications.length > 0 && (
                <div>
                  <label className="mb-1 block text-sm text-white">Log dose for</label>
                  <select name="medicationId" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white">
                    <option value="">— Add new medication —</option>
                    {medications.map((m) => (
                      <option key={m.id} value={m.id} className="bg-[#1a2548]">
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <input type="text" name="name" placeholder="Medication name" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white" />
              <select name="type" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white">
                {MEDICATION_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-[#1a2548]">
                    {t}
                  </option>
                ))}
              </select>
              <input type="text" name="dose" placeholder="Dose (optional)" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white" />
              <Button type="submit" className="w-full">Log medication</Button>
            </form>
          )}

          {logType === "relapse" && (
            <form action={logRelapse} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-white">Severity (1-10)</label>
                <input type="number" name="severity" min={1} max={10} defaultValue={5} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-white">Symptoms (select all that apply)</p>
                {SYMPTOM_TYPES.slice(0, 6).map((s) => (
                  <label key={s} className="flex items-center gap-2 text-sm text-white">
                    <input type="checkbox" name="symptoms" value={s} className="h-4 w-4" />
                    {s}
                  </label>
                ))}
              </div>
              <label className="flex items-center gap-2 text-sm text-white">
                <input type="checkbox" name="treatedWithSteroids" className="h-4 w-4" />
                Treated with steroids
              </label>
              <input type="hidden" name="startedAt" value={new Date().toISOString()} />
              <Button type="submit" className="w-full">Log relapse event</Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
