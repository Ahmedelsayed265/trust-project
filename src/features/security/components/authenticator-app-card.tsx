'use client';

import { Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SecurityOverview } from '@/features/security/types';

export function AuthenticatorAppCard({
  data,
  pending,
  onEnable,
  onDisable,
}: {
  data: SecurityOverview;
  pending: boolean;
  onEnable: () => void;
  onDisable: () => void;
}) {
  return (
    <Card>
      <CardHeader className="border-border border-b">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
            <Smartphone className="size-5" />
          </div>
          <div>
            <CardTitle>Authenticator app</CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              Use Google Authenticator, Authy, or 1Password.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-border bg-muted/40 rounded-xl border px-3 py-3 text-sm">
          <p className="text-muted-foreground">Recovery codes left</p>
          <p className="text-foreground mt-1 font-semibold">
            {data.two_factor_enabled
              ? `${data.recovery_codes_left} remaining`
              : 'Enable 2FA to generate codes'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.two_factor_enabled ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              disabled={pending}
              onClick={onDisable}
            >
              Disable 2FA
            </Button>
          ) : (
            <Button
              type="button"
              className="rounded-xl"
              disabled={pending}
              onClick={onEnable}
            >
              {pending ? 'Starting…' : 'Enable 2FA'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
