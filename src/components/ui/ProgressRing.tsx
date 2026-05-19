import * as React from "react";

interface Props {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  trackColor?: string;
  color?: string;
  secondaryValue?: number;
  secondaryColor?: string;
  children?: React.ReactNode;
  label?: string;
}

export function ProgressRing({
  value,
  size = 72,
  stroke = 6,
  color = "#3DA9FF",
  trackColor = "rgba(255,255,255,0.08)",
  secondaryValue,
  secondaryColor = "#4EE066",
  children,
  label,
}: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
  const ringSize = size + (secondaryValue !== undefined ? stroke + 4 : 0);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: ringSize, height: ringSize }}
      aria-label={label}
    >
      {secondaryValue !== undefined && (
        <svg
          width={ringSize}
          height={ringSize}
          className="absolute inset-0"
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={(ringSize - stroke) / 2}
            stroke={trackColor}
            strokeWidth={stroke}
            fill="none"
          />
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={(ringSize - stroke) / 2}
            stroke={secondaryColor}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={2 * Math.PI * ((ringSize - stroke) / 2)}
            strokeDashoffset={
              2 * Math.PI * ((ringSize - stroke) / 2) -
              (Math.min(100, Math.max(0, secondaryValue ?? 0)) / 100) *
                2 *
                Math.PI *
                ((ringSize - stroke) / 2)
            }
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </svg>
      )}
      <svg
        width={size}
        height={size}
        className="block"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
