import { getAccountsAction } from '@/features/accounts/actions/accounts';
import { AccountsView } from '@/features/accounts/components/accounts-view';

export default async function AccountsPage() {
  const result = await getAccountsAction();

  if (!result.ok) {
    return (
      <div className="border-border bg-card rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">
          Couldn&apos;t load accounts
        </p>
        <p className="text-muted-foreground mt-1 text-sm">{result.message}</p>
      </div>
    );
  }

  return <AccountsView initialData={result.data} />;
}
