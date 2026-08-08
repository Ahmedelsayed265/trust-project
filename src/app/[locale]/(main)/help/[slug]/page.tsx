import { Link } from '@/i18n/navigation';
import { getHelpBySlugAction } from '@/features/help/actions/get-help';
import { HelpDetailView } from '@/features/help/components/help-detail-view';
import { Button } from '@/components/ui/button';

export default async function HelpArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getHelpBySlugAction(slug);

  if (!result.ok) {
    return (
      <div className="border-border bg-card mx-auto max-w-md rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">
          Couldn&apos;t load guide
        </p>
        <p className="text-muted-foreground mt-1 text-sm">{result.message}</p>
        <Button
          variant="outline"
          className="mt-4 rounded-xl"
          render={<Link href="/help" />}
        >
          Back to help
        </Button>
      </div>
    );
  }

  return <HelpDetailView article={result.data} />;
}
