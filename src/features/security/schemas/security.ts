import { z } from 'zod';

const strongPassword = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Include at least one lowercase letter')
  .regex(/[A-Z]/, 'Include at least one uppercase letter')
  .regex(/[0-9]/, 'Include at least one number')
  .regex(/[^A-Za-z0-9]/, 'Include at least one special character (!@#$%^&*)');

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    password: strongPassword,
    password_confirmation: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  })
  .refine((data) => data.password !== data.current_password, {
    message: 'New password must be different from the current one',
    path: ['password'],
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export const twoFactorCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(6, 'Enter a valid code')
    .max(32, 'Enter a valid code'),
});

export type TwoFactorCodeValues = z.infer<typeof twoFactorCodeSchema>;
