import { describe, expect, it } from 'vitest';
import {
  changePasswordSchema,
  twoFactorCodeSchema,
} from '@/features/security/schemas/security';

describe('changePasswordSchema', () => {
  const valid = {
    current_password: 'OldPass1!',
    password: 'NewPass1!',
    password_confirmation: 'NewPass1!',
  };

  it('accepts a valid password change', () => {
    expect(changePasswordSchema.safeParse(valid).success).toBe(true);
  });

  it('requires confirmation to match', () => {
    expect(
      changePasswordSchema.safeParse({
        ...valid,
        password_confirmation: 'Mismatch1!',
      }).success,
    ).toBe(false);
  });

  it('rejects reusing the current password', () => {
    expect(
      changePasswordSchema.safeParse({
        current_password: 'SamePass1!',
        password: 'SamePass1!',
        password_confirmation: 'SamePass1!',
      }).success,
    ).toBe(false);
  });
});

describe('twoFactorCodeSchema', () => {
  it('accepts codes between 6 and 32 characters', () => {
    expect(twoFactorCodeSchema.safeParse({ code: '123456' }).success).toBe(
      true,
    );
    expect(twoFactorCodeSchema.safeParse({ code: 'abc' }).success).toBe(false);
  });

  it('trims whitespace before validation', () => {
    expect(twoFactorCodeSchema.safeParse({ code: '  123456  ' }).success).toBe(
      true,
    );
  });
});
