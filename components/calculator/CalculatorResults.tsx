import { AlertCircle, Sparkles } from "lucide-react";
import { CalculatorCard } from "@/components/calculator/CalculatorCard";
import { ResultBreakdown } from "@/components/calculator/ResultBreakdown";
import type { CalculatorInsight, CalculatorOutputField } from "@/types/calculator-engine";

type Props = {
  title?: string;
  outputSchema: readonly CalculatorOutputField[];
  output: Record<string, number> | null;
  secondaryOutput?: Record<string, number> | null;
  primaryOutputId?: string;
  formatOutput: (value: number, field: CalculatorOutputField) => string;
  generalError?: string | null;
  emptyMessage?: string;
  insights?: CalculatorInsight[];
  actions?: React.ReactNode;
};

export function CalculatorResults({
  title = "Results",
  outputSchema,
  output,
  secondaryOutput,
  primaryOutputId,
  formatOutput,
  generalError,
  emptyMessage = "Enter valid inputs to view calculated results.",
  insights = [],
  actions
}: Props) {
  return (
    <div className="space-y-4 lg:sticky lg:top-24">
      <CalculatorCard title={title}>
        {actions ? <div className="mb-4">{actions}</div> : null}
        {generalError ? (
          <div className="inline-flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {generalError}
          </div>
        ) : output ? (
          <ResultBreakdown
            outputSchema={outputSchema}
            output={output}
            secondaryOutput={secondaryOutput}
            primaryOutputId={primaryOutputId}
            formatOutput={formatOutput}
          />
        ) : (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        )}
      </CalculatorCard>

      {insights.length ? (
        <CalculatorCard title="Insights">
          <div className="space-y-3">
            {insights.map((insight) => (
              <article key={insight.id} className="rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {insight.title}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{insight.message}</p>
              </article>
            ))}
          </div>
        </CalculatorCard>
      ) : null}
    </div>
  );
}
