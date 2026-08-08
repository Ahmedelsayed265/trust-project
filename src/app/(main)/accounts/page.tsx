import {
  getAccountsAction,
  getProvidersAction,
} from '@/features/accounts/actions/accounts';
import { AccountsView } from '@/features/accounts/components/accounts-view';

export default async function AccountsPage() {
  const [accountsResult, providersResult] = await Promise.all([
    getAccountsAction(),
    getProvidersAction(),
  ]);

  if (!accountsResult.ok) {
    return (
      <div className="border-border bg-card rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">
          Couldn&apos;t load accounts
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          {accountsResult.message}
        </p>
      </div>
    );
  }

  if (!providersResult.ok) {
    return (
      <div className="border-border bg-card rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">
          Couldn&apos;t load providers
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          {providersResult.message}
        </p>
      </div>
    );
  }

  return (
    <AccountsView
      initialData={{
        accounts: accountsResult.data.accounts,
        mode: accountsResult.data.mode,
        providers: providersResult.data,
      }}
    />
  );
}
