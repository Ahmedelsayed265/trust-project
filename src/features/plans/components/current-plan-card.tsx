import Link from "next/link";
import { CalendarDays, Crown, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { currentPlanMeta } from "@/features/plans/data/plans";
import { routes } from "@/shared/lib/routes";

export function CurrentPlanCard() {
  return (
    <Card className="">
      <CardContent>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Crown className="size-7" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground">
                Current Plan
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  {currentPlanMeta.name}
                </h2>
                <Badge className="border-0 bg-primary/10 text-primary hover:bg-primary/10">
                  Active
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Renews {currentPlanMeta.renewalDate}
              </p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {currentPlanMeta.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
            <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
              <CalendarDays className="size-4 shrink-0 text-primary" />
              <span>
                Next billing date{" "}
                <span className="font-semibold text-foreground">
                  {currentPlanMeta.nextBillingDate}
                </span>
              </span>
            </div>
            <Button
              variant="outline"
              className="rounded-xl"
              render={<Link href={routes.profile} />}
            >
              <History />
              Billing History
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
