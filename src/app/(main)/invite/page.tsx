import { getReferralsAction } from '@/features/invite/actions/referrals';
import { InviteFriendsView } from '@/features/invite';

export default async function InviteFriendsPage() {
  const result = await getReferralsAction();

  if (!result.ok) {
    return (
      <div className="border-border bg-card rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">
          Couldn&apos;t load referrals
        </p>
        <p className="text-muted-foreground mt-1 text-sm">{result.message}</p>
      </div>
    );
  }

  return <InviteFriendsView data={result.data} />;
}
