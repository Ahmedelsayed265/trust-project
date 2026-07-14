import Link from "next/link";
import { cn } from "@/lib/utils";
import { routes } from "@/shared/lib/routes";

type LogoProps = {
  className?: string;
  showTagline?: boolean;
  iconOnly?: boolean;
  size?: "sm" | "lg";
  variant?: "default" | "onDark";
  href?: string | null;
};

export function Logo({
  className,
  showTagline = true,
  iconOnly = false,
  size = "sm",
  variant = "default",
  href = routes.home,
}: LogoProps) {
  const markSize = size === "lg" ? "size-11" : "size-8";
  const iconSize = size === "lg" ? "size-6" : "size-5";
  const onDark = variant === "onDark";

  const content = (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg",
          markSize,
          onDark
            ? "bg-white text-primary"
            : "bg-primary text-primary-foreground"
        )}
      >
        <svg
          viewBox="0 0 24 24"
          className={iconSize}
          fill="currentColor"
          aria-hidden
        >
          <rect x="3" y="12" width="3.5" height="9" rx="1" />
          <rect x="8.5" y="7" width="3.5" height="14" rx="1" />
          <rect x="14" y="3" width="3.5" height="18" rx="1" />
          <rect
            x="19.5"
            y="10"
            width="1.5"
            height="11"
            rx="0.75"
            opacity="0.7"
          />
        </svg>
      </div>
      {!iconOnly && (
        <div className="min-w-0 leading-tight">
          <p
            className={cn(
              "truncate font-bold tracking-tight",
              size === "lg" ? "text-xl" : "text-sm",
              onDark ? "text-white" : "text-foreground"
            )}
          >
            TrustAI
          </p>
          {showTagline && (
            <p
              className={cn(
                "truncate",
                size === "lg" ? "text-xs" : "text-[11px]",
                onDark ? "text-white/70" : "text-muted-foreground"
              )}
            >
              AI Trading Platform
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (!href) return content;
  return (
    <Link href={href} className="outline-none" aria-label="TrustAI home">
      {content}
    </Link>
  );
}
