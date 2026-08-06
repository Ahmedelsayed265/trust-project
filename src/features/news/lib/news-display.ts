export function sentimentBadgeClass(sentiment: string) {
  const value = sentiment.toLowerCase();
  if (value === 'bullish') {
    return 'text-success bg-emerald-50 hover:bg-emerald-50 dark:bg-emerald-950/40';
  }
  if (value === 'bearish') {
    return 'text-destructive bg-red-50 hover:bg-red-50 dark:bg-red-950/40';
  }
  return 'text-muted-foreground bg-muted hover:bg-muted';
}
