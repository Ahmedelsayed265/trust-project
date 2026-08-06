import { requireVerifiedPasswordReset } from '@/features/auth/pending-session';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

export default async function ResetPasswordPage() {
  const pending = await requireVerifiedPasswordReset();

  return <ResetPasswordForm email={pending.email} />;
}
