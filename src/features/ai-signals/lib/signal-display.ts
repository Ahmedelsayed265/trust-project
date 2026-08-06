export const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'closed', label: 'Closed' },
  { value: 'expired', label: 'Expired' },
  { value: 'all', label: 'All' },
] as const;

export const SIDE_OPTIONS = [
  { value: 'all', label: 'All sides' },
  { value: 'buy', label: 'Buy' },
  { value: 'sell', label: 'Sell' },
] as const;

export const STRENGTH_OPTIONS = [
  { value: 'all', label: 'All strengths' },
  { value: 'strong', label: 'Strong' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'watch', label: 'Watch' },
] as const;

export const ASSET_ICON_BG: Record<string, string> = {
  crypto:
    'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300',
  stocks: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300',
  metals:
    'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
};

export function strengthLabel(strength: string) {
  if (strength === 'strong') return 'Strong';
  if (strength === 'moderate') return 'Moderate';
  if (strength === 'watch') return 'Watch';
  return strength;
}

export function isBuySide(side: string) {
  return side.toLowerCase() === 'buy';
}

export function planLabel(planKey: string | null) {
  if (planKey === 'signal-guard-plus') return 'Signal Guard Plus';
  if (planKey === 'market-intel-pro') return 'Market Intelligence Pro';
  if (planKey === 'signal-guard') return 'Signal Guard';
  return null;
}
