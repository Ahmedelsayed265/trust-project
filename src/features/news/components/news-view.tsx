import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/shared/components/page-header";

const articles = [
  {
    tag: "Crypto",
    title: "Bitcoin holds above $67K as ETF inflows stabilize",
    summary:
      "Spot ETF demand remains steady while traders watch Fed signals for the next move.",
    time: "12 min ago",
  },
  {
    tag: "Markets",
    title: "Gold edges higher amid softer dollar tone",
    summary:
      "XAU/USD climbs as investors reassess rate-cut expectations into next week.",
    time: "28 min ago",
  },
  {
    tag: "AI",
    title: "TrustAI launches stronger confidence scoring for crypto pairs",
    summary:
      "Updated model weights improve signal calibration on high-volatility sessions.",
    time: "1h ago",
  },
  {
    tag: "Stocks",
    title: "Apple suppliers signal solid demand into spring quarter",
    summary:
      "Component makers report healthier order books, supporting AAPL near recent highs.",
    time: "3h ago",
  },
];

export function NewsView() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="News"
        description="Market headlines curated for active traders."
      />

      <div className="grid gap-3">
        {articles.map((article) => (
          <Card key={article.title} className=" transition-colors hover:bg-muted/20">
            <CardContent className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="border-0">
                  {article.tag}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {article.time}
                </span>
              </div>
              <h2 className="text-base font-semibold text-foreground">
                {article.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {article.summary}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
