"use client";

import { useTransition } from "react";
import type { LucideIcon } from "lucide-react";
import { Loader2, LogOut } from "lucide-react";
import { logoutAction } from "@/features/auth/actions/logout";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
  collapsed?: boolean;
  icon?: LucideIcon;
  label?: string;
  onComplete?: () => void;
  children?: React.ReactNode;
};

export function LogoutButton({
  className,
  collapsed,
  icon: Icon = LogOut,
  label = "Log Out",
  onComplete,
  children,
}: LogoutButtonProps) {
  const [pending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      onComplete?.();
      await logoutAction();
    });
  }

  if (children) {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={pending}
        className={className}
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : children}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-sidebar-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-60",
        collapsed && "justify-center px-2",
        className
      )}
    >
      {pending ? (
        <Loader2 className="size-4 shrink-0 animate-spin" />
      ) : (
        <Icon className="size-4 shrink-0" />
      )}
      {!collapsed && <span className="truncate">{label}</span>}
      {collapsed && <span className="sr-only">{label}</span>}
    </button>
  );
}
