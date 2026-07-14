import { cn } from "@/lib/utils";

export function Sparkline({
  data,
  className,
  positive = true,
  fill = false,
  strokeWidth = 2,
}: {
  data: number[];
  className?: string;
  positive?: boolean;
  fill?: boolean;
  strokeWidth?: number;
}) {
  const width = 120;
  const height = 40;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,${height} ${points} ${width},${height}`;
  const color = positive ? "var(--success)" : "var(--destructive)";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      preserveAspectRatio="none"
      aria-hidden
    >
      {fill && (
        <polygon points={areaPoints} fill={color} fillOpacity={0.12} />
      )}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
