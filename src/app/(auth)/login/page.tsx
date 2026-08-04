import Link from "next/link";
import { AuthShell } from "@/shared/layouts/auth-shell";
import { LoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <AuthShell>
      <div className="mb-8 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back
        </h2>
        <p className="text-sm text-muted-foreground">
          Sign in to your TrustAI account
        </p>
      </div>

      <LoginForm />

      <p className="text-muted-foreground text-sm text-center mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Create account
        </Link>
      </p>
    </AuthShell>
  );
}
