export const WATCHLIST_ICON_BG: Record<string, string> = {
  crypto:
    'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300',
  stocks: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  metals:
    'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
};

export function watchlistIconBg(assetClass: string) {
  return WATCHLIST_ICON_BG[assetClass] ?? 'bg-muted text-muted-foreground';
}
