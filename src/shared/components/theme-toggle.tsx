"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ThemeToggle({
  collapsed = false,
  className,
}: {
  collapsed?: boolean;
  className?: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-9 rounded-full bg-muted",
          collapsed ? "w-9" : "w-full",
          className
        )}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  if (collapsed) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn("rounded-full", className)}
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? <Sun /> : <Moon />}
      </Button>
    );
  }

  return (
    <div className={cn("flex items-center rounded-full bg-muted p-1 w-full", className)}>
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={cn(
          "flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
          !isDark
            ? "bg-card text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Sun className="size-3.5" />
        Light
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={cn(
          "flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
          isDark
            ? "bg-card text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Moon className="size-3.5" />
        Dark
      </button>
    </div>
  );
}
