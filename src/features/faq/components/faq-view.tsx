import Link from "next/link";
import { MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/shared/components/page-header";
import { routes } from "@/shared/lib/routes";

const faqSections = [
  {
    title: "Getting started",
    items: [
      {
        question: "How do I fund my wallet?",
        answer:
          "Open Wallet, choose Deposit, pick an asset, and send funds to the generated address. Deposits usually appear after network confirmation.",
      },
      {
        question: "How do I place my first trade?",
        answer:
          "Go to Trade, select a market, choose buy or sell, enter size, and confirm. You can also start from an AI signal with one click.",
      },
      {
        question: "What is included with Premium?",
        answer:
          "Premium unlocks stronger AI signal coverage, priority support, and advanced portfolio tools. Review tiers anytime on the Plans page.",
      },
    ],
  },
  {
    title: "Trading & AI signals",
    items: [
      {
        question: "How do AI signal confidence scores work?",
        answer:
          "Confidence reflects model agreement across momentum, volatility, and sentiment inputs. Strong setups usually score above 75%.",
      },
      {
        question: "Can I customize risk on trades?",
        answer:
          "Yes. Set default size, leverage preferences, and risk limits in Settings, then adjust per order on the Trade screen.",
      },
      {
        question: "Where can I find order history?",
        answer:
          "Open Orders to review open, filled, and canceled activity. You can also jump there from Profile → Trading.",
      },
    ],
  },
  {
    title: "Account & security",
    items: [
      {
        question: "How do I enable 2FA?",
        answer:
          "Open Profile → Security, turn on two-factor authentication, and link an authenticator app. Keep recovery codes somewhere safe.",
      },
      {
        question: "What does Verified mean?",
        answer:
          "Verified means your KYC documents were approved. You can check status and resubmit documents from Profile → Verification.",
      },
      {
        question: "How do withdrawals work?",
        answer:
          "From Wallet, choose Withdraw, select the asset, enter the destination address and amount, then confirm. 2FA may be required.",
      },
    ],
  },
];

export function FaqView() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="FAQs"
        description="Answers to common questions about trading, wallet, and account security."
        actions={
          <Button
            className="rounded-xl"
            nativeButton={false}
            render={<Link href={routes.contact} />}
          >
            <MessageCircle />
            Contact Support
          </Button>
        }
      />

      <div className="grid gap-4">
        {faqSections.map((section) => (
          <Card key={section.title}>
            <CardHeader className="border-b border-border">
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              <Accordion className="w-full">
                {section.items.map((item) => (
                  <AccordionItem key={item.question} value={item.question}>
                    <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-slate-900">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold text-foreground">
              Still need help?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse guides in Help Center or send us a message.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              nativeButton={false}
              render={<Link href={routes.help} />}
            >
              Help Center
            </Button>
            <Button
              className="rounded-xl"
              nativeButton={false}
              render={<Link href={routes.contact} />}
            >
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
