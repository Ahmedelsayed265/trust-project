'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import {
  Check,
  KeyRound,
  Link2Off,
  Plug,
  ShieldAlert,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/shared/components/page-header';
import { cn } from '@/lib/utils';
import { formatMoney } from '@/shared/trading';
import {
  connectAccountAction,
  disconnectAccountAction,
  getAccountAction,
  setDefaultAccountAction,
  syncAccountsAction,
} from '@/features/accounts/actions/accounts';
import type {
  AccountProviderCatalogItem,
  AccountsListData,
  ConnectedAccount,
  SyncSnapshot,
} from '@/features/accounts/types';

export function AccountsView({
  initialData,
}: {
  initialData: AccountsListData;
}) {
  const t = useTranslations('Accounts');
  const tCommon = useTranslations('Common');
  const [accounts, setAccounts] = useState(initialData.accounts);
  const [providers] = useState(initialData.providers);
  const [mode] = useState(initialData.mode);
  const [snapshots, setSnapshots] = useState<Record<string, SyncSnapshot>>({});

  const defaultProviderId =
    accounts.find((account) => account.is_default)?.provider_id ??
    providers[0]?.id ??
    'binance-spot';

  const [selectedId, setSelectedId] = useState(defaultProviderId);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [environment, setEnvironment] = useState('paper');
  const [formError, setFormError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [connecting, startConnect] = useTransition();
  const [syncing, startSync] = useTransition();
  const [disconnecting, startDisconnect] = useTransition();
  const [settingDefault, startSetDefault] = useTransition();

  const selectedProvider = useMemo(
    () =>
      providers.find((provider) => provider.id === selectedId) ?? providers[0],
    [providers, selectedId],
  );

  const selectedAccount = accounts.find(
    (account) => account.provider_id === selectedId,
  );
  const isConnected = Boolean(selectedAccount?.is_connected);
  const selectedSnapshot = snapshots[selectedId];

  function upsertAccount(next: ConnectedAccount) {
    setAccounts((prev) => {
      const index = prev.findIndex(
        (account) => account.provider_id === next.provider_id,
      );
      if (index === -1) return [...prev, next];
      const copy = [...prev];
      copy[index] = next;
      return copy;
    });
  }

  useEffect(() => {
    let active = true;

    void getAccountAction(selectedId).then((result) => {
      if (!active) return;

      if (!result.ok) {
        if (result.status === 409) {
          setAccounts((prev) =>
            prev.filter((account) => account.provider_id !== selectedId),
          );
          setDetailError(null);
          return;
        }
        setDetailError(result.message);
        return;
      }

      setDetailError(null);
      upsertAccount(result.data);
    });

    return () => {
      active = false;
    };
  }, [selectedId]);

  function handleConnect(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedProvider) return;

    setFormError(null);
    startConnect(async () => {
      const result = await connectAccountAction({
        provider_id: selectedProvider.id,
        api_key: apiKey,
        api_secret: apiSecret,
        environment:
          selectedProvider.id === 'alpaca'
            ? environment
            : (selectedProvider.environments[0] ?? 'live'),
      });

      if (!result.ok) {
        setFormError(result.message);
        toast.error(result.message);
        return;
      }

      upsertAccount(result.data);
      setApiKey('');
      setApiSecret('');
      toast.success(t('toastConnected', { label: result.data.label }));
    });
  }

  function handleSync(providerId?: string) {
    startSync(async () => {
      const result = await syncAccountsAction(
        providerId ? { provider_id: providerId } : undefined,
      );
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setAccounts(result.data.accounts);
      setSnapshots((prev) => {
        const next = { ...prev };
        for (const entry of result.data.synced) {
          next[entry.provider_id] = entry.snapshot;
        }
        return next;
      });
      toast.success(t('toastRefreshed'));
    });
  }

  function handleDisconnect(providerId: string) {
    startDisconnect(async () => {
      const result = await disconnectAccountAction(providerId);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      upsertAccount(result.data);
      setSnapshots((prev) => {
        const next = { ...prev };
        delete next[providerId];
        return next;
      });
      toast.success(t('toastDisconnected'));
    });
  }

  function handleSetDefault(providerId: string) {
    startSetDefault(async () => {
      const result = await setDefaultAccountAction(providerId);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setAccounts(result.data);
      toast.success(t('toastDefaultUpdated'));
    });
  }

  function environmentLabel(env: string) {
    if (env === 'paper') return tCommon('paper');
    if (env === 'live') return tCommon('liveEnv');
    return env;
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title={t('title')}
        description={t('description')}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {mode && (
              <span className="bg-muted text-muted-foreground rounded-md px-2.5 py-1 text-xs font-medium capitalize">
                {t('mode', { mode })}
              </span>
            )}
            <Button
              variant="outline"
              className="rounded-md"
              disabled={syncing}
              onClick={() => handleSync()}
            >
              {syncing ? t('syncing') : t('syncNow')}
            </Button>
          </div>
        }
      />

      {(formError || detailError) && (
        <div className="border-destructive/30 bg-destructive/5 text-destructive flex items-start gap-2 rounded-[12px] border px-4 py-3 text-sm">
          <ShieldAlert className="mt-0.5 size-4 shrink-0" />
          <p>{formError ?? detailError}</p>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <div className="space-y-3">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              account={accounts.find(
                (item) => item.provider_id === provider.id,
              )}
              active={selectedId === provider.id}
              onSelect={() => setSelectedId(provider.id)}
            />
          ))}
        </div>

        {selectedProvider && (
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <KeyRound className="text-primary size-4" />
                {selectedProvider.display_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isConnected && selectedAccount ? (
                <>
                  <div className="border-border space-y-1.5 rounded-[12px] border px-3 py-3 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-foreground font-medium">
                        {selectedAccount.label}
                      </p>
                      {selectedAccount.is_default && (
                        <span className="text-primary bg-primary/10 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold">
                          <Star className="size-3" />
                          {tCommon('default')}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {t('environmentValue', {
                        env: selectedAccount.environment,
                      })}
                    </p>
                    <p className="text-muted-foreground">
                      {t('apiKeyMasked', {
                        key: selectedAccount.api_key_masked ?? '—',
                      })}
                    </p>
                    <p className="text-muted-foreground">
                      {t('permissions', {
                        list: selectedAccount.permissions.join(', ') || '—',
                      })}
                    </p>
                    <p className="text-muted-foreground">
                      {selectedAccount.last_synced_label
                        ? t('lastSync', {
                            label: selectedAccount.last_synced_label,
                          })
                        : t('lastSyncNever')}
                    </p>
                    {selectedSnapshot && (
                      <p className="text-foreground mt-2 font-semibold">
                        {t('equityBuyingPower', {
                          equity: formatMoney(
                            selectedSnapshot.equity,
                            selectedSnapshot.currency,
                          ),
                          buyingPower: formatMoney(
                            selectedSnapshot.buying_power,
                            selectedSnapshot.currency,
                          ),
                        })}
                      </p>
                    )}
                    {selectedAccount.error_message && (
                      <p className="text-destructive mt-2">
                        {selectedAccount.error_message}
                      </p>
                    )}
                  </div>

                  <p className="text-muted-foreground text-xs">
                    {t('fundNote')}
                  </p>

                  <div className="grid gap-2">
                    <Button
                      variant="outline"
                      className="w-full rounded-md"
                      disabled={syncing}
                      onClick={() => handleSync(selectedId)}
                    >
                      {syncing ? t('syncing') : t('syncThisAccount')}
                    </Button>
                    {!selectedAccount.is_default && (
                      <Button
                        variant="outline"
                        className="w-full rounded-md"
                        disabled={settingDefault}
                        onClick={() => handleSetDefault(selectedId)}
                      >
                        <Star className="size-4" />
                        {settingDefault
                          ? tCommon('updating')
                          : t('setAsDefault')}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="w-full rounded-md"
                      disabled={disconnecting}
                      onClick={() => handleDisconnect(selectedId)}
                    >
                      <Link2Off className="size-4" />
                      {disconnecting ? t('disconnecting') : t('disconnect')}
                    </Button>
                  </div>

                  <p className="text-success flex items-center gap-1.5 text-xs font-medium">
                    <Check className="size-3.5" />
                    {t('credentialsStored')}
                  </p>
                </>
              ) : (
                <form onSubmit={handleConnect} className="space-y-3">
                  {selectedProvider.environments.length > 1 && (
                    <Field>
                      <FieldLabel htmlFor="account-environment">
                        {t('environment')}
                      </FieldLabel>
                      <FieldContent>
                        <Select
                          value={environment}
                          onValueChange={(value) => {
                            if (value) setEnvironment(value);
                          }}
                          items={selectedProvider.environments.map((env) => ({
                            value: env,
                            label: environmentLabel(env),
                          }))}
                        >
                          <SelectTrigger
                            id="account-environment"
                            className="h-10 w-full min-w-0 rounded-md data-[size=default]:h-10"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent
                            align="start"
                            alignItemWithTrigger={false}
                          >
                            {selectedProvider.environments.map((env) => (
                              <SelectItem key={env} value={env}>
                                {environmentLabel(env)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FieldContent>
                    </Field>
                  )}

                  <Field>
                    <FieldLabel>{t('apiKey')}</FieldLabel>
                    <FieldContent>
                      <Input
                        value={apiKey}
                        onChange={(event) => setApiKey(event.target.value)}
                        autoComplete="off"
                        minLength={8}
                        className="h-10 rounded-md"
                        required
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>{t('apiSecret')}</FieldLabel>
                    <FieldContent>
                      <Input
                        type="password"
                        value={apiSecret}
                        onChange={(event) => setApiSecret(event.target.value)}
                        autoComplete="off"
                        minLength={8}
                        className="h-10 rounded-md"
                        required
                      />
                    </FieldContent>
                  </Field>

                  <Button
                    type="submit"
                    className="w-full rounded-md"
                    disabled={connecting}
                  >
                    <Plug className="size-4" />
                    {connecting ? t('connecting') : t('connectProvider')}
                  </Button>

                  <p className="text-muted-foreground text-xs">
                    {t('permissionHint')}
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function ProviderCard({
  provider,
  account,
  active,
  onSelect,
}: {
  provider: AccountProviderCatalogItem;
  account?: ConnectedAccount;
  active: boolean;
  onSelect: () => void;
}) {
  const t = useTranslations('Accounts');
  const tCommon = useTranslations('Common');
  const connected = Boolean(account?.is_connected);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full rounded-[12px] border px-4 py-4 text-left transition-colors',
        active
          ? 'border-primary bg-primary/3'
          : 'border-border bg-card hover:border-primary/40',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-foreground font-semibold">
              {provider.display_name}
            </p>
            {account?.is_default && (
              <span className="text-primary bg-primary/10 rounded-md px-2 py-0.5 text-[11px] font-semibold">
                {tCommon('default')}
              </span>
            )}
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {provider.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {provider.capabilities.slice(0, 5).map((cap) => (
              <span
                key={cap}
                className="border-border text-muted-foreground rounded-md border px-2 py-0.5 text-[11px]"
              >
                {cap}
              </span>
            ))}
          </div>
          {account?.last_synced_label && connected && (
            <p className="text-muted-foreground mt-2 text-xs">
              {t('synced', { label: account.last_synced_label })}
            </p>
          )}
        </div>
        <span
          className={cn(
            'shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize',
            connected
              ? 'text-success bg-emerald-50 dark:bg-emerald-950/40'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {connected ? tCommon('connected') : tCommon('notConnected')}
        </span>
      </div>
    </button>
  );
}
