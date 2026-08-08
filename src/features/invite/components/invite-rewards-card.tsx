import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReferralReward } from '@/features/invite/types';

type InviteRewardsCardProps = {
  rewards: ReferralReward[];
};

export function InviteRewardsCard({ rewards }: InviteRewardsCardProps) {
  return (
    <Card>
      <CardHeader className="border-border border-b">
        <div className="flex items-start gap-3">
          <div className="text-success flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
            <Users className="size-5" />
          </div>
          <div>
            <CardTitle>How rewards work</CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              Simple steps for both you and your friends.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {rewards.map((reward, index) => (
          <div
            key={reward.title}
            className="border-border bg-background flex gap-3 rounded-xl border p-3"
          >
            <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
              {index + 1}
            </div>
            <div>
              <p className="text-foreground text-sm font-semibold">
                {reward.title}
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                {reward.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
