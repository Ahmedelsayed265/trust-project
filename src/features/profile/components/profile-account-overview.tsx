import { getTranslations } from 'next-intl/server';
import { Crown, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ChangeIndicator } from '@/shared/components/change-indicator';
import type { HomeAccount, HomePortfolio } from '@/features/dashboard/types';
import { getCurrentUser } from '@/features/auth/get-current-user';
import { formatMoney, formatPct, formatSignedMoney } from '@/shared/trading';

type ProfileAccountOverviewProps = {
  portfolio: HomePortfolio | null;
  accounts: HomeAccount[];
};

export async function ProfileAccountOverview({
  portfolio,
  accounts,
}: ProfileAccountOverviewProps) {
  const t = await getTranslations('Profile');
  const tPlans = await getTranslations('Plans');
  const tBrand = await getTranslations('Brand');
  const tTrades = await getTranslations('Trades');
  const user = await getCurrentUser();
  const currency = portfolio?.currency ?? 'USD';
  const hasData = portfolio != null && portfolio.has_accounts;
  const positive = portfolio ? portfolio.is_positive : true;
  const PnlIcon = positive ? TrendingUp : TrendingDown;

  const equityLabel =
    accounts.length === 1 ? accounts[0].label : t('totalEquity');

  return (
    <Card>
      <CardContent>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300">
              <Crown className="size-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">
                {tPlans('currentPlan')}
              </p>
              <p className="text-foreground text-base font-bold">
                {user.plan?.name ?? tBrand('planFree')}
              </p>
              <p className="text-muted-foreground text-xs">
                {user.plan?.renews_at_label
                  ? tPlans('renews', { date: user.plan.renews_at_label })
                  : t('noActiveRenewal')}
              </p>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">{equityLabel}</p>
            <p className="text-foreground text-base font-bold">
              {hasData ? formatMoney(portfolio.equity, currency) : '—'}
            </p>
            {hasData && (
              <div
                className={
                  positive
                    ? 'text-success mt-0.5 flex items-center gap-1 text-xs font-semibold'
                    : 'text-destructive mt-0.5 flex items-center gap-1 text-xs font-semibold'
                }
              >
                <PnlIcon className="size-3.5" />
                {formatSignedMoney(portfolio.day_pnl, currency)} (
                {formatPct(portfolio.day_pnl_pct)})
              </div>
            )}
          </div>

          <div>
            <p className="text-muted-foreground text-xs">
              {tTrades('buyingPower')}
            </p>
            <p className="text-foreground text-base font-bold">
              {hasData ? formatMoney(portfolio.buying_power, currency) : '—'}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">{tTrades('dayPnl')}</p>
            {hasData ? (
              <ChangeIndicator
                value={`${formatSignedMoney(portfolio.day_pnl, currency)} (${formatPct(portfolio.day_pnl_pct)})`}
                positive={positive}
                className="text-base font-bold"
              />
            ) : (
              <p className="text-foreground text-base font-bold">—</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
