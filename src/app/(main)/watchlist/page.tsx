import { getWatchlistAction } from '@/features/watchlist/actions/watchlist';
import { WatchlistView } from '@/features/watchlist';

export default async function WatchlistPage() {
  const result = await getWatchlistAction();

  if (!result.ok) {
    return (
      <div className="border-border bg-card rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">
          Couldn&apos;t load watchlist
        </p>
        <p className="text-muted-foreground mt-1 text-sm">{result.message}</p>
      </div>
    );
  }

  return <WatchlistView initialData={result.data} />;
}
