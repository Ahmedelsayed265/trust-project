import Link from "next/link";
import { AuthShell } from "@/shared/layouts/auth-shell";
import { LoginForm } from "@/features/auth";
import { routes } from "@/shared/lib/routes";

export default function LoginPage() {
  return (
    <AuthShell
      footer={
        <p className="text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={routes.register}
            className="font-semibold text-primary hover:underline"
          >
            Create account
          </Link>
        </p>
      }
    >
      <div className="mb-8 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back
        </h2>
        <p className="text-sm text-muted-foreground">
          Sign in to your TrustAI account
        </p>
      </div>
      <LoginForm />
    </AuthShell>
  );
}
