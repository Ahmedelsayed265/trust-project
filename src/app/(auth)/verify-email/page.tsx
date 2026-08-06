import { requirePendingOtp } from '@/features/auth/pending-session';
import { VerifyEmailForm } from '@/features/auth/components/verify-email-form';

export default async function VerifyEmailPage() {
  const pending = await requirePendingOtp();

  return <VerifyEmailForm email={pending.email} purpose={pending.purpose} />;
}
