'use client';

import {
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ChevronDown,
  History,
  Link2,
  Plus,
  Rocket,
  SlidersHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { getSignalsAction } from '@/features/ai-signals/actions/get-signals';
import type { Signal } from '@/features/ai-signals/types';
import { getMarketsAction } from '@/features/markets/actions/get-markets';
import type { MarketSymbol } from '@/features/markets/types';
import {
  getPortfolioAction,
  getPortfolioPositionsAction,
} from '@/features/portfolio/actions/get-portfolio';
import type {
  PortfolioData,
  PortfolioPosition,
} from '@/features/portfolio/types';
import {
  orderSchema,
  type OrderFormValues,
} from '@/features/trades/schemas/order';
import { AccountSummary } from '@/features/trades/components/account-summary';
import { OrderEntry } from '@/features/trades/components/order-entry';
import { OrderSummary } from '@/features/trades/components/order-summary';
import { TradeAiSignal } from '@/features/trades/components/trade-ai-signal';
import { OpenPositions } from '@/features/trades/components/open-positions';
import { useOrderSummaryPreview } from '@/features/trades/hooks/use-order-summary-preview';
import { normalizeTradeSymbol } from '@/features/trades/lib/trade-symbol';
import type { TradesPageData } from '@/features/trades/types';

function TradeOrderPanel({
  markets,
  market,
  providerId,
  buyingPower,
  positions,
  currency,
  signal,
  focusToken,
  onSymbolChange,
  onApplySignal,
  onPlaced,
}: {
  markets: MarketSymbol[];
  market: MarketSymbol | null;
  providerId: string | null;
  buyingPower: number;
  positions: PortfolioPosition[];
  currency: string;
  signal: Signal | null;
  focusToken: number;
  onSymbolChange: (symbol: string) => void;
  onApplySignal: (signal: Signal) => void;
  onPlaced?: () => void;
}) {
  const preview = useOrderSummaryPreview({
    providerId,
    quoteAsset: market?.quote_asset ?? 'USDT',
  });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!focusToken) return;
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [focusToken]);

  return (
    <div ref={panelRef} className="grid gap-4 lg:gap-5 xl:grid-cols-3">
      <OrderEntry
        preview={preview}
        markets={markets}
        market={market}
        providerId={providerId}
        buyingPower={buyingPower}
        focusToken={focusToken}
        onSymbolChange={onSymbolChange}
        onPlaced={onPlaced}
      />
      <div className="flex flex-col gap-4">
        <OrderSummary preview={preview} />
        <TradeAiSignal signal={signal} onApply={onApplySignal} />
      </div>
      <OpenPositions
        positions={positions}
        currency={currency}
        onSelectSymbol={onSymbolChange}
      />
    </div>
  );
}

