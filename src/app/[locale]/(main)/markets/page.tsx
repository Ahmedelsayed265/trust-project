import { getTranslations } from 'next-intl/server';
import {
  getMarketsAction,
  getMarketsCategoriesAction,
  getMarketsSummaryAction,
} from '@/features/markets/actions/get-markets';
import { MarketsView } from '@/features/markets';

export default async function MarketsPage() {
  const tErrors = await getTranslations('ErrorsPageLoad');
  const t = await getTranslations('Markets');
  const [listResult, categoriesResult, summaryResult] = await Promise.all([
    getMarketsAction({ per_page: 20 }),
    getMarketsCategoriesAction(),
    getMarketsSummaryAction(),
  ]);

  if (!listResult.ok) {
    return (
      <div className="border-border bg-card rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">
          {tErrors('markets')}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          {listResult.message}
        </p>
      </div>
    );
  }

  const summary = summaryResult.ok
    ? summaryResult.data
    : listResult.data.summary;

  const categories = categoriesResult.ok
    ? categoriesResult.data
    : [
        {
          key: 'all',
          label: t('assetClass.all'),
          count: summary.total_symbols,
        },
      ];

  return (
    <MarketsView
      initialData={listResult.data}
      initialSummary={summary}
      categories={categories}
    />
  );
}
