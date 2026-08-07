import { z } from 'zod';

const MAX_FILE_BYTES = 8 * 1024 * 1024;

const fileSchema = z
  .custom<File>((value) => value instanceof File, 'A file is required')
  .refine((file) => file.size > 0, 'A file is required')
  .refine(
    (file) => file.size <= MAX_FILE_BYTES,
    'File must be 8 MB or smaller',
  );

const optionalFileSchema = z
  .custom<File | null>((value) => value == null || value instanceof File)
  .refine(
    (file) => file == null || file.size <= MAX_FILE_BYTES,
    'File must be 8 MB or smaller',
  )
  .nullable()
  .optional();

function isAdult(dateOfBirth: string) {
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return false;
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 18);
  return dob <= cutoff;
}

export const personalDetailsSchema = z.object({
  legal_first_name: z.string().trim().min(1, 'First name is required'),
  legal_last_name: z.string().trim().min(1, 'Last name is required'),
  date_of_birth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine(isAdult, 'You must be at least 18 years old'),
  nationality: z
    .string()
    .trim()
    .min(2, 'Enter a country code')
    .max(2, 'Use a 2-letter country code'),
});

export const identityDocumentSchema = z.object({
  document_type: z.enum(['passport', 'national_id', 'driving_license']),
  document_front: fileSchema,
  document_back: optionalFileSchema,
});

export const addressSchema = z.object({
  document_type: z.enum(['utility_bill', 'bank_statement']),
  document_front: fileSchema,
  address_line: z.string().trim().min(1, 'Address is required'),
  city: z.string().trim().min(1, 'City is required'),
  country: z
    .string()
    .trim()
    .min(2, 'Enter a country code')
    .max(2, 'Use a 2-letter country code'),
  postal_code: z.string().trim().optional(),
});

export type PersonalDetailsValues = z.infer<typeof personalDetailsSchema>;
export type IdentityDocumentValues = z.infer<typeof identityDocumentSchema>;
export type AddressValues = z.infer<typeof addressSchema>;
