import { ForgotPasswordForm } from '@/features/auth';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <>
      <ForgotPasswordForm />

      <p className="mt-6 text-center text-sm">
        <Link
          href="/login"
          className="text-primary inline-flex items-center gap-1.5 font-medium hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to sign in
        </Link>
      </p>
    </>
  );
}
