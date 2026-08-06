export function impactLabel(impact: string) {
  if (impact === 'high') return 'High';
  if (impact === 'medium') return 'Medium';
  if (impact === 'low') return 'Low';
  return impact;
}

export function impactBadgeClass(impact: string) {
  if (impact === 'high') {
    return 'text-destructive bg-red-50 hover:bg-red-50 dark:bg-red-950/40';
  }
  if (impact === 'low') {
    return 'text-muted-foreground bg-muted hover:bg-muted';
  }
  return 'bg-amber-50 text-amber-700 hover:bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300';
}

export function categoryLabel(category: string) {
  if (category === 'economic') return 'Economic';
  if (category === 'earnings') return 'Earnings';
  if (category === 'crypto') return 'Crypto';
  if (category === 'dividend') return 'Dividend';
  if (category === 'ipo') return 'IPO';
  return category;
}

/** Shift month string `YYYY-MM` by delta months. */
export function shiftMonth(month: string, delta: number) {
  const [yearText, monthText] = month.split('-');
  const year = Number(yearText);
  const monthIndex = Number(monthText) - 1;
  const date = new Date(Date.UTC(year, monthIndex + delta, 1));
  const nextYear = date.getUTCFullYear();
  const nextMonth = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${nextYear}-${nextMonth}`;
}

export function currentMonthKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}
