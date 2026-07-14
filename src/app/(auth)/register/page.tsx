import Link from "next/link";
import { AuthShell } from "@/shared/layouts/auth-shell";
import { RegisterForm } from "@/features/auth";
import { routes } from "@/shared/lib/routes";

export default function RegisterPage() {
  return (
    <AuthShell
      footer={
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={routes.login}
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <div className="mb-8 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Create your account
        </h2>
        <p className="text-sm text-muted-foreground">
          Start trading with AI-powered insights
        </p>
      </div>
      <RegisterForm />
    </AuthShell>
  );
}
