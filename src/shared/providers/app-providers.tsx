"use client";

import { ThemeProvider } from "@/shared/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <TooltipProvider delay={200}>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
