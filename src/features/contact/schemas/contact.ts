import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Enter a valid email"),
  category: z.enum(["account", "trading", "billing", "technical", "other"]),
  subject: z.string().min(4, "Subject is required"),
  message: z
    .string()
    .min(20, "Please share a bit more detail (at least 20 characters)"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
