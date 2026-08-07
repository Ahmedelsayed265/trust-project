import { createElement, type ComponentProps } from 'react';
import {
  Building,
  FileCheck2,
  IdCard,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

const VERIFICATION_ICONS: Record<string, LucideIcon> = {
  IdCard,
  FileCheck2,
  Building,
  ShieldCheck,
};

export function VerificationStepIcon({
  name,
  ...props
}: { name: string } & ComponentProps<LucideIcon>) {
  return createElement(VERIFICATION_ICONS[name] ?? ShieldCheck, props);
}
