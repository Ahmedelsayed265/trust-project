import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { HomeActivity } from '@/features/dashboard/types';
import { formatRelativeTime } from '@/features/portfolio/lib/portfolio-data';
import { cn } from '@/lib/utils';
import { formatMoney } from '@/shared/trading';

type RecentActivityProps = {
  items: HomeActivity[];
};

export async function RecentActivity({ items }: RecentActivityProps) {
  const t = await getTranslations('Dashboard');
  const tCommon = await getTranslations('Common');

  return (
    <div className="border-border bg-card rounded-lg border p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-foreground text-base font-semibold">
          {t('recentActivity')}
        </h2>
        <Link
          href="/orders"
          className="text-primary text-sm font-medium hover:underline"
        >
          {tCommon('seeAll')}
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t('noRecentFills')}</p>
      ) : (
        <ul className="space-y-1">
          {items.map((item) => {
            const isBuy = item.side.toLowerCase() === 'buy';
            const label = item.display_symbol || item.symbol;

            return (
              <li
                key={item.id}
                className="hover:bg-muted/50 flex items-center gap-3 rounded-xl px-1 py-2.5 transition-colors"
              >
                <div
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase',
                    isBuy
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
                  )}
                >
                  {label.slice(0, 1)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-foreground text-sm font-semibold">
                      {label}
                    </p>
                    <span
                      className={
                        isBuy
                          ? 'text-success text-xs font-semibold capitalize'
                          : 'text-destructive text-xs font-semibold capitalize'
                      }
                    >
                      {item.side}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {formatRelativeTime(item.created_at)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-foreground text-sm font-semibold">
                    {formatMoney(item.notional, item.fee_asset)}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatQty(item.qty)} {baseFromSymbol(label)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function formatQty(qty: number) {
  if (qty >= 100)
    return qty.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (qty >= 1)
    return qty.toLocaleString('en-US', { maximumFractionDigits: 4 });
  return qty.toLocaleString('en-US', { maximumFractionDigits: 8 });
}

function baseFromSymbol(display: string) {
  const [base] = display.split('/');
  return base || display;
}
