export function normalizeTradeSymbol(symbol: string) {
  return symbol.trim().replace(/\//g, '').toUpperCase();
}

export function isQuoteAmountCurrency(
  currency: string,
  quoteAsset: string | null | undefined,
) {
  if (!quoteAsset) return true;
  return currency.trim().toUpperCase() === quoteAsset.trim().toUpperCase();
}
