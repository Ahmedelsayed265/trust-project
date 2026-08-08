import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatMoney, formatSignedMoney } from '@/shared/trading';
import type { PortfolioAccountSummary } from '@/features/portfolio/types';

export function PortfolioAccount({
  accounts,
}: {
  accounts: PortfolioAccountSummary[];
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardTitle>Accounts</CardTitle>
        <Badge variant="secondary" className="border-0">
          {accounts.length} linked
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        {accounts.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No providers linked yet. Connect a broker or exchange to see
            balances here.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {accounts.map((account) => {
              const positive = account.day_pnl >= 0;

              return (
                <li
                  key={account.provider_id}
                  className="border-border rounded-[12px] border px-3 py-2.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-sm font-semibold">
                        {account.label}
                      </p>
                      <p className="text-muted-foreground text-xs capitalize">
                        {account.environment} · {account.currency}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-foreground text-sm font-semibold">
                        {formatMoney(account.equity, account.currency)}
                      </p>
                      <p
                        className={cn(
                          'text-xs font-medium',
                          positive ? 'text-success' : 'text-destructive',
                        )}
                      >
                        {formatSignedMoney(account.day_pnl, account.currency)}{' '}
                        today
                      </p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mt-1.5 text-xs">
                    Buying power{' '}
                    {formatMoney(account.buying_power, account.currency)}
                  </p>
                </li>
              );
            })}
          </ul>
        )}

        <p className="text-muted-foreground text-xs leading-relaxed">
          Balances are read directly from each provider. TrustAI never holds
          funds and cannot move them between accounts.
        </p>

        <Button
          variant="outline"
          className="w-full rounded-md"
          nativeButton={false}
          render={<Link href="/accounts" />}
        >
          Manage connections
        </Button>
      </CardContent>
    </Card>
  );
}
