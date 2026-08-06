import { ArrowUpRight } from 'lucide-react';

export function AISignal() {
  return (
    <div className="border-border bg-card flex h-full flex-col rounded-lg border p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-foreground text-base font-semibold">AI Signal</h2>
        <span className="text-muted-foreground text-xs">Updated 30s ago</span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="flex size-20 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40">
          <div className="flex flex-col items-center">
            <ArrowUpRight className="text-success size-7" strokeWidth={2.5} />
            <span className="text-success mt-0.5 text-lg font-bold tracking-wide">
              BUY
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-foreground text-base font-bold">BTC/USDT</span>
          <span className="text-success rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold dark:bg-emerald-950/40">
            Strong Signal
          </span>
        </div>

        <div className="w-full">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">AI Confidence</span>
            <span className="text-foreground font-semibold">78%</span>
          </div>
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: '78%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
