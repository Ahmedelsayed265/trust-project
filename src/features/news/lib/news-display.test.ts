import { describe, expect, it } from 'vitest';
import { sentimentBadgeClass } from '@/features/news/lib/news-display';

describe('sentimentBadgeClass', () => {
  it('maps bullish, bearish, and neutral sentiments', () => {
    expect(sentimentBadgeClass('Bullish')).toContain('success');
    expect(sentimentBadgeClass('bearish')).toContain('destructive');
    expect(sentimentBadgeClass('neutral')).toContain('muted');
  });
});
