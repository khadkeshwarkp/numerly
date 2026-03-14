import { bmiCalculatorDefinition } from "@/lib/calculators/definitions/bmi";
import { compoundInterestCalculatorDefinition } from "@/lib/calculators/definitions/compound-interest";
import { emiCalculatorDefinition } from "@/lib/calculators/definitions/emi";
import { gpaCalculatorDefinition } from "@/lib/calculators/definitions/gpa";
import { inflationCalculatorDefinition } from "@/lib/calculators/definitions/inflation";
import { loanCalculatorDefinition } from "@/lib/calculators/definitions/loan";
import { mortgageCalculatorDefinition } from "@/lib/calculators/definitions/mortgage";
import { retirementCalculatorDefinition } from "@/lib/calculators/definitions/retirement";
import type { CalculatorRuntimeDefinition } from "@/types/calculator-engine";

export const calculatorRegistry = [
  loanCalculatorDefinition,
  compoundInterestCalculatorDefinition,
  emiCalculatorDefinition,
  mortgageCalculatorDefinition,
  retirementCalculatorDefinition,
  inflationCalculatorDefinition,
  gpaCalculatorDefinition,
  bmiCalculatorDefinition
] as const;

export type RegisteredCalculator = (typeof calculatorRegistry)[number];

const calculatorsByRoute = new Map<string, CalculatorRuntimeDefinition>(
  calculatorRegistry.map((calculator) => [
    `${calculator.category}/${calculator.slug}`,
    calculator as unknown as CalculatorRuntimeDefinition
  ])
);

const calculatorsById = new Map<string, CalculatorRuntimeDefinition>(
  calculatorRegistry.map((calculator) => [
    calculator.id,
    calculator as unknown as CalculatorRuntimeDefinition
  ])
);

export function getCalculatorByRoute(
  category: string,
  slug: string
): CalculatorRuntimeDefinition | null {
  return calculatorsByRoute.get(`${category}/${slug}`) ?? null;
}

export function getCalculatorById(id: string): CalculatorRuntimeDefinition | null {
  return calculatorsById.get(id) ?? null;
}

export function getRegisteredCalculatorPaths(): Array<{
  category: string;
  slug: string;
}> {
  return calculatorRegistry.map((calculator) => ({
    category: calculator.category,
    slug: calculator.slug
  }));
}
