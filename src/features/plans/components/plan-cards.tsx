import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  getPlanFeatures,
  plans,
  type Plan,
} from "@/features/plans/data/plans";

function FeatureIcon({ included }: { included: boolean }) {
  return included ? (
    <Check className="size-4 shrink-0 text-primary" strokeWidth={2.5} />
  ) : (
    <X className="size-4 shrink-0 text-muted-foreground/45" strokeWidth={2.5} />
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const Icon = plan.icon;
  const features = getPlanFeatures(plan.id);

  return (
    <Card
      className={cn(
        "relative gap-0 overflow-hidden py-0",
        plan.popular && "ring-2 ring-primary"
      )}
    >
      {plan.popular && (
        <div className="bg-primary px-3 py-1.5 text-center text-[11px] font-bold tracking-wider text-primary-foreground uppercase">
          Most Popular
        </div>
      )}

      <CardHeader className="gap-4 pt-5">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <div>
          <CardTitle className="text-lg">{plan.name}</CardTitle>
          <CardDescription className="mt-1.5 text-sm leading-relaxed">
            {plan.tagline}
          </CardDescription>
        </div>
        <p className="text-3xl font-bold tracking-tight text-foreground">
          ${plan.price}
          <span className="text-sm font-medium text-muted-foreground">
            {" "}
            /month
          </span>
        </p>
        <Button
          className="h-10 w-full rounded-xl"
          variant={
            plan.action === "upgrade"
              ? "default"
              : plan.action === "current"
                ? "secondary"
                : "outline"
          }
          disabled={plan.action === "current"}
        >
          {plan.action === "upgrade"
            ? "Upgrade"
            : plan.action === "current"
              ? "Current Plan"
              : "Downgrade"}
        </Button>
      </CardHeader>

      <CardContent className="pb-5">
        <ul className="space-y-2.5 border-t border-border pt-4">
          {features.map((feature) => (
            <li
              key={feature.label}
              className="flex items-start gap-2.5 text-sm"
            >
              <FeatureIcon included={feature.included} />
              <span
                className={cn(
                  feature.included
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {feature.label}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function PlanCards() {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-foreground sm:text-lg">
        Choose the plan that fits your trading journey.
      </h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
}
