'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HoldingsFilterTabs } from '@/features/portfolio/components/holdings-filter-tabs';
import { HoldingsRow } from '@/features/portfolio/components/holdings-row';
import { HoldingsTableHead } from '@/features/portfolio/components/holdings-table-head';
import { useHoldingsTable } from '@/features/portfolio/hooks/use-holdings-table';
import type { Holding } from '@/features/portfolio/lib/portfolio-data';

export function PortfolioHoldings({
  holdings,
  currency,
}: {
  holdings: Holding[];
  currency: string;
}) {
  const t = useTranslations('Portfolio');
  const { filter, setFilter, sortKey, toggleSort, rows } =
    useHoldingsTable(holdings);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardTitle>{t('holdings')}</CardTitle>
        <HoldingsFilterTabs value={filter} onChange={setFilter} />
      </CardHeader>

      <CardContent className="px-0">
        <div className="w-full max-w-full scrollbar-thin overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-210 text-left">
            <HoldingsTableHead sortKey={sortKey} onSort={toggleSort} />

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-muted-foreground px-4 py-10 text-center text-sm"
                  >
                    {t('noHoldings')}
                  </td>
                </tr>
              ) : (
                rows.map((holding) => (
                  <HoldingsRow
                    key={holding.id}
                    holding={holding}
                    currency={currency}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
