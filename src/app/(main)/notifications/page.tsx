import { getNotificationsAction } from '@/features/notifications/actions/notifications';
import { NotificationsView } from '@/features/notifications/components/notifications-view';

export default async function NotificationsPage() {
  const result = await getNotificationsAction({ page: 1, per_page: 20 });

  if (!result.ok) {
    return (
      <div className="border-border bg-card rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">
          Couldn&apos;t load notifications
        </p>
        <p className="text-muted-foreground mt-1 text-sm">{result.message}</p>
      </div>
    );
  }

  return <NotificationsView initialData={result.data} />;
}
