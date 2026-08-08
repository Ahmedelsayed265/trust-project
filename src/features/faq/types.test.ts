import { describe, expect, it } from 'vitest';
import { FAQ_CATEGORY_LABELS } from '@/features/faq/types';

describe('FAQ_CATEGORY_LABELS', () => {
  it('covers the known FAQ categories', () => {
    expect(FAQ_CATEGORY_LABELS.general).toBe('General');
    expect(FAQ_CATEGORY_LABELS.trading).toBe('Trading');
    expect(FAQ_CATEGORY_LABELS.account).toBe('Account');
    expect(FAQ_CATEGORY_LABELS.billing).toBe('Billing');
    expect(FAQ_CATEGORY_LABELS.security).toBe('Security');
  });
});
