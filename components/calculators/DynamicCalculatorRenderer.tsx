"use client";

import { CalculatorSupplementaryPane } from "@/components/calculators/workspace/CalculatorSupplementaryPane";
import { CalculatorToolsPane } from "@/components/calculators/workspace/CalculatorToolsPane";

type Props = {
  calculatorId: string;
};

export function DynamicCalculatorRenderer({ calculatorId }: Props) {
  return (
    <>
      <CalculatorToolsPane calculatorId={calculatorId} />
      <CalculatorSupplementaryPane calculatorId={calculatorId} />
    </>
  );
}
