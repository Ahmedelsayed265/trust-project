"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type WalletAction = "deposit" | "withdraw";

const assets = ["USDT", "BTC", "ETH", "USD"] as const;
const DEPOSIT_ADDRESS = "0x7f2a9c14b8e3d1a6f0c5e2b9471d8a3f";

export function WalletTransferSheet({
  action,
  open,
  onOpenChange,
}: {
  action: WalletAction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [asset, setAsset] = useState<(typeof assets)[number]>("USDT");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [copied, setCopied] = useState(false);

  const isDeposit = action === "deposit";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(DEPOSIT_ADDRESS);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore clipboard errors in unsupported environments
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onOpenChange(false);
    setAmount("");
    setAddress("");
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="border-b border-border">
          <div className="flex items-center gap-3 pr-8">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-xl",
                isDeposit
                  ? "bg-primary/10 text-primary"
                  : "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300"
              )}
            >
              {isDeposit ? (
                <ArrowDownLeft className="size-5" />
              ) : (
                <ArrowUpRight className="size-5" />
              )}
            </div>
            <div>
              <SheetTitle>{isDeposit ? "Deposit" : "Withdraw"}</SheetTitle>
              <SheetDescription>
                {isDeposit
                  ? "Add funds to your TrustAI wallet."
                  : "Send funds from your available balance."}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4 scrollbar-none">
            <div className="space-y-2">
              <Label>Asset</Label>
              <div className="grid grid-cols-4 gap-2">
                {assets.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setAsset(item)}
                    className={cn(
                      "rounded-xl border px-2 py-2 text-sm font-semibold transition-colors",
                      asset === item
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallet-amount">Amount</Label>
              <Input
                id="wallet-amount"
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="h-11 rounded-xl"
                required
              />
            </div>

            {isDeposit ? (
              <div className="space-y-2">
                <Label>Deposit address</Label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                  <code className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">
                    {DEPOSIT_ADDRESS}
                  </code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Copy deposit address"
                    onClick={handleCopy}
                  >
                    <Copy />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {copied
                    ? "Address copied."
                    : `Send only ${asset} to this address.`}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="wallet-address">Destination address</Label>
                <Input
                  id="wallet-address"
                  placeholder="Enter wallet address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  className="h-11 rounded-xl font-mono text-xs"
                  required
                />
              </div>
            )}
          </div>

          <SheetFooter className="border-t border-border sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl sm:flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl sm:flex-1">
              {isDeposit ? "Confirm Deposit" : "Confirm Withdraw"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
