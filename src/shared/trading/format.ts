export function formatMoney(
  value: number,
  currency = 'USD',
  options?: Intl.NumberFormatOptions,
) {
  const symbol =
    currency === 'USDT' || currency === 'USD'
      ? 'USD'
      : currency.length === 3
        ? currency
        : 'USD';

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: symbol === 'USDT' ? 'USD' : symbol,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    }).format(value);
  } catch {
    return `$${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

export function formatSignedMoney(value: number, currency = 'USD') {
  const formatted = formatMoney(Math.abs(value), currency);
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted.replace('-', '')}`;
  return formatted;
}

export function formatPct(value: number, digits = 2) {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(digits)}%`;
}
