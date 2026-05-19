"use client";

const NODES = [
  { x: 12, y: 18, r: 2.2, color: "#3DA9FF", delay: 0 },
  { x: 28, y: 42, r: 1.8, color: "#4EE066", delay: 0.6 },
  { x: 45, y: 12, r: 3.1, color: "#A98BFF", delay: 1.2 },
  { x: 62, y: 35, r: 2.5, color: "#FF7BB5", delay: 0.3 },
  { x: 78, y: 22, r: 2.0, color: "#3DA9FF", delay: 1.8 },
  { x: 88, y: 55, r: 2.8, color: "#F6B536", delay: 0.9 },
  { x: 15, y: 68, r: 2.4, color: "#4EE066", delay: 2.1 },
  { x: 35, y: 82, r: 1.6, color: "#FF7BB5", delay: 1.4 },
  { x: 55, y: 72, r: 3.0, color: "#3DA9FF", delay: 0.2 },
  { x: 72, y: 88, r: 2.2, color: "#A98BFF", delay: 2.5 },
  { x: 92, y: 78, r: 1.9, color: "#4EE066", delay: 1.0 },
  { x: 8, y: 45, r: 2.6, color: "#F6B536", delay: 1.6 },
] as const;

export function ConstellationBg({ className = "" }: { className?: string }) {
  const nodes = NODES;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-constellation" />
      <svg
        className="absolute inset-0 h-full w-full opacity-60"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {nodes.map((n, i) => (
          <g key={i}>
            {nodes.slice(i + 1, i + 3).map((m, j) => {
              const dx = m.x - n.x;
              const dy = m.y - n.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist > 22) return null;
              return (
                <line
                  key={j}
                  x1={n.x}
                  y1={n.y}
                  x2={m.x}
                  y2={m.y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="0.12"
                />
              );
            })}
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r * 0.18}
              fill={n.color}
              opacity="0.55"
              style={{
                filter: `drop-shadow(0 0 ${n.r * 0.6}px ${n.color}aa)`,
                animation: `lumen-pulse 5s ease-in-out infinite ${n.delay}s`,
                transformOrigin: `${n.x}% ${n.y}%`,
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
