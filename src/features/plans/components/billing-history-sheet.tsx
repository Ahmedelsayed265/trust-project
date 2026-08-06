'use client';

import { useState } from 'react';
import { History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  billingCycleLabel,
  formatSubscriptionDate,
  SubscriptionStatusBadge,
} from '@/features/plans/lib/subscription-display';
import type { Subscription } from '@/features/plans/types';

export function BillingHistorySheet({ history }: { history: Subscription[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="rounded-xl"
        onClick={() => setOpen(true)}
      >
        <History />
        Billing History
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Billing History</SheetTitle>
            <SheetDescription>
              Past and current subscriptions on your account.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-3 overflow-y-auto px-4 pb-6">
            {history.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center text-sm">
                No billing history yet.
              </p>
            ) : (
              history.map((item) => {
                const started = formatSubscriptionDate(item.started_at);
                const ended =
                  formatSubscriptionDate(item.ends_at) ??
                  formatSubscriptionDate(item.cancelled_at);

                return (
                  <Card key={item.id} className="gap-0 py-0">
                    <CardContent className="space-y-2 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-foreground text-sm font-semibold">
                            {item.plan_name}
                          </p>
                          <p className="text-muted-foreground mt-0.5 text-xs capitalize">
                            ${item.price}/
                            {billingCycleLabel(item.billing_cycle)} ·{' '}
                            {item.currency}
                          </p>
                        </div>
                        <SubscriptionStatusBadge status={item.status} />
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {started ? `Started ${started}` : null}
                        {ended ? ` · Ended ${ended}` : null}
                        {!ended && item.renews_at_label
                          ? ` · Renews ${item.renews_at_label}`
                          : null}
                      </p>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
