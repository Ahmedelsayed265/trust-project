import { requirePendingVerification } from "@/features/auth/session";
import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";

export default async function VerifyEmailPage() {
  const pending = await requirePendingVerification();

  return <VerifyEmailForm email={pending.email} />;
}
