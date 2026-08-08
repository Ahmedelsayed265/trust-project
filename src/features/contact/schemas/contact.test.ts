import { describe, expect, it } from 'vitest';
import { contactSchema } from '@/features/contact/schemas/contact';

const valid = {
  name: 'Ammar',
  email: 'demo@trustai.app',
  category: 'trading' as const,
  subject: 'Order issue',
  message: 'I need help understanding why my limit order was rejected.',
};

describe('contactSchema', () => {
  it('accepts a valid contact payload', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects invalid categories', () => {
    expect(
      contactSchema.safeParse({ ...valid, category: 'random' }).success,
    ).toBe(false);
  });

  it('requires a longer message', () => {
    expect(
      contactSchema.safeParse({ ...valid, message: 'Too short' }).success,
    ).toBe(false);
  });

  it('requires subject length of at least 4', () => {
    expect(contactSchema.safeParse({ ...valid, subject: 'Hi' }).success).toBe(
      false,
    );
  });
});
