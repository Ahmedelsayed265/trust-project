"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Gift,
  Share2,
  UserPlus,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/shared/components/page-header";
import { currentUser } from "@/shared/lib/user";

const REFERRAL_CODE = "AMMAR25";
const REFERRAL_LINK = `https://trustai.app/register?ref=${REFERRAL_CODE}`;

const rewards = [
  {
    title: "You earn $25",
    description: "Credit added when your friend funds and places their first trade.",
  },
  {
    title: "They earn $15",
    description: "Welcome bonus unlocked after verification and first deposit.",
  },
  {
    title: "Unlimited invites",
    description: "No cap on referrals — keep sharing and stacking rewards.",
  },
];

const recentInvites = [
  { name: "Sara K.", status: "Joined", reward: "+$25", done: true },
  { name: "Omar H.", status: "Pending deposit", reward: "—", done: false },
  { name: "Lina M.", status: "Joined", reward: "+$25", done: true },
];

export function InviteFriendsView() {
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  async function copyValue(value: string, type: "code" | "link") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(type);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      // ignore clipboard errors in unsupported environments
    }
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Invite Friends"
        description="Share TrustAI and earn rewards when friends get started."
        actions={
          <Badge className="border-0 bg-emerald-50 text-success hover:bg-emerald-50 dark:bg-emerald-950/40">
            Rewards
          </Badge>
        }
      />

      <Card className="border-primary/20 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-slate-900">
        <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Gift className="size-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Your referral total</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                $50.00
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                2 friends rewarded · Shared by {currentUser.name}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:min-w-[220px]">
            <div className="rounded-xl border border-border/70 bg-background/80 px-3 py-2.5">
              <p className="text-xs text-muted-foreground">Invites sent</p>
              <p className="mt-1 text-lg font-bold text-foreground">8</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/80 px-3 py-2.5">
              <p className="text-xs text-muted-foreground">Joined</p>
              <p className="mt-1 text-lg font-bold text-foreground">3</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Share2 className="size-5" />
              </div>
              <div>
                <CardTitle>Share your invite</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Send your link or code — rewards unlock after first trade.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Referral code</p>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={REFERRAL_CODE}
                  className="h-12 rounded-xl bg-background px-3 font-semibold tracking-wide"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 shrink-0 rounded-xl px-4"
                  onClick={() => copyValue(REFERRAL_CODE, "code")}
                >
                  {copied === "code" ? <Check /> : <Copy />}
                  {copied === "code" ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Invite link</p>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={REFERRAL_LINK}
                  className="h-12 rounded-xl bg-background px-3 font-mono text-xs"
                />
                <Button
                  type="button"
                  className="h-12 shrink-0 rounded-xl px-4"
                  onClick={() => copyValue(REFERRAL_LINK, "link")}
                >
                  {copied === "link" ? <Check /> : <Copy />}
                  {copied === "link" ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-xl"
              onClick={() => copyValue(REFERRAL_LINK, "link")}
            >
              <UserPlus />
              Copy invite link
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-success dark:bg-emerald-950/40">
                <Users className="size-5" />
              </div>
              <div>
                <CardTitle>How rewards work</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Simple steps for both you and your friends.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {rewards.map((reward, index) => (
              <div
                key={reward.title}
                className="flex gap-3 rounded-xl border border-border bg-background p-3"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {reward.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {reward.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle>Recent invites</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 pt-1">
          {recentInvites.map((invite) => (
            <div
              key={invite.name}
              className="flex items-center justify-between gap-3 rounded-xl px-2 py-3 hover:bg-muted/40"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {invite.name}
                </p>
                <p className="text-xs text-muted-foreground">{invite.status}</p>
              </div>
              <p
                className={
                  invite.done
                    ? "text-sm font-semibold text-success"
                    : "text-sm font-medium text-muted-foreground"
                }
              >
                {invite.reward}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
