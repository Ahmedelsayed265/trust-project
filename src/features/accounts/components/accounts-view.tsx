'use client';

import { useState } from 'react';
import { Check, KeyRound, Link2Off, Plug, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import { PageHeader } from '@/shared/components/page-header';
import { cn } from '@/lib/utils';
import { formatMoney, useTrading, type ProviderId } from '@/shared/trading';
import { ProviderError } from '@/shared/trading/types';

export function AccountsView() {
  const {
    providers,
    activeProviderId,
    setActiveProviderId,
    accounts,
    snapshot,
    loading,
    error,
    connect,
    disconnect,
    refresh,
  } = useTrading();

  const [selectedId, setSelectedId] = useState<ProviderId>(activeProviderId);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [environment, setEnvironment] = useState('paper');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selected = providers.find((p) => p.id === selectedId)!;
  const selectedAccount = accounts.find((a) => a.providerId === selectedId);
  const isConnected = selectedAccount?.status === 'connected';

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await connect(selectedId, {
        apiKey,
        apiSecret,
        environment: selectedId === 'alpaca' ? environment : 'live',
      });
      setApiKey('');
      setApiSecret('');
    } catch (err) {
      setFormError(
        err instanceof ProviderError
          ? err.message
          : 'Could not connect provider.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Connected Accounts"
        description="Link Binance Spot or Alpaca. Balances, positions, and orders are read from the provider — TrustAI does not hold an internal wallet."
        actions={
          <Button
            variant="outline"
            className="rounded-md"
            onClick={() => void refresh()}
          >
            Sync now
          </Button>
        }
      />

      {(error || formError) && (
        <div className="border-destructive/30 bg-destructive/5 text-destructive flex items-start gap-2 rounded-[12px] border px-4 py-3 text-sm">
          <ShieldAlert className="mt-0.5 size-4 shrink-0" />
          <p>{formError ?? error}</p>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <div className="space-y-3">
          {providers.map((provider) => {
            const account = accounts.find((a) => a.providerId === provider.id);
            const active = selectedId === provider.id;
            const connected = account?.status === 'connected';

            return (
              <button
                key={provider.id}
                type="button"
                onClick={() => {
                  setSelectedId(provider.id);
                  setActiveProviderId(provider.id);
                }}
                className={cn(
                  'w-full rounded-[12px] border px-4 py-4 text-left transition-colors',
                  active
                    ? 'border-primary bg-primary/3'
                    : 'border-border bg-card hover:border-primary/40',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-foreground font-semibold">
                      {provider.displayName}
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {provider.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {[...provider.capabilities]
                        .filter(
                          (c) => c !== 'inAppDeposit' && c !== 'inAppWithdraw',
                        )
                        .slice(0, 5)
                        .map((cap) => (
                          <span
                            key={cap}
                            className="border-border text-muted-foreground rounded-md border px-2 py-0.5 text-[11px]"
                          >
                            {cap}
                          </span>
                        ))}
                    </div>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold',
                      connected
                        ? 'text-success bg-emerald-50 dark:bg-emerald-950/40'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {connected ? 'Connected' : 'Not connected'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <KeyRound className="text-primary size-4" />
              {selected.displayName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isConnected ? (
              <>
                <div className="border-border rounded-[12px] border px-3 py-3 text-sm">
                  <p className="text-foreground font-medium">
                    {selectedAccount?.label}
                  </p>
                  <p className="text-muted-foreground mt-1">
                    Environment: {selectedAccount?.environment}
                  </p>
                  <p className="text-muted-foreground mt-1">
                    Permissions:{' '}
                    {selectedAccount?.permissions.join(', ') || '—'}
                  </p>
                  {snapshot && activeProviderId === selectedId && (
                    <p className="text-foreground mt-2 font-semibold">
                      Equity {formatMoney(snapshot.equity, snapshot.currency)} ·
                      Buying power{' '}
                      {formatMoney(snapshot.buyingPower, snapshot.currency)}
                    </p>
                  )}
                </div>
                <p className="text-muted-foreground text-xs">
                  Fund or withdraw on the provider&apos;s site (Binance /
                  Alpaca). This app does not custody funds or run internal
                  deposits.
                </p>
                <Button
                  variant="outline"
                  className="w-full rounded-md"
                  onClick={() => void disconnect(selectedId)}
                >
                  <Link2Off className="size-4" />
                  Disconnect
                </Button>
              </>
            ) : (
              <form onSubmit={handleConnect} className="space-y-3">
                {selectedId === 'alpaca' && (
                  <Field>
                    <FieldLabel>Environment</FieldLabel>
                    <FieldContent>
                      <select
                        value={environment}
                        onChange={(e) => setEnvironment(e.target.value)}
                        className="border-input bg-card h-10 w-full rounded-md border px-3 text-sm outline-none"
                      >
                        <option value="paper">Paper</option>
                        <option value="live">Live</option>
                      </select>
                    </FieldContent>
                  </Field>
                )}
                <Field>
                  <FieldLabel>API Key</FieldLabel>
                  <FieldContent>
                    <Input
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      autoComplete="off"
                      className="h-10 rounded-md"
                      required
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>API Secret</FieldLabel>
                  <FieldContent>
                    <Input
                      type="password"
                      value={apiSecret}
                      onChange={(e) => setApiSecret(e.target.value)}
                      autoComplete="off"
                      className="h-10 rounded-md"
                      required
                    />
                  </FieldContent>
                </Field>
                <Button
                  type="submit"
                  className="w-full rounded-md"
                  disabled={submitting || loading}
                >
                  <Plug className="size-4" />
                  {submitting ? 'Connecting…' : 'Connect provider'}
                </Button>
                <p className="text-muted-foreground text-xs">
                  Keys should be scoped read/trade only. Production apps must
                  store secrets on a secure backend — never in the browser.
                </p>
              </form>
            )}

            {isConnected && (
              <p className="text-success flex items-center gap-1.5 text-xs font-medium">
                <Check className="size-3.5" />
                Data synced from provider APIs only
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
