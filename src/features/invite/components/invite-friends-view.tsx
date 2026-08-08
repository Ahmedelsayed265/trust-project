'use client';

import { Badge } from '@/components/ui/badge';
import { InviteList } from '@/features/invite/components/invite-list';
import { InviteRewardsCard } from '@/features/invite/components/invite-rewards-card';
import { InviteShareCard } from '@/features/invite/components/invite-share-card';
import { InviteStatsCard } from '@/features/invite/components/invite-stats-card';
import { useInviteFriends } from '@/features/invite/hooks/use-invite-friends';
import type { ReferralsData } from '@/features/invite/types';
import { PageHeader } from '@/shared/components/page-header';
import { useCurrentUser } from '@/shared/providers/user-provider';

type InviteFriendsViewProps = {
  data: ReferralsData;
};

export function InviteFriendsView({ data }: InviteFriendsViewProps) {
  const user = useCurrentUser();
  const invite = useInviteFriends({
    initialInvites: data.invites,
    initialStats: data.stats,
  });

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Invite Friends"
        description="Share TrustAI and earn rewards when friends get started."
        actions={
          <Badge className="text-success border-0 bg-emerald-50 hover:bg-emerald-50 dark:bg-emerald-950/40">
            Rewards
          </Badge>
        }
      />

      <InviteStatsCard stats={invite.stats} sharedBy={user.name} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <InviteShareCard
          code={data.code}
          link={data.link}
          email={invite.email}
          name={invite.name}
          copied={invite.copied}
          pending={invite.pending}
          onEmailChange={invite.setEmail}
          onNameChange={invite.setName}
          onCopy={invite.copyValue}
          onSubmit={invite.submitInvite}
        />
        <InviteRewardsCard rewards={data.rewards} />
      </div>

      <InviteList invites={invite.invites} />
    </div>
  );
}
