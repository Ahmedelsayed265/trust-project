import { describe, expect, it } from 'vitest';
import { HELP_CATEGORY_LABELS } from '@/features/help/types';

describe('HELP_CATEGORY_LABELS', () => {
  it('covers the known help categories', () => {
    expect(HELP_CATEGORY_LABELS['getting-started']).toBe('Getting started');
    expect(HELP_CATEGORY_LABELS.trading).toBe('Trading');
    expect(HELP_CATEGORY_LABELS.security).toBe('Security');
    expect(HELP_CATEGORY_LABELS.billing).toBe('Billing');
  });
});
