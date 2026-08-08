import { getHelpAction } from '@/features/help/actions/get-help';
import { HelpView } from '@/features/help';

export default async function HelpPage() {
  const result = await getHelpAction();

  if (!result.ok) {
    return (
      <div className="border-border bg-card rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">
          Couldn&apos;t load help center
        </p>
        <p className="text-muted-foreground mt-1 text-sm">{result.message}</p>
      </div>
    );
  }

  return <HelpView initialData={result.data} />;
}
