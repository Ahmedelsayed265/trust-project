import type {
  PortfolioAllocationSlice,
  PortfolioPosition,
} from '@/features/portfolio/types';

const QUOTE_ASSETS = ['USDT', 'USDC', 'BUSD', 'FDUSD', 'USD', 'EUR'];

export function baseAsset(symbol: string) {
  const quote = QUOTE_ASSETS.find(
    (asset) => symbol.length > asset.length && symbol.endsWith(asset),
  );
  return quote ? symbol.slice(0, -quote.length) : symbol;
}

export type Holding = {
  id: string;
  symbol: string;
  asset: string;
  kind: 'position' | 'cash';
  side: string | null;
  qty: number;
  avgEntryPrice: number | null;
  markPrice: number | null;
  value: number;
  pnl: number;
  pnlPct: number;
  positive: boolean;
  allocation: number;
  series: number[];
};

function createRandom(seed: string) {
  let state = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    state ^= seed.charCodeAt(i);
    state = Math.imul(state, 16777619);
  }
  return () => {
    state = Math.imul(state ^ (state >>> 15), state | 1);
    state ^= state + Math.imul(state ^ (state >>> 7), state | 61);
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * The API exposes point-in-time positions, not a per-symbol history. The row
 * sparkline uses a walk that is stable per symbol and always lands exactly on
 * the position's real unrealized change.
 */
export function seededSeries(seed: string, points: number, changePct: number) {
  const random = createRandom(seed);
  const amplitude = Math.max(Math.abs(changePct) * 0.3, 1.5);

  const walk: number[] = [];
  let level = 0;
  for (let i = 0; i < points; i += 1) {
    walk.push(level);
    level += (random() - 0.5) * amplitude;
  }

  const drift = walk[points - 1] ?? 0;
  return walk.map((value, index) => {
    const progress = points > 1 ? index / (points - 1) : 1;
    return 100 + changePct * progress + (value - drift * progress);
  });
}

const CASH_SYMBOL = 'CASH';

export function buildHoldings(
  positions: PortfolioPosition[],
  allocation: PortfolioAllocationSlice[],
  equity: number,
): Holding[] {
  const percentOf = (symbol: string, value: number) => {
    const slice = allocation.find((item) => item.symbol === symbol);
    if (slice) return slice.percent / 100;
    return equity > 0 ? value / equity : 0;
  };

  const fromPositions: Holding[] = positions.map((position) => ({
    id: position.id,
    symbol: position.display_symbol || position.symbol,
    asset: baseAsset(position.symbol),
    kind: 'position',
    side: position.side,
    qty: position.qty,
    avgEntryPrice: position.avg_entry_price,
    markPrice: position.mark_price,
    value: position.market_value,
    pnl: position.unrealized_pnl,
    pnlPct: position.unrealized_pnl_pct,
    positive: position.is_positive,
    allocation: percentOf(position.symbol, position.market_value),
    series: seededSeries(position.symbol, 16, position.unrealized_pnl_pct),
  }));

  const cashSlice = allocation.find((item) => item.symbol === CASH_SYMBOL);
  const cash: Holding[] =
    cashSlice && cashSlice.value > 0
      ? [
          {
            id: 'cash',
            symbol: cashSlice.display_symbol || 'Cash',
            asset: 'Cash',
            kind: 'cash',
            side: null,
            qty: cashSlice.value,
            avgEntryPrice: null,
            markPrice: null,
            value: cashSlice.value,
            pnl: 0,
            pnlPct: 0,
            positive: true,
            allocation: cashSlice.percent / 100,
            series: seededSeries('cash', 16, 0),
          },
        ]
      : [];

  return [...fromPositions, ...cash].sort((a, b) => b.value - a.value);
}

export const PERFORMANCE_RANGES = [
  { id: '1W', apiRange: '1w' },
  { id: '1M', apiRange: '1m' },
  { id: '3M', apiRange: '3m' },
  { id: '1Y', apiRange: '1y' },
] as const;

export type PerformanceRange = (typeof PERFORMANCE_RANGES)[number];
export type PerformanceRangeId = PerformanceRange['id'];

export type EquityPoint = { label: string; value: number };

const ASSET_TONES = [
  'bg-chart-1/12 text-chart-1',
  'bg-chart-2/12 text-chart-2',
  'bg-chart-3/12 text-chart-3',
  'bg-chart-4/12 text-chart-4',
  'bg-chart-5/12 text-chart-5',
];

export function assetTone(asset: string) {
  let hash = 0;
  for (let i = 0; i < asset.length; i += 1) {
    hash = (hash * 31 + asset.charCodeAt(i)) >>> 0;
  }
  return ASSET_TONES[hash % ASSET_TONES.length];
}

export function formatQty(value: number) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: value >= 1000 ? 0 : 6,
  });
}

export function formatRelativeTime(iso: string, now = Date.now()) {
  const diffMs = now - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60_000);

  if (!Number.isFinite(minutes)) return '—';
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.round(hours / 24)}d ago`;
}
