import { describe, expect, it } from 'vitest';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '@/features/auth/schemas/auth';

const strongPassword = 'Password1!';

describe('loginSchema', () => {
  it('accepts a valid login payload', () => {
    expect(
      loginSchema.safeParse({
        email: 'demo@trustai.app',
        password: 'password',
        remember: true,
      }).success,
    ).toBe(true);
  });

  it('rejects invalid email and short password', () => {
    const result = loginSchema.safeParse({
      email: 'bad',
      password: 'short',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toEqual(
        expect.arrayContaining(['email', 'password']),
      );
    }
  });
});

describe('registerSchema', () => {
  const valid = {
    first_name: 'Ammar',
    last_name: 'Nashat',
    email: 'demo@trustai.app',
    password: strongPassword,
    password_confirmation: strongPassword,
    terms: true,
  };

  it('accepts a valid registration payload', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it('requires terms acceptance', () => {
    const result = registerSchema.safeParse({ ...valid, terms: false });
    expect(result.success).toBe(false);
  });

  it('requires matching password confirmation', () => {
    const result = registerSchema.safeParse({
      ...valid,
      password_confirmation: 'Different1!',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(['password_confirmation']);
    }
  });

  it('enforces strong password rules', () => {
    expect(
      registerSchema.safeParse({
        ...valid,
        password: 'password',
        password_confirmation: 'password',
      }).success,
    ).toBe(false);
  });
});

describe('forgotPasswordSchema', () => {
  it('requires a valid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'a@b.com' }).success).toBe(
      true,
    );
    expect(forgotPasswordSchema.safeParse({ email: 'nope' }).success).toBe(
      false,
    );
  });
});

describe('resetPasswordSchema', () => {
  it('accepts matching strong passwords', () => {
    expect(
      resetPasswordSchema.safeParse({
        password: strongPassword,
        password_confirmation: strongPassword,
      }).success,
    ).toBe(true);
  });

  it('rejects mismatched passwords', () => {
    expect(
      resetPasswordSchema.safeParse({
        password: strongPassword,
        password_confirmation: 'OtherPass1!',
      }).success,
    ).toBe(false);
  });
});
