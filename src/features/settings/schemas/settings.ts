import { z } from "zod";

export const settingsSchema = z.object({
  displayName: z.string().min(2, "Display name is required"),
  email: z.email("Enter a valid email"),
  language: z.enum(["en", "ar", "es"]),
  currency: z.enum(["USD", "EUR", "SAR"]),
  emailAlerts: z.boolean(),
  pushAlerts: z.boolean(),
  aiDigest: z.boolean(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
