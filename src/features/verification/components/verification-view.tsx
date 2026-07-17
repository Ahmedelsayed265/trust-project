import {
  BadgeCheck,
  Building,
  CheckCircle2,
  Clock3,
  FileCheck2,
  IdCard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/shared/components/page-header";
import { currentUser } from "@/shared/lib/user";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Personal details",
    description: "Legal name, date of birth, and contact information.",
    status: "complete" as const,
    icon: IdCard,
  },
  {
    title: "Identity document",
    description: "Passport or national ID uploaded and reviewed.",
    status: "complete" as const,
    icon: FileCheck2,
  },
  {
    title: "Address verification",
    description: "Proof of residence confirmed against submitted documents.",
    status: "complete" as const,
    icon: Building,
  },
];

export function VerificationView() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Verification"
        description="Identity and KYC status for your TrustAI account."
        actions={
          <Badge className="border-0 bg-emerald-50 text-success hover:bg-emerald-50 dark:bg-emerald-950/40">
            Verified
          </Badge>
        }
      />

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-success dark:bg-emerald-950/40">
              <BadgeCheck className="size-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">KYC status</p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                Fully verified
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {currentUser.name} · Verified since {currentUser.memberSince}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm">
            <p className="text-muted-foreground">Review level</p>
            <p className="mt-0.5 font-semibold text-foreground">Standard KYC</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {steps.map(({ title, description, status, icon: Icon }) => (
          <Card key={title}>
            <CardHeader className="flex-row items-start gap-3 space-y-0">
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl",
                  status === "complete"
                    ? "bg-emerald-50 text-success dark:bg-emerald-950/40"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">{title}</CardTitle>
                  {status === "complete" && (
                    <CheckCircle2 className="size-4 text-success" />
                  )}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
              <Clock3 className="size-5" />
            </div>
            <div>
              <CardTitle>Need to update documents?</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                If your ID expired or your address changed, submit updated
                documents for re-review.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
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
