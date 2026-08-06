import { createElement } from 'react';
import { CheckCircle2, FileText, PieChart, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { OrdersSummaryData } from '@/features/orders/types';
import { formatMoney } from '@/shared/trading';
import { cn } from '@/lib/utils';

const STATS = [
  {
    key: 'open' as const,
    label: 'Open Orders',
    icon: FileText,
    iconClass:
      'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300',
  },
  {
    key: 'filled' as const,
    label: 'Filled',
    icon: CheckCircle2,
    iconClass:
      'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300',
  },
  {
    key: 'canceled' as const,
    label: 'Canceled',
    icon: XCircle,
    iconClass: 'bg-muted text-muted-foreground',
  },
  {
    key: 'open_value' as const,
    label: 'Open Value',
    icon: PieChart,
    iconClass: 'bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-300',
  },
] as const;

export function OrdersSummary({ summary }: { summary: OrdersSummaryData }) {
  const values = {
    open: String(summary.open),
    filled: String(summary.filled),
    canceled: String(summary.canceled),
    open_value: formatMoney(summary.open_value),
  };

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {STATS.map((stat) => (
        <Card key={stat.key} size="sm">
          <CardContent className="flex items-center gap-3">
            <div
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-xl',
                stat.iconClass,
              )}
            >
              {createElement(stat.icon, { className: 'size-5' })}
            </div>
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs sm:text-sm">
                {stat.label}
              </p>
              <p className="text-foreground truncate text-xl font-bold">
                {values[stat.key]}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
