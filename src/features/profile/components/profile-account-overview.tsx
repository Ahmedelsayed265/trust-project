import { Crown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ChangeIndicator } from "@/shared/components/change-indicator";
import { currentUser } from "@/shared/lib/user";

export function ProfileAccountOverview() {
  return (
    <Card className="shadow-sm">
      <CardContent>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300">
              <Crown className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current Plan</p>
              <p className="text-base font-bold text-foreground">
                {currentUser.plan}
              </p>
              <p className="text-xs text-muted-foreground">
                Renews May 15, 2026
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Total Equity</p>
            <p className="text-base font-bold text-foreground">$24,530.45</p>
            <div className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-success">
              <TrendingUp className="size-3.5" />
              +$1,250.34 (5.37%)
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Buying Power</p>
            <p className="text-base font-bold text-foreground">$8,642.21</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Total P&L (Today)</p>
            <ChangeIndicator
              value="+$320.45 (1.32%)"
              className="text-base font-bold"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
