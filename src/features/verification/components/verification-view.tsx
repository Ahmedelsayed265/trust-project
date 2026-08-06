'use client';

import {
  BadgeCheck,
  Building,
  CheckCircle2,
  Clock3,
  FileCheck2,
  IdCard,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/shared/components/page-header';
import { useCurrentUser } from '@/shared/providers/user-provider';
import { cn } from '@/lib/utils';

const steps = [
  {
    title: 'Personal details',
    description: 'Legal name, date of birth, and contact information.',
    status: 'complete' as const,
    icon: IdCard,
  },
  {
    title: 'Identity document',
    description: 'Passport or national ID uploaded and reviewed.',
    status: 'complete' as const,
    icon: FileCheck2,
  },
  {
    title: 'Address verification',
    description: 'Proof of residence confirmed against submitted documents.',
    status: 'complete' as const,
    icon: Building,
  },
];

export function VerificationView() {
  const user = useCurrentUser();

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Verification"
        description="Identity and KYC status for your TrustAI account."
        actions={
          <Badge className="text-success border-0 bg-emerald-50 hover:bg-emerald-50 dark:bg-emerald-950/40">
            {user.kyc_verified ? 'Verified' : 'Pending'}
          </Badge>
        }
      />

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="text-success flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40">
              <BadgeCheck className="size-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">KYC status</p>
              <p className="text-foreground mt-1 text-2xl font-bold tracking-tight">
                {user.kyc_verified
                  ? 'Fully verified'
                  : (user.kyc_status ?? 'Unverified')}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                {user.name}
                {user.member_since_label
                  ? ` · Member since ${user.member_since_label}`
                  : null}
              </p>
            </div>
          </div>
          <div className="border-border bg-muted/40 rounded-xl border px-3 py-2 text-sm">
            <p className="text-muted-foreground">Review level</p>
            <p className="text-foreground mt-0.5 font-semibold">
              {user.kyc_level ?? '—'}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {steps.map(({ title, description, status, icon: Icon }) => (
          <Card key={title}>
            <CardHeader className="flex-row items-start gap-3 space-y-0">
              <div
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-xl',
                  status === 'complete'
                    ? 'text-success bg-emerald-50 dark:bg-emerald-950/40'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">{title}</CardTitle>
                  {status === 'complete' && (
                    <CheckCircle2 className="text-success size-4" />
                  )}
                </div>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="border-border border-b">
          <div className="flex items-start gap-3">
            <div className="bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-xl">
              <Clock3 className="size-5" />
            </div>
            <div>
              <CardTitle>Need to update documents?</CardTitle>
              <p className="text-muted-foreground mt-1 text-sm">
                If your ID expired or your address changed, submit updated
                documents for re-review.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm">
            Average review time is under 24 hours for Premium members.
          </p>
          <Button type="button" variant="outline" className="rounded-xl">
            Resubmit documents
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