export function TradesView({ initialData }: { initialData: TradesPageData }) {
  const t = useTranslations('Trades');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const pathname = usePathname();
  const [tab, setTab] = useState<'trade' | 'positions'>('trade');
  const [providerId, setProviderId] = useState<string | null>(
    initialData.initialProviderId,
  );
  const [markets, setMarkets] = useState(initialData.markets);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(
    initialData.portfolio,
  );
  const [positions, setPositions] = useState<PortfolioPosition[]>(
    initialData.positions,
  );
  const [signal, setSignal] = useState<Signal | null>(initialData.signal);
  const [portfolioError, setPortfolioError] = useState<string | null>(
    initialData.initialProviderId ? null : t('connectProviderHint'),
  );
  const [loadingPortfolio, startPortfolioLoad] = useTransition();
  const [loadingMarkets, startMarketsLoad] = useTransition();

  const connectedAccounts = useMemo(
    () => initialData.accounts.filter((account) => account.is_connected),
    [initialData.accounts],
  );

  const selectedAccount =
    connectedAccounts.find((account) => account.provider_id === providerId) ??
    null;

  const scopedMarkets = useMemo(
    () =>
      providerId
        ? markets.filter((item) => item.provider_id === providerId)
        : markets,
    [markets, providerId],
  );

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      pair: initialData.initialSymbol,
      orderType: 'market',
      side: 'buy',
      amount: '100',
      currency:
        initialData.markets.find(
          (item) => item.symbol === initialData.initialSymbol,
        )?.quote_asset ?? 'USDT',
      percent: 0,
      limitPrice: '',
    },
  });

  const pair = useWatch({ control: form.control, name: 'pair' });
  const selectedMarket =
    scopedMarkets.find((item) => item.symbol === pair) ??
    scopedMarkets[0] ??
    null;

  function syncUrl(nextSymbol: string, nextProviderId: string | null) {
    const params = new URLSearchParams();
    if (nextSymbol) params.set('symbol', nextSymbol);
    if (nextProviderId) params.set('provider_id', nextProviderId);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function refreshPortfolio(nextProviderId: string | null) {
    if (!nextProviderId) {
      setPortfolio(null);
      setPositions([]);
      setPortfolioError(t('connectProviderHint'));
      return;
    }

    startPortfolioLoad(async () => {
      const [portfolioResult, positionsResult] = await Promise.all([
        getPortfolioAction({ provider_id: nextProviderId }),
        getPortfolioPositionsAction(nextProviderId),
      ]);

      if (!portfolioResult.ok) {
        setPortfolio(null);
        setPortfolioError(portfolioResult.message);
      } else {
        setPortfolio(portfolioResult.data);
        setPortfolioError(null);
      }

      if (positionsResult.ok) {
        setPositions(positionsResult.data);
      } else {
        setPositions([]);
      }
    });
  }

  function refreshSignal(symbol: string) {
    void getSignalsAction({
      symbol: normalizeTradeSymbol(symbol),
      status: 'active',
      per_page: 1,
    }).then((result) => {
      if (!result.ok) {
        setSignal(null);
        return;
      }
      setSignal(result.data.items[0] ?? null);
    });
  }

  function applyMarketSelection(
    market: MarketSymbol,
    nextProviderId: string | null = market.provider_id,
  ) {
    form.setValue('pair', market.symbol, { shouldValidate: true });
    form.setValue('currency', market.quote_asset);
    form.setValue('percent', 0);
    syncUrl(market.symbol, nextProviderId);
    refreshSignal(market.symbol);
  }

  function handleSymbolChange(nextSymbol: string) {
    const symbol = normalizeTradeSymbol(nextSymbol);
    const local = scopedMarkets.find((item) => item.symbol === symbol);
    if (local) {
      applyMarketSelection(local, providerId);
      return;
    }

    startMarketsLoad(async () => {
      const probe = await getMarketsAction({
        search: symbol,
        per_page: 50,
        sort: 'volume',
        direction: 'desc',
      });
      if (!probe.ok) {
        toast.error(probe.message);
        return;
      }

      const match = probe.data.items.find(
        (item) =>
          item.is_tradable &&
          normalizeTradeSymbol(item.symbol) === symbol &&
          connectedAccounts.some(
            (account) => account.provider_id === item.provider_id,
          ),
      );

      if (!match) {
        toast.error(t('toastSymbolUnavailable', { symbol }));
        return;
      }

      if (match.provider_id !== providerId) {
        const accountLabel =
          connectedAccounts.find(
            (account) => account.provider_id === match.provider_id,
          )?.label ?? match.provider_id;
        setProviderId(match.provider_id);
        refreshPortfolio(match.provider_id);
        toast.info(
          t('toastSwitchedAccount', { account: accountLabel, symbol }),
        );
      }

      const scoped = await getMarketsAction({
        provider_id: match.provider_id,
        per_page: 50,
        sort: 'volume',
        direction: 'desc',
      });
      if (!scoped.ok) {
        toast.error(scoped.message);
        return;
      }

      const nextMarkets = scoped.data.items.filter((item) => item.is_tradable);
      setMarkets(nextMarkets);
      const nextMarket =
        nextMarkets.find((item) => item.symbol === match.symbol) ?? match;
      applyMarketSelection(nextMarket, match.provider_id);
    });
  }

  function handleProviderChange(nextProviderId: string) {
    setProviderId(nextProviderId);
    syncUrl(pair, nextProviderId);
    refreshPortfolio(nextProviderId);

    startMarketsLoad(async () => {
      const result = await getMarketsAction({
        provider_id: nextProviderId,
        per_page: 50,
        sort: 'volume',
        direction: 'desc',
      });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      const nextMarkets = result.data.items.filter((item) => item.is_tradable);
      setMarkets(nextMarkets);
      const stillExists = nextMarkets.some((item) => item.symbol === pair);
      if (!stillExists && nextMarkets[0]) {
        applyMarketSelection(nextMarkets[0], nextProviderId);
      } else {
        syncUrl(pair, nextProviderId);
      }
    });
  }

  function handleApplySignal(next: Signal) {
    const symbol = normalizeTradeSymbol(next.symbol);
    handleSymbolChange(symbol);
    form.setValue('side', next.side.toLowerCase() === 'buy' ? 'buy' : 'sell');
    if (next.entry_low != null || next.entry_high != null) {
      form.setValue('orderType', 'limit');
      const mid =
        next.entry_low != null && next.entry_high != null
          ? (next.entry_low + next.entry_high) / 2
          : (next.entry_low ?? next.entry_high ?? next.price);
      form.setValue('limitPrice', String(mid), { shouldValidate: true });
    } else {
      form.setValue('orderType', 'market');
    }
    setTab('trade');
    toast.success(t('toastSignalApplied'));
  }

  const [focusToken, setFocusToken] = useState(0);

  function startNewTrade(orderType: 'market' | 'limit' = 'market') {
    const market = selectedMarket;
    const price =
      market?.price != null && market.price > 0 ? String(market.price) : '';

    form.reset({
      pair: market?.symbol ?? initialData.initialSymbol,
      orderType,
      side: 'buy',
      amount: '',
      currency: market?.quote_asset ?? 'USDT',
      percent: 0,
      limitPrice: orderType === 'limit' ? price : '',
    });
    setTab('trade');
    setFocusToken((value) => value + 1);
    toast.success(
      orderType === 'limit' ? t('toastLimitReady') : t('toastMarketReady'),
    );
  }

  const selectedSymbol = selectedMarket?.symbol ?? null;
  const selectedQuote = selectedMarket?.quote_asset;

  const syncTicketToScopedMarket = useEffectEvent(
    (nextSymbol: string, nextQuote: string, nextProviderId: string | null) => {
      form.setValue('pair', nextSymbol, { shouldValidate: true });
      form.setValue('currency', nextQuote);
      form.setValue('percent', 0);
      syncUrl(nextSymbol, nextProviderId);
      refreshSignal(nextSymbol);
    },
  );

  // Keep the ticket on a market that belongs to the active provider.
  useEffect(() => {
    if (!selectedSymbol || selectedSymbol === pair || !selectedQuote) return;
    syncTicketToScopedMarket(selectedSymbol, selectedQuote, providerId);
  }, [selectedSymbol, selectedQuote, pair, providerId]);

  const accountTriggerLabel = selectedAccount?.label ?? t('allAccounts');
  const tabLabels = {
    trade: t('tabTrade'),
    positions: t('tabPositions'),
  } as const;

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t('description')}
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full rounded-xl sm:w-auto"
          render={<Link href="/orders" />}
        >
          <History />
          {t('tradeHistory')}
        </Button>
      </div>

      <AccountSummary
        portfolio={portfolio}
        account={selectedAccount}
        loading={loadingPortfolio}
        error={portfolioError}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="bg-muted flex items-center gap-1 rounded-xl p-1">
          {(['trade', 'positions'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={cn(
                'rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors',
                tab === item
                  ? 'bg-card text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tabLabels[item]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  className="bg-card h-10 min-w-42 justify-between rounded-[12px]! px-3"
                />
              }
            >
              <span className="truncate">{accountTriggerLabel}</span>
              <ChevronDown className="text-muted-foreground size-4 shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-56 rounded-xl">
              <DropdownMenuGroup>
                <DropdownMenuLabel>{t('tradingAccount')}</DropdownMenuLabel>
                {connectedAccounts.length > 0 ? (
                  <DropdownMenuRadioGroup
                    value={providerId ?? undefined}
                    onValueChange={(value) => {
                      if (value) handleProviderChange(value);
                    }}
                  >
                    {connectedAccounts.map((account) => (
                      <DropdownMenuRadioItem
                        key={account.provider_id}
                        value={account.provider_id}
                        className="rounded-lg"
                      >
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate font-medium">
                            {account.label}
                          </span>
                          <span className="text-muted-foreground text-xs capitalize">
                            {account.environment}
                            {account.is_default
                              ? ` · ${tCommon('default')}`
                              : ''}
                          </span>
                        </span>
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                ) : (
                  <DropdownMenuItem disabled className="rounded-lg">
                    {t('noConnectedAccounts')}
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="rounded-lg"
                onClick={() => router.push('/accounts')}
              >
                <Link2 className="size-4" />
                {tCommon('manageAccounts')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  size="icon"
                  className="size-10 shrink-0 rounded-[12px]!"
                  aria-label={t('newTradeAria')}
                />
              }
            >
              <Plus className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-52 rounded-xl">
              <DropdownMenuGroup>
                <DropdownMenuLabel>{t('startNewTrade')}</DropdownMenuLabel>
                <DropdownMenuItem
                  className="rounded-lg"
                  onClick={() => startNewTrade('market')}
                >
                  <Rocket className="size-4" />
                  {t('newMarketOrder')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-lg"
                  onClick={() => startNewTrade('limit')}
                >
                  <SlidersHorizontal className="size-4" />
                  {t('newLimitOrder')}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              {selectedMarket ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled className="rounded-lg text-xs">
                    {t('usingMarket', {
                      symbol:
                        selectedMarket.display_symbol || selectedMarket.symbol,
                    })}
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <FormProvider {...form}>
        {tab === 'trade' ? (
          <TradeOrderPanel
            markets={scopedMarkets}
            market={selectedMarket}
            providerId={providerId}
            buyingPower={portfolio?.buying_power ?? 0}
            positions={positions}
            currency={portfolio?.currency ?? 'USD'}
            signal={signal}
            focusToken={focusToken}
            onSymbolChange={(symbol) => {
              handleSymbolChange(symbol);
              setTab('trade');
            }}
            onApplySignal={handleApplySignal}
            onPlaced={() => refreshPortfolio(providerId)}
          />
        ) : (
          <OpenPositions
            positions={positions}
            currency={portfolio?.currency ?? 'USD'}
            onSelectSymbol={(symbol) => {
              handleSymbolChange(symbol);
              setTab('trade');
              setFocusToken((value) => value + 1);
            }}
          />
        )}
      </FormProvider>

      {loadingMarkets ? (
        <p className="text-muted-foreground text-xs">{t('updatingMarkets')}</p>
      ) : null}
    </div>
  );
}
