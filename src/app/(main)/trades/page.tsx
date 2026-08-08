import {
  getAccountsAction,
  getProvidersAction,
} from '@/features/accounts/actions/accounts';
import { getSignalsAction } from '@/features/ai-signals/actions/get-signals';
import { getMarketsAction } from '@/features/markets/actions/get-markets';
import {
  getPortfolioAction,
  getPortfolioPositionsAction,
} from '@/features/portfolio/actions/get-portfolio';
import { TradesView } from '@/features/trades';
import { normalizeTradeSymbol } from '@/features/trades/lib/trade-symbol';

export default async function TradesPage({
  searchParams,
}: {
  searchParams: Promise<{ symbol?: string; provider_id?: string }>;
}) {
  const params = await searchParams;
  const requestedSymbol = params.symbol
    ? normalizeTradeSymbol(params.symbol)
    : '';
  const requestedProviderId = params.provider_id?.trim() || null;

  const [accountsResult, providersResult] = await Promise.all([
    getAccountsAction(),
    getProvidersAction(),
  ]);

  const accounts = accountsResult.ok ? accountsResult.data.accounts : [];
  const providers = providersResult.ok ? providersResult.data : [];
  const connected = accounts.filter((account) => account.is_connected);
  const connectedIds = new Set(connected.map((account) => account.provider_id));

  let defaultProviderId = requestedProviderId;

  // Symbol without provider: resolve which connected account can trade it.
  if (requestedSymbol && !defaultProviderId) {
    const probeResult = await getMarketsAction({
      search: requestedSymbol,
      per_page: 50,
      sort: 'volume',
      direction: 'desc',
    });
    if (probeResult.ok) {
      const match = probeResult.data.items.find(
        (item) =>
          item.is_tradable &&
          normalizeTradeSymbol(item.symbol) === requestedSymbol &&
          connectedIds.has(item.provider_id),
      );
      if (match) {
        defaultProviderId = match.provider_id;
      }
    }
  }

  if (!defaultProviderId) {
    defaultProviderId =
      connected.find((account) => account.is_default)?.provider_id ||
      connected[0]?.provider_id ||
      null;
  }

  const marketsResult = await getMarketsAction({
    per_page: 50,
    sort: 'volume',
    direction: 'desc',
    provider_id: defaultProviderId || undefined,
  });

  const markets = marketsResult.ok
    ? marketsResult.data.items.filter((item) => item.is_tradable)
    : [];

  const initialSymbol =
    (requestedSymbol &&
      markets.find((item) => item.symbol === requestedSymbol)?.symbol) ||
    markets[0]?.symbol ||
    'BTCUSDT';

  const [portfolioResult, positionsResult, signalsResult] = await Promise.all([
    defaultProviderId
      ? getPortfolioAction({ provider_id: defaultProviderId })
      : Promise.resolve(null),
    defaultProviderId
      ? getPortfolioPositionsAction(defaultProviderId)
      : Promise.resolve(null),
    getSignalsAction({
      symbol: initialSymbol,
      status: 'active',
      per_page: 1,
    }),
  ]);

  return (
    <TradesView
      initialData={{
        accounts,
        providers,
        portfolio:
          portfolioResult && portfolioResult.ok ? portfolioResult.data : null,
        positions:
          positionsResult && positionsResult.ok ? positionsResult.data : [],
        markets,
        signal:
          signalsResult.ok && signalsResult.data.items[0]
            ? signalsResult.data.items[0]
            : null,
        initialProviderId: defaultProviderId,
        initialSymbol,
      }}
    />
  );
}
