'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BadgeCheck, Camera, Check } from 'lucide-react';
import { useCurrentUser } from '@/shared/providers/user-provider';

export function ProfileHero() {
  const t = useTranslations('Profile');
  const tCommon = useTranslations('Common');
  const tBrand = useTranslations('Brand');
  const user = useCurrentUser();

  const benefits = [t('benefitSignals'), t('benefitNews'), t('benefitSupport')];

  return (
    <Card className="">
      <CardContent>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative mx-auto size-24 shrink-0 sm:mx-0">
              <Avatar className="bg-primary/10 size-24">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <span className="text-2xl font-bold">{user.initials}</span>
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                className="bg-primary text-primary-foreground ring-card absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full ring-2"
                aria-label={t('changePhoto')}
              >
                <Camera className="size-3.5" />
              </button>
            </div>

            <div className="min-w-0 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
                <h2 className="text-foreground text-xl font-bold tracking-tight">
                  {user.name}
                </h2>
                {user.email_verified || user.kyc_verified ? (
                  <BadgeCheck
                    className="text-primary size-5"
                    aria-label={tCommon('verified')}
                  />
                ) : null}
              </div>
              <p className="text-muted-foreground mt-1 text-sm">{user.email}</p>
              <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                {user.kyc_verified ? (
                  <Badge className="text-success border-0 bg-emerald-50 hover:bg-emerald-50 dark:bg-emerald-950/40">
                    {tCommon('verified')}
                  </Badge>
                ) : null}
                <Badge className="border-0">
                  {user.plan?.name ?? tBrand('planFree')}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-2 text-xs">
                {t('memberSince', { date: user.member_since_label })}
              </p>
            </div>
          </div>

          <div className="border-border bg-muted/40 rounded-lg border p-4 lg:min-w-[280px]">
            <p className="text-foreground mb-3 text-sm font-semibold">
              {t('premiumBenefits')}
            </p>
            <ul className="mb-4 space-y-2">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="text-muted-foreground flex items-center gap-2 text-sm"
                >
                  <span className="text-success flex size-5 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
            <Button
              className="h-10 w-full rounded-xl"
              render={<Link href="/profile/plans" />}
            >
              {t('managePlan')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
