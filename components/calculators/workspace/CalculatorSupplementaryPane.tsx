"use client";

import dynamic from "next/dynamic";
import { useCalculatorWorkspace } from "@/lib/hooks/use-calculator-workspace";

const FinanceVisualizationSection = dynamic(
  () =>
    import("@/components/calculators/finance/FinanceVisualizationSection").then(
      (module) => module.FinanceVisualizationSection
    ),
  { ssr: false }
);

type Props = {
  calculatorId: string;
};

export function CalculatorSupplementaryPane({ calculatorId }: Props) {
  const { state } = useCalculatorWorkspace(calculatorId, { mode: "readonly" });

  if (!state.calculator || !state.isFinanceCalculator) return null;

  return (
    <section className="space-y-6" aria-label="Charts and advanced tables">
      <FinanceVisualizationSection visualization={state.visualization} tableData={state.tableData} />
    </section>
  );
}
