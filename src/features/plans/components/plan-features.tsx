import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlanFeature } from '@/features/plans/types';

export function PlanFeatureIcon({ included }: { included: boolean }) {
  return included ? (
    <span className="bg-primary/10 text-primary mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full">
      <Check className="size-2.5" strokeWidth={3} />
    </span>
  ) : (
    <span className="bg-muted text-muted-foreground/50 mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full">
      <X className="size-2.5" strokeWidth={3} />
    </span>
  );
}

export function PlanFeaturesList({ features }: { features: PlanFeature[] }) {
  return (
    <ul className="space-y-2.5">
      {features.map((feature) => (
        <li key={feature.key} className="flex items-start gap-2.5 text-sm">
          <PlanFeatureIcon included={feature.included} />
          <span
            className={cn(
              feature.included
                ? 'text-foreground font-medium'
                : 'text-muted-foreground',
            )}
          >
            {feature.label}
            {feature.note ? (
              <span className="text-muted-foreground font-normal">
                {' '}
                · {feature.note}
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function planActionLabel(action: string) {
  if (action === 'upgrade') return 'Upgrade';
  if (action === 'downgrade') return 'Downgrade';
  return 'Current Plan';
}
