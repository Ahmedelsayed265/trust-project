import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getMarketBySymbolAction } from '@/features/markets/actions/get-markets';
import { MarketDetailView } from '@/features/markets/components/market-detail-view';
import { Button } from '@/components/ui/button';

export default async function MarketSymbolPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const tErrors = await getTranslations('ErrorsPageLoad');
  const t = await getTranslations('Markets');
  const { symbol } = await params;
  const decoded = decodeURIComponent(symbol);
  const result = await getMarketBySymbolAction(decoded);

  if (!result.ok) {
    return (
      <div className="border-border bg-card mx-auto max-w-md rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">
          {tErrors('symbol')}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">{result.message}</p>
        <Button
          variant="outline"
          className="mt-4 rounded-xl"
          render={<Link href="/markets" />}
        >
          {t('backToMarkets')}
        </Button>
      </div>
    );
  }

  return <MarketDetailView initialData={result.data} />;
}
