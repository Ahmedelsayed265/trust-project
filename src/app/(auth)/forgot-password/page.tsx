import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthShell } from "@/shared/layouts/auth-shell";
import { ForgotPasswordForm } from "@/features/auth";
import { routes } from "@/shared/lib/routes";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      footer={
        <Link
          href={routes.login}
          className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to sign in
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
