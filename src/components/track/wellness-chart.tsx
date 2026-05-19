"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  data: { date: string; energy: number; mood: number; pain: number; brainFog: number }[];
}

export function WellnessChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-[var(--color-fg-muted)]">
        Log a few daily check-ins to see your trends here.
      </p>
    );
  }

  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
    Energy: d.energy,
    Mood: d.mood,
    Pain: d.pain,
    "Brain fog": d.brainFog,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="date" stroke="#7782a8" fontSize={11} />
          <YAxis domain={[0, 10]} stroke="#7782a8" fontSize={11} />
          <Tooltip
            contentStyle={{
              background: "#1a2548",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="Energy" stroke="#3DA9FF" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Mood" stroke="#4EE066" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Pain" stroke="#F04C6E" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Brain fog" stroke="#A98BFF" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
