import Link from "next/link";
import {
  BookOpen,
  CircleHelp,
  MessageCircle,
  Shield,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/shared/components/page-header";
import { routes } from "@/shared/lib/routes";

const topics = [
  {
    title: "Getting started",
    description: "Fund your wallet, place your first trade, and follow signals.",
    icon: BookOpen,
  },
  {
    title: "Security & verification",
    description: "2FA, KYC status, and account recovery best practices.",
    icon: Shield,
  },
  {
    title: "AI Signals explained",
    description: "How confidence scores and strong/moderate labels work.",
    icon: Sparkles,
  },
  {
    title: "Billing & plans",
    description: "Upgrade, downgrade, invoices, and renewal dates.",
    icon: CircleHelp,
  },
];

export function HelpView() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Help Center"
        description="Guides and support for trading on TrustAI."
        actions={
          <Button className="rounded-xl">
            <MessageCircle />
            Contact Support
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <Card key={topic.title} className="">
              <CardHeader className="flex-row items-start gap-3 space-y-0">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-base">{topic.title}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {topic.description}
                  </p>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-slate-900">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold text-foreground">
              Need plan help?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Review tiers, billing dates, and upgrade options anytime.
            </p>
          </div>
          <Button className="rounded-xl" render={<Link href={routes.plans} />}>
            Manage Plans
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
