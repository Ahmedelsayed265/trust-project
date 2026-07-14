import Link from "next/link";
import { Logo } from "@/shared/components/logo";
import { AuthBrandPanel } from "@/features/auth/components/auth-brand-panel";
import { routes } from "@/shared/lib/routes";

export function AuthShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex h-svh max-h-svh overflow-hidden bg-background">
      <AuthBrandPanel />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain">
        <div className="flex items-center justify-between px-5 py-4 sm:px-6 lg:px-10">
          <Link href={routes.login} className="lg:invisible">
            <Logo />
          </Link>
        </div>

        <div className="flex flex-1 items-start justify-center px-5 pb-10 sm:items-center sm:px-6">
          <div className="w-full max-w-[420px]">
            {children}
            {footer && <div className="mt-8 text-center text-sm">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
