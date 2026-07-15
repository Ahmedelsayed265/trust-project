import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { comparisonRows, plans } from "@/features/plans/data/plans";
import { cn } from "@/lib/utils";

export function PlanComparison() {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-foreground sm:text-lg">
        Plan Comparison
      </h2>

      <Card className="gap-0 overflow-hidden py-0">
        <CardContent className="p-0">
          <div className="scrollbar-thin min-w-0 overflow-x-auto">
            <Table className="min-w-[680px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-auto px-4 py-4 text-muted-foreground sm:px-5">
                    Features
                  </TableHead>
                  {plans.map((plan) => {
                    const Icon = plan.icon;
                    return (
                      <TableHead
                        key={plan.id}
                        className="h-auto px-3 py-4 text-center"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Icon className="size-4" />
                          </span>
                          <span className="text-xs font-semibold whitespace-normal text-foreground sm:text-sm">
                            {plan.name}
                          </span>
                          {plan.popular && (
                            <Badge className="border-0 px-2 py-0 text-[10px]">
                              Most Popular
                            </Badge>
                          )}
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonRows.map((row) => (
                  <TableRow key={row.feature}>
                    <TableCell className="px-4 py-3.5 font-medium whitespace-normal text-foreground sm:px-5">
                      {row.feature}
                    </TableCell>
                    {plans.map((plan) => (
                      <TableCell key={plan.id} className="px-3 py-3.5 text-center">
                        {row.values[plan.id] ? (
                          <Check
                            className={cn("mx-auto size-4 text-primary")}
                            strokeWidth={2.5}
                          />
                        ) : (
                          <X
                            className="mx-auto size-4 text-muted-foreground/45"
                            strokeWidth={2.5}
                          />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
