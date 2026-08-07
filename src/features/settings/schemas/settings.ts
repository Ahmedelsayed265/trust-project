import { z } from 'zod';

export const settingsSchema = z.object({
  displayName: z.string().min(2, 'Display name is required'),
  email: z.email('Enter a valid email'),
  language: z.string().min(1, 'Language is required'),
  currency: z.string().min(1, 'Currency is required'),
  emailAlerts: z.boolean(),
  pushAlerts: z.boolean(),
  aiDigest: z.boolean(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
