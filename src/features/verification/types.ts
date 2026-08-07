export type VerificationStepKey =
  'personal_details' | 'identity_document' | 'address';

export type IdentityDocumentType =
  'passport' | 'national_id' | 'driving_license';

export type AddressDocumentType = 'utility_bill' | 'bank_statement';

export type VerificationStepStatus =
  'complete' | 'pending' | 'rejected' | 'in_review' | string;

export type VerificationStep = {
  title: string;
  description: string;
  icon: string;
  key: string;
  status: VerificationStepStatus;
  document_type: string | null;
  rejection_reason: string | null;
  completed_at: string | null;
};

export type UserVerification = {
  id: number;
  level: string;
  level_label: string;
  status: string;
  is_verified: boolean;
  status_label: string;
  rejection_reason: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  progress: number;
  approved_steps: number;
  total_steps: number;
  steps: VerificationStep[];
};

export const VERIFICATION_STEP_KEYS: VerificationStepKey[] = [
  'personal_details',
  'identity_document',
  'address',
];

export function isVerificationStepKey(
  value: string,
): value is VerificationStepKey {
  return VERIFICATION_STEP_KEYS.includes(value as VerificationStepKey);
}
