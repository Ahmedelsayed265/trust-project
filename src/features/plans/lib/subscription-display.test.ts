import { describe, expect, it } from 'vitest';
import {
  billingCycleLabel,
  formatSubscriptionDate,
  subscriptionStatusClass,
} from '@/features/plans/lib/subscription-display';

describe('subscriptionStatusClass', () => {
  it('maps active, canceled, and expired statuses', () => {
    expect(subscriptionStatusClass('active')).toContain('primary');
    expect(subscriptionStatusClass('cancelled')).toContain('destructive');
    expect(subscriptionStatusClass('canceled')).toContain('destructive');
    expect(subscriptionStatusClass('expired')).toContain('muted');
  });
});

describe('formatSubscriptionDate', () => {
  it('formats valid dates and rejects invalid ones', () => {
    expect(formatSubscriptionDate('2026-03-15T00:00:00.000Z')).toMatch(/2026/);
    expect(formatSubscriptionDate(null)).toBeNull();
    expect(formatSubscriptionDate('not-a-date')).toBeNull();
  });
});

describe('billingCycleLabel', () => {
  it('maps yearly and monthly cycles', () => {
    expect(billingCycleLabel('yearly')).toBe('year');
    expect(billingCycleLabel('monthly')).toBe('month');
    expect(billingCycleLabel('weekly')).toBe('weekly');
  });
});
