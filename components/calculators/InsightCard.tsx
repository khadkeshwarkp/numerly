import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CalculatorInsight } from "@/types/calculator-engine";

type Props = {
  insights: CalculatorInsight[];
  title?: string;
  tone?: "default" | "elevated";
};

export function InsightCard({ insights, title = "Insights" }: Props) {
  if (!insights.length) return null;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight) => (
          <article key={insight.id} className="rounded-lg border bg-muted/40 p-3">
            <div className="inline-flex items-center gap-2 text-sm font-semibold">
              <Lightbulb className="h-4 w-4 text-primary" />
              {insight.title}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{insight.message}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
