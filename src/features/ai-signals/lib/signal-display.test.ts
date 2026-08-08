import { describe, expect, it } from 'vitest';
import {
  isBuySide,
  planLabel,
  strengthLabel,
} from '@/features/ai-signals/lib/signal-display';

describe('strengthLabel', () => {
  it('maps known strengths and passes through unknowns', () => {
    expect(strengthLabel('strong')).toBe('Strong');
    expect(strengthLabel('moderate')).toBe('Moderate');
    expect(strengthLabel('watch')).toBe('Watch');
    expect(strengthLabel('custom')).toBe('custom');
  });
});

describe('isBuySide', () => {
  it('is case-insensitive', () => {
    expect(isBuySide('buy')).toBe(true);
    expect(isBuySide('BUY')).toBe(true);
    expect(isBuySide('sell')).toBe(false);
  });
});

describe('planLabel', () => {
  it('maps known plan keys', () => {
    expect(planLabel('signal-guard-plus')).toBe('Signal Guard Plus');
    expect(planLabel('market-intel-pro')).toBe('Market Intelligence Pro');
    expect(planLabel('signal-guard')).toBe('Signal Guard');
    expect(planLabel(null)).toBeNull();
    expect(planLabel('free')).toBeNull();
  });
});
