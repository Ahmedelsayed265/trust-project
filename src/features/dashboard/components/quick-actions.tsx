import { ArrowLeftRight, Sparkles, Briefcase, Wallet } from "lucide-react";

const actions = [
  {
    label: "Trade",
    icon: ArrowLeftRight,
    color:
      "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300",
  },
  {
    label: "AI Signals",
    icon: Sparkles,
    color:
      "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300",
  },
  {
    label: "Portfolio",
    icon: Briefcase,
    color:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  {
    label: "Wallet",
    icon: Wallet,
    color:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map(({ label, icon: Icon, color }) => (
        <button
          key={label}
          type="button"
          className="flex flex-col items-center justify-center gap-2.5 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-accent/40"
        >
          <div
            className={`flex size-11 items-center justify-center rounded-xl ${color}`}
          >
            <Icon className="size-5" />
          </div>
          <span className="text-sm font-semibold text-foreground">{label}</span>
        </button>
      ))}
    </div>
  );
}
