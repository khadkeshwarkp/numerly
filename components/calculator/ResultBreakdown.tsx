import type { CalculatorOutputField } from "@/types/calculator-engine";
import { ResultStat } from "@/components/calculator/ResultStat";

type Props = {
  outputSchema: readonly CalculatorOutputField[];
  output: Record<string, number>;
  secondaryOutput?: Record<string, number> | null;
  primaryOutputId?: string;
  formatOutput: (value: number, field: CalculatorOutputField) => string;
};

export function ResultBreakdown({
  outputSchema,
  output,
  secondaryOutput,
  primaryOutputId,
  formatOutput
}: Props) {
  return (
    <div>
      {outputSchema.map((field) => {
        const primary = output[field.id];
        const secondary = secondaryOutput ? secondaryOutput[field.id] : null;
        const delta = secondary !== null && secondary !== undefined ? secondary - primary : null;
        const deltaState = delta === null ? "neutral" : delta > 0 ? "positive" : delta < 0 ? "negative" : "neutral";

        return (
          <ResultStat
            key={field.id}
            label={field.label}
            value={formatOutput(primary, field)}
            emphasize={primaryOutputId === field.id}
            secondary={secondary !== null && secondary !== undefined ? `B: ${formatOutput(secondary, field)}` : undefined}
            delta={delta !== null ? `Δ ${formatOutput(delta, field)}` : undefined}
            deltaState={deltaState}
          />
        );
      })}
    </div>
  );
}
