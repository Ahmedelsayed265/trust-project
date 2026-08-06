import type { PortfolioSnapshot, ProviderPosition } from '@/shared/trading';

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
  qty: number;
  avgEntryPrice: number | null;
  markPrice: number | null;
  value: number;
  pnl: number;
  pnlPct: number;
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
 * Provider adapters expose point-in-time snapshots, not historical curves.
 * Until a history endpoint exists, charts use a walk that is stable per seed
 * and always lands exactly on the real current change.
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

export function buildHoldings(
  snapshot: PortfolioSnapshot | null,
  positions: ProviderPosition[],
): Holding[] {
  if (!snapshot) return [];

  const equity = snapshot.equity;
  const allocationOf = (value: number) => (equity > 0 ? value / equity : 0);

  const fromPositions: Holding[] = positions.map((position) => {
    const cost = position.marketValue - position.unrealizedPnl;
    const pnlPct = cost !== 0 ? (position.unrealizedPnl / cost) * 100 : 0;

    return {
      id: position.id,
      symbol: position.symbol,
      asset: baseAsset(position.symbol),
      kind: 'position',
      qty: position.qty,
      avgEntryPrice: position.avgEntryPrice,
      markPrice: position.markPrice,
      value: position.marketValue,
      pnl: position.unrealizedPnl,
      pnlPct,
      allocation: allocationOf(position.marketValue),
      series: seededSeries(position.symbol, 16, pnlPct),
    };
  });

  const invested = new Set(fromPositions.map((holding) => holding.asset));

  const fromBalances: Holding[] = snapshot.balances
    .filter(
      (balance) => (balance.usdValue ?? 0) > 0 && !invested.has(balance.asset),
    )
    .map((balance) => {
      const value = balance.usdValue ?? 0;

      return {
        id: `cash-${balance.asset}`,
        symbol: balance.asset,
        asset: balance.asset,
        kind: 'cash',
        qty: balance.free + balance.locked,
        avgEntryPrice: null,
        markPrice: null,
        value,
        pnl: 0,
        pnlPct: 0,
        allocation: allocationOf(value),
        series: seededSeries(balance.asset, 16, 0),
      };
    });

  return [...fromPositions, ...fromBalances].sort((a, b) => b.value - a.value);
}

export const PERFORMANCE_RANGES = [
  { id: '1W', days: 7, points: 8, dayFactor: 3.2 },
  { id: '1M', days: 30, points: 22, dayFactor: 6.4 },
  { id: '3M', days: 90, points: 34, dayFactor: 11 },
  { id: '1Y', days: 365, points: 40, dayFactor: 22 },
] as const;

export type PerformanceRange = (typeof PERFORMANCE_RANGES)[number];
export type PerformanceRangeId = PerformanceRange['id'];

export type EquityPoint = { timestamp: number; value: number };

export function buildEquityCurve({
  equity,
  dayPnlPct,
  range,
  seed,
  now = Date.now(),
}: {
  equity: number;
  dayPnlPct: number;
  range: PerformanceRange;
  seed: string;
  now?: number;
}) {
  const changePct = dayPnlPct * range.dayFactor;
  const startValue = equity / Math.max(1 + changePct / 100, 0.1);
  const stepMs = (range.days / Math.max(range.points - 1, 1)) * 86_400_000;

  const points: EquityPoint[] = seededSeries(
    `${seed}-${range.id}`,
    range.points,
    changePct,
  ).map((normalized, index) => ({
    timestamp: now - (range.points - 1 - index) * stepMs,
    value: (normalized / 100) * startValue,
  }));

  return { points, changePct, changeValue: equity - startValue };
}

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
