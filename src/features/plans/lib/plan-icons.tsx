import { createElement, type ComponentProps } from 'react';
import { Gem, Shield, Star, type LucideIcon } from 'lucide-react';

const PLAN_ICONS: Record<string, LucideIcon> = {
  Shield,
  Star,
  Gem,
};

export function PlanIcon({
  name,
  ...props
}: { name: string } & ComponentProps<LucideIcon>) {
  return createElement(PLAN_ICONS[name] ?? Shield, props);
}
