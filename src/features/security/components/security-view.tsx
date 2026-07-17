"use client";

import { useState } from "react";
import {
  KeyRound,
  ShieldCheck,
  Smartphone,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/shared/components/page-header";
import { cn } from "@/lib/utils";

export function SecurityView() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSavePassword(event: React.FormEvent) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Security"
        description="Manage password protection and two-factor authentication."
      />

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-2xl",
                twoFactorEnabled
                  ? "bg-emerald-50 text-success dark:bg-emerald-950/40"
                  : "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300"
              )}
            >
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">2FA status</p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                {twoFactorEnabled ? "Enabled" : "Disabled"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Authenticator app · Last verified 2 days ago
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Two-factor authentication
              </p>
              <p className="text-xs text-muted-foreground">
                Require a code at login
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
              aria-label="Toggle two-factor authentication"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Smartphone className="size-5" />
              </div>
              <div>
                <CardTitle>Authenticator app</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Use Google Authenticator, Authy, or 1Password.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/40 px-3 py-3 text-sm">
              <p className="text-muted-foreground">Primary device</p>
              <p className="mt-1 font-semibold text-foreground">
                iPhone 15 · Authenticator
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" className="rounded-xl">
                View recovery codes
              </Button>
              <Button type="button" className="rounded-xl">
                Reconfigure 2FA
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                <KeyRound className="size-5" />
              </div>
              <div>
                <CardTitle>Change password</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Use a strong password you don't reuse elsewhere.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSavePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current password</Label>
                <Input
                  id="current-password"
                  type="password"
                  autoComplete="current-password"
                  className="h-12 rounded-xl bg-background px-2.5"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  className="h-12 rounded-xl bg-background px-2.5"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  className="h-12 rounded-xl bg-background px-2.5"
                  required
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="min-h-5">
                  {saved && (
                    <p className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
                      <Check className="size-4" />
                      Password updated
                    </p>
                  )}
                </div>
                <Button type="submit" className="rounded-xl">
                  Update password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
