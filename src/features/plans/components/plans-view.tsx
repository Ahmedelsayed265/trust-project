import Link from "next/link";
import { ChevronRight, Info, Lock } from "lucide-react";
import { CurrentPlanCard } from "@/features/plans/components/current-plan-card";
import { PlanCards } from "@/features/plans/components/plan-cards";
import { PlanComparison } from "@/features/plans/components/plan-comparison";
import { routes } from "@/shared/lib/routes";

export function PlansView() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-5 sm:gap-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Manage Plans
        </h1>
        <nav
          className="mt-1.5 flex items-center gap-1 text-sm text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link href={routes.profile} className="hover:text-foreground">
            Profile
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="font-medium text-foreground">Manage Plans</span>
        </nav>
      </div>

      <CurrentPlanCard />
      <PlanCards />
      <PlanComparison />

      <div className="flex flex-col gap-3 border-t border-border pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-1.5 sm:items-center">
          <Info className="mt-0.5 size-3.5 shrink-0 sm:mt-0" />
          All plans include market data access and portfolio tracking.
        </p>
        <p className="flex items-center gap-1.5">
          <Lock className="size-3.5 shrink-0" />
          Secure payment · 256-bit encryption
        </p>
      </div>
    </div>
  );
}
