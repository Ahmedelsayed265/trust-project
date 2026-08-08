import { describe, expect, it } from 'vitest';
import { watchlistIconBg } from '@/features/watchlist/lib/watchlist-display';

describe('watchlistIconBg', () => {
  it('returns themed classes for known asset classes', () => {
    expect(watchlistIconBg('crypto')).toContain('orange');
    expect(watchlistIconBg('stocks')).toContain('slate');
    expect(watchlistIconBg('metals')).toContain('amber');
    expect(watchlistIconBg('other')).toBe('bg-muted text-muted-foreground');
  });
});
