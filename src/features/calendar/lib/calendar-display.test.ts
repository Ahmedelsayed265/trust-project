import { describe, expect, it } from 'vitest';
import {
  categoryLabel,
  currentMonthKey,
  impactBadgeClass,
  impactLabel,
  shiftMonth,
} from '@/features/calendar/lib/calendar-display';

describe('impact helpers', () => {
  it('labels impact levels', () => {
    expect(impactLabel('high')).toBe('High');
    expect(impactLabel('medium')).toBe('Medium');
    expect(impactLabel('low')).toBe('Low');
    expect(impactLabel('critical')).toBe('critical');
  });

  it('returns distinct badge classes', () => {
    expect(impactBadgeClass('high')).toContain('destructive');
    expect(impactBadgeClass('low')).toContain('muted');
    expect(impactBadgeClass('medium')).toContain('amber');
  });
});

describe('categoryLabel', () => {
  it('labels known categories', () => {
    expect(categoryLabel('economic')).toBe('Economic');
    expect(categoryLabel('earnings')).toBe('Earnings');
    expect(categoryLabel('crypto')).toBe('Crypto');
    expect(categoryLabel('dividend')).toBe('Dividend');
    expect(categoryLabel('ipo')).toBe('IPO');
  });
});

describe('shiftMonth', () => {
  it('shifts forward and wraps years', () => {
    expect(shiftMonth('2026-01', 1)).toBe('2026-02');
    expect(shiftMonth('2026-12', 1)).toBe('2027-01');
    expect(shiftMonth('2026-01', -1)).toBe('2025-12');
  });
});

describe('currentMonthKey', () => {
  it('formats YYYY-MM from a date', () => {
    expect(currentMonthKey(new Date('2026-08-08T12:00:00Z'))).toBe('2026-08');
  });
});
