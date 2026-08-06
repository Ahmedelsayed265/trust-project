'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { EquityPoint } from '@/features/portfolio/lib/portfolio-data';

const HEIGHT = 220;
const PADDING_Y = 12;
const GRID_LINES = 4;

function useMeasuredWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    setWidth(element.clientWidth);
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}

export function EquityChart({
  points,
  positive,
  formatValue,
  formatDate,
  className,
}: {
  points: EquityPoint[];
  positive: boolean;
  formatValue: (value: number) => string;
  formatDate: (timestamp: number) => string;
  className?: string;
}) {
  const gradientId = useId();
  const [containerRef, width] = useMeasuredWidth<HTMLDivElement>();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const geometry = useMemo(() => {
    if (width === 0 || points.length < 2) return null;

    const values = points.map((point) => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const usableHeight = HEIGHT - PADDING_Y * 2;

    const coords = points.map((point, index) => ({
      x: (index / (points.length - 1)) * width,
      y: PADDING_Y + (1 - (point.value - min) / span) * usableHeight,
    }));

    const line = coords
      .map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'}${x} ${y}`)
      .join(' ');

    return {
      coords,
      line,
      area: `${line} L${width} ${HEIGHT} L0 ${HEIGHT} Z`,
      min,
      max,
    };
  }, [points, width]);

  const color = positive ? 'var(--success)' : 'var(--destructive)';
  const active = activeIndex != null ? points[activeIndex] : null;
  const activeCoord =
    activeIndex != null ? geometry?.coords[activeIndex] : null;

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width === 0) return;

    const ratio = (event.clientX - rect.left) / rect.width;
    const index = Math.round(ratio * (points.length - 1));
    setActiveIndex(Math.min(points.length - 1, Math.max(0, index)));
  }

  return (
    <div className={cn('w-full min-w-0', className)}>
      <div
        ref={containerRef}
        className="relative w-full touch-pan-y"
        style={{ height: HEIGHT }}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setActiveIndex(null)}
      >
        {geometry && (
          <svg width={width} height={HEIGHT} className="block" aria-hidden>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.24} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>

            {Array.from({ length: GRID_LINES }, (_, index) => {
              const y =
                PADDING_Y +
                (index / (GRID_LINES - 1)) * (HEIGHT - PADDING_Y * 2);
              return (
                <line
                  key={index}
                  x1={0}
                  x2={width}
                  y1={y}
                  y2={y}
                  stroke="var(--border)"
                  strokeDasharray="3 5"
                  strokeWidth={1}
                />
              );
            })}

            <path d={geometry.area} fill={`url(#${gradientId})`} />
            <path
              d={geometry.line}
              fill="none"
              stroke={color}
              strokeWidth={2.25}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {activeCoord && (
              <>
                <line
                  x1={activeCoord.x}
                  x2={activeCoord.x}
                  y1={0}
                  y2={HEIGHT}
                  stroke={color}
                  strokeOpacity={0.35}
                  strokeWidth={1}
                />
                <circle
                  cx={activeCoord.x}
                  cy={activeCoord.y}
                  r={4.5}
                  fill={color}
                  stroke="var(--card)"
                  strokeWidth={2}
                />
              </>
            )}
          </svg>
        )}

        {active && activeCoord && (
          <div
            className="border-border bg-popover pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-lg border px-2.5 py-1.5 text-xs shadow-sm"
            style={{
              left: Math.min(
                Math.max(activeCoord.x, 64),
                Math.max(width - 64, 64),
              ),
            }}
          >
            <p className="text-foreground font-semibold">
              {formatValue(active.value)}
            </p>
            <p className="text-muted-foreground">
              {formatDate(active.timestamp)}
            </p>
          </div>
        )}
      </div>

      {points.length > 0 && (
        <div className="text-muted-foreground mt-2 flex items-center justify-between text-xs">
          <span>{formatDate(points[0].timestamp)}</span>
          <span>{formatDate(points[points.length - 1].timestamp)}</span>
        </div>
      )}
    </div>
  );
}
