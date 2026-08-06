import Link from 'next/link';
import { CalendarDays, Crown, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { currentPlanMeta } from '@/features/plans/data/plans';
export function CurrentPlanCard() {
  return (
    <Card className="">
      <CardContent>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-primary text-primary-foreground flex size-14 shrink-0 items-center justify-center rounded-full">
              <Crown className="size-7" />
            </div>
            <div className="min-w-0">
              <p className="text-muted-foreground text-sm font-medium">
                Current Plan
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <h2 className="text-foreground text-xl font-bold tracking-tight">
                  {currentPlanMeta.name}
                </h2>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-0">
                  Active
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                Renews {currentPlanMeta.renewalDate}
              </p>
              <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
                {currentPlanMeta.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
            <div className="bg-muted/50 text-muted-foreground flex items-center gap-2 rounded-xl px-3 py-2 text-sm">
              <CalendarDays className="text-primary size-4 shrink-0" />
              <span>
                Next billing date{' '}
                <span className="text-foreground font-semibold">
                  {currentPlanMeta.nextBillingDate}
                </span>
              </span>
            </div>
            <Button
              variant="outline"
              className="rounded-xl"
              render={<Link href="/profile" />}
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
