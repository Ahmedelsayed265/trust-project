import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function subscriptionStatusClass(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === 'active') {
    return 'bg-primary/10 text-primary';
  }

  if (normalized === 'cancelled' || normalized === 'canceled') {
    return 'bg-destructive/10 text-destructive';
  }

  if (normalized === 'expired') {
    return 'bg-muted text-muted-foreground';
  }

  return 'bg-muted text-muted-foreground';
}

export function SubscriptionStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <Badge
      className={cn(
        'border-0 capitalize',
        subscriptionStatusClass(status),
        className,
      )}
    >
      {status}
    </Badge>
  );
}

export function formatSubscriptionDate(value: string | null | undefined) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function billingCycleLabel(cycle: string) {
  if (cycle === 'yearly') return 'year';
  if (cycle === 'monthly') return 'month';
  return cycle;
}
