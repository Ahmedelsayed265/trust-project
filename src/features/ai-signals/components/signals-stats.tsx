import { Card, CardContent } from '@/components/ui/card';
import type { SignalsStats } from '@/features/ai-signals/types';

export function SignalsStatsCards({ stats }: { stats: SignalsStats }) {
  const statCards = [
    { label: 'Active Signals', value: String(stats.active_signals) },
    {
      label: 'Avg. Confidence',
      value: `${Math.round(stats.avg_confidence)}%`,
    },
    { label: 'Win Rate (30D)', value: `${stats.win_rate_30d}%` },
    { label: 'Strong Signals', value: String(stats.strong_signals) },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.label} size="sm">
          <CardContent>
            <p className="text-muted-foreground text-xs">{stat.label}</p>
            <p className="text-foreground mt-1 text-2xl font-bold">
              {stat.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
