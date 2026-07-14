import { ArrowUpRight } from "lucide-react";

export function AISignal() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">AI Signal</h2>
        <span className="text-xs text-muted-foreground">Updated 30s ago</span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="flex size-20 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40">
          <div className="flex flex-col items-center">
            <ArrowUpRight className="size-7 text-success" strokeWidth={2.5} />
            <span className="mt-0.5 text-lg font-bold tracking-wide text-success">
              BUY
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-foreground">BTC/USDT</span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-success dark:bg-emerald-950/40">
            Strong Signal
          </span>
        </div>

        <div className="w-full">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">AI Confidence</span>
            <span className="font-semibold text-foreground">78%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: "78%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
