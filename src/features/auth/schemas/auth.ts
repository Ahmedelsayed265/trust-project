import { z } from "zod";

const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Include at least one lowercase letter")
  .regex(/[A-Z]/, "Include at least one uppercase letter")
  .regex(/[0-9]/, "Include at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Include at least one special character (!@#$%^&*)"
  );

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.email("Enter a valid email"),
    password: strongPassword,
    password_confirmation: z.string().min(1, "Confirm your password"),
    terms: z.boolean().refine((v) => v === true, {
      message: "You must accept the terms",
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
