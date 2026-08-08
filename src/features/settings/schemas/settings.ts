import { z } from 'zod';

export const settingsSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone is required'),
  country: z
    .string()
    .trim()
    .min(2, 'Enter a country code')
    .max(2, 'Use a 2-letter country code'),
  displayName: z.string().min(2, 'Display name is required'),
  email: z.email('Enter a valid email'),
  language: z.string().min(1, 'Language is required'),
  currency: z.string().min(1, 'Currency is required'),
  emailAlerts: z.boolean(),
  pushAlerts: z.boolean(),
  aiDigest: z.boolean(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
