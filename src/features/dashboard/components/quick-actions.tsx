import Link from 'next/link';
import { ArrowLeftRight, Sparkles, Briefcase, Link2 } from 'lucide-react';
const actions = [
  {
    label: 'Trade',
    href: '/trades',
    icon: ArrowLeftRight,
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300',
  },
  {
    label: 'AI Signals',
    href: '/ai-signals',
    icon: Sparkles,
    color:
      'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300',
  },
  {
    label: 'Portfolio',
    href: '/portfolio',
    icon: Briefcase,
    color:
      'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300',
  },
  {
    label: 'Accounts',
    href: '/accounts',
    icon: Link2,
    color:
      'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300',
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map(({ label, href, icon: Icon, color }) => (
        <Link
          key={label}
          href={href}
          className="border-border bg-card hover:border-primary/30 hover:bg-accent/40 flex flex-col items-center justify-center gap-2.5 rounded-lg border p-4 transition-colors"
        >
          <div
            className={`flex size-11 items-center justify-center rounded-xl ${color}`}
          >
            <Icon className="size-5" />
          </div>
          <span className="text-foreground text-sm font-semibold">{label}</span>
        </Link>
      ))}
    </div>
  );
}
