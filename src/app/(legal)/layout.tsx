import Link from 'next/link';
import { Logo } from '@/shared/components/logo';
import { ThemeToggle } from '@/shared/components/theme-toggle';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background h-svh overflow-y-auto overscroll-contain">
      <header className="border-border bg-background/90 sticky top-0 z-10 border-b backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-4 px-5 sm:px-6">
          <Logo href="/" className="min-w-0" />
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground text-sm font-medium whitespace-nowrap"
            >
              Sign in
            </Link>
            <ThemeToggle collapsed />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
        {children}
      </main>
    </div>
  );
}
