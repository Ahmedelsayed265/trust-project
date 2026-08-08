'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AlertCircle, BadgeCheck, CheckCircle2, Clock3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VerificationStepSheet } from '@/features/verification/components/verification-step-sheet';
import { VerificationStepIcon } from '@/features/verification/lib/verification-icons';
import {
  isVerificationStepKey,
  type UserVerification,
  type VerificationStep,
} from '@/features/verification/types';
import { PageHeader } from '@/shared/components/page-header';
import { useCurrentUser } from '@/shared/providers/user-provider';
import { cn } from '@/lib/utils';

export function VerificationView({ data }: { data: UserVerification }) {
  const t = useTranslations('Verification');
  const locale = useLocale();
  const user = useCurrentUser();
  const [activeStep, setActiveStep] = useState<VerificationStep | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  function formatDate(value: string | null) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  }

  function formatDocumentType(value: string | null) {
    if (!value) return null;
    if (value === 'passport') return t('docPassport');
    if (value === 'national_id') return t('docNationalId');
    if (value === 'driving_license') return t('docDrivingLicense');
    if (value === 'utility_bill') return t('docUtilityBill');
    if (value === 'bank_statement') return t('docBankStatement');
    return value
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  function stepStatusLabel(status: string) {
    if (status === 'complete') return t('statusComplete');
    if (status === 'rejected') return t('statusRejected');
    if (status === 'in_review') return t('statusInReview');
    if (status === 'pending') return t('statusPending');
    return status.replaceAll('_', ' ');
  }

  function stepActionLabel(status: string) {
    if (status === 'rejected') return t('actionFix');
    if (status === 'complete') return t('actionUpdate');
    return t('actionSubmit');
  }

  const reviewedAt = formatDate(data.reviewed_at);
  const submittedAt = formatDate(data.submitted_at);
  const progress = Math.min(100, Math.max(0, data.progress));

  function openStep(step: VerificationStep) {
    if (!isVerificationStepKey(step.key)) return;
    setActiveStep(step);
    setSheetOpen(true);
  }

  function openFirstActionableStep() {
    const target =
      data.steps.find(
        (step) =>
          isVerificationStepKey(step.key) &&
          (step.status === 'rejected' ||
            step.status === 'pending' ||
            step.status !== 'complete'),
      ) ?? data.steps.find((step) => isVerificationStepKey(step.key));

    if (target) openStep(target);
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title={t('title')}
        description={t('description')}
        actions={
          <Badge
            className={cn(
              'border-0',
              data.is_verified
                ? 'text-success bg-emerald-50 hover:bg-emerald-50 dark:bg-emerald-950/40'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300',
            )}
          >
            {data.status_label}
          </Badge>
        }
      />

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'flex size-12 shrink-0 items-center justify-center rounded-2xl',
                data.is_verified
                  ? 'text-success bg-emerald-50 dark:bg-emerald-950/40'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
              )}
            >
              {data.is_verified ? (
                <BadgeCheck className="size-6" />
              ) : (
                <Clock3 className="size-6" />
              )}
            </div>
            <div>
              <p className="text-muted-foreground text-sm">{t('kycStatus')}</p>
              <p className="text-foreground mt-1 text-2xl font-bold tracking-tight">
                {data.status_label}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                {user.name}
                {reviewedAt
                  ? ` · ${t('reviewed', { date: reviewedAt })}`
                  : submittedAt
                    ? ` · ${t('submitted', { date: submittedAt })}`
                    : null}
              </p>
            </div>
          </div>
          <div className="border-border bg-muted/40 rounded-xl border px-3 py-2 text-sm">
            <p className="text-muted-foreground">{t('reviewLevel')}</p>
            <p className="text-foreground mt-0.5 font-semibold">
              {data.level_label}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between gap-3 text-sm">
            <p className="text-muted-foreground">{t('progress')}</p>
            <p className="text-foreground font-semibold">
              {t('stepsProgress', {
                approved: data.approved_steps,
                total: data.total_steps,
                percent: progress,
              })}
            </p>
          </div>
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <div
              className={cn(
                'h-full rounded-full transition-[width]',
                data.is_verified ? 'bg-emerald-500' : 'bg-primary',
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {data.rejection_reason ? (
        <Card className="border-destructive/30">
          <CardContent className="flex items-start gap-3">
            <div className="bg-destructive/10 text-destructive flex size-10 shrink-0 items-center justify-center rounded-xl">
              <AlertCircle className="size-5" />
            </div>
            <div>
              <p className="text-foreground text-sm font-semibold">
                {t('actionRequired')}
              </p>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                {data.rejection_reason}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        {data.steps.map((step) => {
          const complete = step.status === 'complete';
          const rejected = step.status === 'rejected';
          const documentLabel = formatDocumentType(step.document_type);
          const completedAt = formatDate(step.completed_at);
          const canSubmit = isVerificationStepKey(step.key);

          return (
            <Card key={step.key} className="flex flex-col">
              <CardHeader className="flex-row items-start gap-3 space-y-0">
                <div
                  className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-xl',
                    complete
                      ? 'text-success bg-emerald-50 dark:bg-emerald-950/40'
                      : rejected
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-muted text-muted-foreground',
                  )}
                >
                  <VerificationStepIcon name={step.icon} className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-base">{step.title}</CardTitle>
                    {complete ? (
                      <CheckCircle2 className="text-success size-4" />
                    ) : (
                      <Badge
                        variant="secondary"
                        className="rounded-md px-1.5 py-0 text-[10px] font-medium"
                      >
                        {stepStatusLabel(step.status)}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {step.description}
                  </p>
                  {documentLabel ? (
                    <p className="text-foreground mt-2 text-xs font-medium">
                      {t('documentLabel', { type: documentLabel })}
                    </p>
                  ) : null}
                  {step.rejection_reason ? (
                    <p className="text-destructive mt-2 text-xs leading-relaxed">
                      {step.rejection_reason}
                    </p>
                  ) : null}
                  {completedAt ? (
                    <p className="text-muted-foreground mt-2 text-xs">
                      {t('completed', { date: completedAt })}
                    </p>
                  ) : null}
                </div>
              </CardHeader>
              {canSubmit ? (
                <CardContent className="mt-auto pt-0">
                  <Button
                    type="button"
                    variant={complete ? 'outline' : 'default'}
                    className="w-full rounded-xl"
                    onClick={() => openStep(step)}
                  >
                    {stepActionLabel(step.status)}
                  </Button>
                </CardContent>
              ) : null}
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="border-border border-b">
          <div className="flex items-start gap-3">
            <div className="bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-xl">
              <Clock3 className="size-5" />
            </div>
            <div>
              <CardTitle>{t('updateDocsTitle')}</CardTitle>
              <p className="text-muted-foreground mt-1 text-sm">
                {t('updateDocsDesc')}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm">{t('reviewTimeHint')}</p>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={openFirstActionableStep}
          >
            {t('resubmitDocuments')}
          </Button>
        </CardContent>
      </Card>

      <VerificationStepSheet
        step={activeStep}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
