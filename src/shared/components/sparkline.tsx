"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export function Sparkline({
  data,
  className,
  positive = true,
  fill = false,
  strokeWidth = 2,
  showDot = false,
}: {
  data: number[];
  className?: string;
  positive?: boolean;
  fill?: boolean;
  strokeWidth?: number;
  showDot?: boolean;
}) {
  const gradientId = useId();
  const width = 120;
  const height = 40;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const coords = data.map((value, index) => {
    const x = (index / Math.max(data.length - 1, 1)) * width;
    const y = height - ((value - min) / range) * (height - 6) - 3;
    return { x, y };
  });

  const linePath = coords
    .map(({ x, y }, i) => `${i === 0 ? "M" : "L"}${x} ${y}`)
    .join(" ");
  const areaPath = `${linePath} L${width} ${height} L0 ${height} Z`;
  const color = positive ? "var(--success)" : "var(--destructive)";
  const last = coords[coords.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      preserveAspectRatio="none"
      aria-hidden
    >
      {fill && (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradientId})`} />
        </>
      )}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {showDot && last && (
        <circle
          cx={last.x}
          cy={last.y}
          r={2.25}
          fill={color}
          stroke="var(--card)"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}
