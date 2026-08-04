import { AuthBrandPanel } from "@/features/auth/components/auth-brand-panel";

export function AuthShell({
  children,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex h-svh max-h-svh overflow-hidden bg-background">
      <AuthBrandPanel />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain">
        <div className="flex flex-1 items-start justify-center px-5 py-16 sm:items-center sm:px-6">
          <div className="w-full max-w-130">{children}</div>
        </div>
      </div>
    </div>
  );
}
