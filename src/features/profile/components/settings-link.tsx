import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type SettingsItem = {
  label: string;
  description?: string;
  href?: string;
  icon: LucideIcon;
  badge?: string;
  badgeTone?: "success" | "primary" | "muted";
  danger?: boolean;
};

export function SettingsLink({ item }: { item: SettingsItem }) {
  const Icon = item.icon;
  const content = (
    <>
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl",
          item.danger
            ? "bg-destructive/10 text-destructive"
            : "bg-muted text-foreground"
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={cn(
              "text-sm font-semibold",
              item.danger ? "text-destructive" : "text-foreground"
            )}
          >
            {item.label}
          </p>
          {item.badge && (
            <Badge
              className={cn(
                "border-0 text-[10px]",
                item.badgeTone === "success" &&
                  "bg-emerald-50 text-success hover:bg-emerald-50 dark:bg-emerald-950/40",
                item.badgeTone === "primary" &&
                  "bg-primary text-primary-foreground",
                item.badgeTone === "muted" &&
                  "bg-muted text-muted-foreground hover:bg-muted"
              )}
            >
              {item.badge}
            </Badge>
          )}
        </div>
        {item.description && (
          <p className="truncate text-xs text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </>
  );

  const className = cn(
    "flex w-full items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/60"
  );

  if (item.href) {
    return (
      <Link href={item.href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className}>
      {content}
    </button>
  );
}
