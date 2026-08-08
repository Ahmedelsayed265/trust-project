import {
  Banknote,
  Layers,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatMoney, formatPct, formatSignedMoney } from '@/shared/trading';
import type { PortfolioData } from '@/features/portfolio/types';

export function PortfolioStats({ portfolio }: { portfolio: PortfolioData }) {
  const { currency, equity, buying_power, day_pnl, day_pnl_pct, open_pnl } =
    portfolio;

  const invested = portfolio.positions.reduce(
    (sum, position) => sum + position.market_value,
    0,
  );
  const costBasis = invested - open_pnl;
  const openPnlPct = costBasis > 0 ? (open_pnl / costBasis) * 100 : 0;
  const dayPositive = day_pnl >= 0;
  const pnlPositive = open_pnl >= 0;
  const positionsCount = portfolio.positions_count;

  const stats = [
    {
      label: 'Total equity',
      icon: Wallet,
      value: formatMoney(equity, currency),
      hint: (
        <span className={dayPositive ? 'text-success' : 'text-destructive'}>
          {formatSignedMoney(day_pnl, currency)} ({formatPct(day_pnl_pct)}){' '}
          <span className="text-muted-foreground">today</span>
        </span>
      ),
    },
    {
      label: 'Positions value',
      icon: Layers,
      value: formatMoney(invested, currency),
      hint: (
        <span className="text-muted-foreground">
          {positionsCount} open{' '}
          {positionsCount === 1 ? 'position' : 'positions'}
        </span>
      ),
    },
    {
      label: 'Unrealized P&L',
      icon: pnlPositive ? TrendingUp : TrendingDown,
      value: formatSignedMoney(open_pnl, currency),
      valueClassName: pnlPositive ? 'text-success' : 'text-destructive',
      hint: (
        <span className={pnlPositive ? 'text-success' : 'text-destructive'}>
          {formatPct(openPnlPct)}{' '}
          <span className="text-muted-foreground">on cost</span>
        </span>
      ),
    },
    {
      label: 'Buying power',
      icon: Banknote,
      value: formatMoney(buying_power, currency),
      hint: <span className="text-muted-foreground">Free cash available</span>,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} size="sm">
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-muted-foreground text-xs font-medium">
                {stat.label}
              </p>
              <span className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-lg">
                <stat.icon className="size-3.5" />
              </span>
            </div>

            <p
              className={cn(
                'text-foreground text-xl font-bold tracking-tight',
                stat.valueClassName,
              )}
            >
              {stat.value}
            </p>
            <p className="text-xs font-medium">{stat.hint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
