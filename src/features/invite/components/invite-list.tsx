import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReferralInvite } from '@/features/invite/types';

type InviteListProps = {
  invites: ReferralInvite[];
};

export function InviteList({ invites }: InviteListProps) {
  return (
    <Card>
      <CardHeader className="border-border border-b">
        <CardTitle>Recent invites</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 pt-1">
        {invites.length === 0 ? (
          <p className="text-muted-foreground px-2 py-6 text-center text-sm">
            No invitations yet. Share your link or invite someone by email.
          </p>
        ) : (
          invites.map((invite) => <InviteRow key={invite.id} invite={invite} />)
        )}
      </CardContent>
    </Card>
  );
}

function InviteRow({ invite }: { invite: ReferralInvite }) {
  return (
    <div className="hover:bg-muted/40 flex items-center justify-between gap-3 rounded-xl px-2 py-3">
      <div className="min-w-0">
        <p className="text-foreground text-sm font-semibold">{invite.name}</p>
        <p className="text-muted-foreground text-xs">
          {invite.status_label}
          {invite.email ? ` · ${invite.email}` : ''}
        </p>
      </div>
      <p
        className={
          invite.is_done
            ? 'text-success text-sm font-semibold'
            : 'text-muted-foreground text-sm font-medium'
        }
      >
        {invite.reward}
      </p>
    </div>
  );
}
