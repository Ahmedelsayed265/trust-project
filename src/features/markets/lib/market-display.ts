export const MARKET_ICON_BG: Record<string, string> = {
  crypto:
    'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300',
  stocks: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  metals:
    'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  forex: 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
  indices:
    'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
};

export function marketIconBg(assetClass: string) {
  return MARKET_ICON_BG[assetClass] ?? 'bg-muted text-muted-foreground';
}

export function assetClassLabel(assetClass: string) {
  if (assetClass === 'crypto') return 'Crypto';
  if (assetClass === 'stocks') return 'Stock';
  if (assetClass === 'metals') return 'Metal';
  if (assetClass === 'forex') return 'Forex';
  if (assetClass === 'indices') return 'Index';
  return assetClass;
}

export function formatCompactMoney(value: number, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `$${value.toLocaleString('en-US')}`;
  }
}

export function isWatchlisted(value: unknown): boolean {
  return value === true;
}
