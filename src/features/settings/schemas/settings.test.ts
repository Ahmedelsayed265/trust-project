import { describe, expect, it } from 'vitest';
import { settingsSchema } from '@/features/settings/schemas/settings';

const valid = {
  firstName: 'Ammar',
  lastName: 'Nashat',
  phone: '+201000000000',
  country: 'EG',
  displayName: 'Ammar Nashat',
  email: 'demo@trustai.app',
  language: 'en',
  currency: 'USD',
  emailAlerts: true,
  pushAlerts: false,
  aiDigest: true,
};

describe('settingsSchema', () => {
  it('accepts a complete settings payload', () => {
    expect(settingsSchema.safeParse(valid).success).toBe(true);
  });

  it('requires a 2-letter country code', () => {
    expect(settingsSchema.safeParse({ ...valid, country: 'EGY' }).success).toBe(
      false,
    );
    expect(settingsSchema.safeParse({ ...valid, country: 'E' }).success).toBe(
      false,
    );
  });

  it('requires display name length of at least 2', () => {
    expect(
      settingsSchema.safeParse({ ...valid, displayName: 'A' }).success,
    ).toBe(false);
  });

  it('requires a valid email', () => {
    expect(
      settingsSchema.safeParse({ ...valid, email: 'not-an-email' }).success,
    ).toBe(false);
  });
});
