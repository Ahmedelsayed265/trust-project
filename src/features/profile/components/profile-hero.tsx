import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BadgeCheck, Camera, Check } from "lucide-react";
import { currentUser } from "@/shared/lib/user";

const benefits = [
  "Advanced AI Signals",
  "Real-time News",
  "Priority Support",
];

export function ProfileHero() {
  return (
    <Card className="shadow-sm">
      <CardContent>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative mx-auto size-24 shrink-0 sm:mx-0">
              <Avatar className="size-24 bg-primary/10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <svg
                    viewBox="0 0 24 24"
                    className="size-10"
                    fill="currentColor"
                    aria-hidden
                  >
                    <rect x="3" y="12" width="3.5" height="9" rx="1" />
                    <rect x="8.5" y="7" width="3.5" height="14" rx="1" />
                    <rect x="14" y="3" width="3.5" height="18" rx="1" />
                    <rect
                      x="19.5"
                      y="10"
                      width="1.5"
                      height="11"
                      rx="0.75"
                      opacity="0.7"
                    />
                  </svg>
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm ring-2 ring-card"
                aria-label="Change photo"
              >
                <Camera className="size-3.5" />
              </button>
            </div>

            <div className="min-w-0 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  {currentUser.name}
                </h2>
                <BadgeCheck className="size-5 text-primary" aria-label="Verified" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {currentUser.email}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge className="border-0 bg-emerald-50 text-success hover:bg-emerald-50 dark:bg-emerald-950/40">
                  Verified
                </Badge>
                <Badge className="border-0">{currentUser.plan}</Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Member since {currentUser.memberSince}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/40 p-4 lg:min-w-[280px]">
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
            <Button className="h-10 w-full rounded-xl">Manage Plan</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
