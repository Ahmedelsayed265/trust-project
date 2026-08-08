import { createElement, type ComponentProps } from 'react';
import {
  ArrowLeftRight,
  BookOpen,
  ClipboardList,
  CreditCard,
  LineChart,
  Rocket,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

const HELP_ICONS: Record<string, LucideIcon> = {
  Rocket,
  LineChart,
  ArrowLeftRight,
  ClipboardList,
  ShieldCheck,
  CreditCard,
  BookOpen,
};

export function HelpIcon({
  name,
  ...props
}: { name: string } & ComponentProps<LucideIcon>) {
  return createElement(HELP_ICONS[name] ?? BookOpen, props);
}
