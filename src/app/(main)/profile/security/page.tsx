import { getSecurityAction } from '@/features/security/actions/get-security';
import { SecurityView } from '@/features/security';

export default async function SecurityPage() {
  const result = await getSecurityAction();

  if (!result.ok) {
    return (
      <div className="border-border bg-card rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">
          Couldn&apos;t load security settings
        </p>
        <p className="text-muted-foreground mt-1 text-sm">{result.message}</p>
      </div>
    );
  }

  return <SecurityView data={result.data} />;
}
