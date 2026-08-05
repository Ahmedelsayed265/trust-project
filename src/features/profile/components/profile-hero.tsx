"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BadgeCheck, Camera, Check } from "lucide-react";
import { useCurrentUser } from "@/shared/providers/user-provider";

const benefits = [
  "Advanced AI Signals",
  "Real-time News",
  "Priority Support",
];

export function ProfileHero() {
  const user = useCurrentUser();

  return (
    <Card className="">
      <CardContent>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative mx-auto size-24 shrink-0 sm:mx-0">
              <Avatar className="size-24 bg-primary/10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <span className="text-2xl font-bold">{user.initials}</span>
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-card"
                aria-label="Change photo"
              >
                <Camera className="size-3.5" />
              </button>
            </div>

            <div className="min-w-0 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  {user.name}
                </h2>
                {user.email_verified || user.kyc_verified ? (
                  <BadgeCheck
                    className="size-5 text-primary"
                    aria-label="Verified"
                  />
                ) : null}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                {user.kyc_verified ? (
                  <Badge className="border-0 bg-emerald-50 text-success hover:bg-emerald-50 dark:bg-emerald-950/40">
                    Verified
                  </Badge>
                ) : null}
                <Badge className="border-0">
                  {user.plan?.name ?? "Free"}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Member since {user.member_since_label}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/40 p-4 lg:min-w-[280px]">
            <p className="mb-3 text-sm font-semibold text-foreground">
              Premium Benefits
            </p>
            <ul className="mb-4 space-y-2">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className="flex size-5 items-center justify-center rounded-full bg-emerald-50 text-success dark:bg-emerald-950/40">
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
              Manage Plan
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
