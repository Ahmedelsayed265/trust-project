import { Gem, Shield, Star, type LucideIcon } from 'lucide-react';

const PLAN_ICONS: Record<string, LucideIcon> = {
  Shield,
  Star,
  Gem,
};

export function planIcon(name: string): LucideIcon {
  return PLAN_ICONS[name] ?? Shield;
}
