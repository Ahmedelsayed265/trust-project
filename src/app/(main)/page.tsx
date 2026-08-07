import { getHomeAction } from '@/features/dashboard/actions/get-home';
import { HomeDashboard } from '@/features/dashboard';

export default async function HomePage() {
  const result = await getHomeAction();

  if (!result.ok) {
    return (
      <div className="border-border bg-card rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">
          Couldn&apos;t load home
        </p>
        <p className="text-muted-foreground mt-1 text-sm">{result.message}</p>
      </div>
    );
  }

  return <HomeDashboard data={result.data} />;
}
