import { calculateRetirement } from "@/lib/calculators/retirement";
import type { CalculatorDefinition } from "@/types/calculator-engine";

const inputSchema = [
  {
    id: "currentAge",
    queryKey: "age",
    label: "Current Age",
    type: "duration",
    suffix: "years",
    defaultValue: 30,
    min: 0,
    step: 1,
    required: true
  },
  {
    id: "retirementAge",
    queryKey: "retire",
    label: "Retirement Age",
    type: "duration",
    suffix: "years",
    defaultValue: 65,
    min: 1,
    step: 1,
    required: true
  },
  {
    id: "currentSavings",
    queryKey: "saved",
    label: "Current Savings",
    type: "currency",
    defaultValue: 25000,
    min: 0,
    step: 0.01,
    required: true
  },
  {
    id: "monthlyContribution",
    queryKey: "monthly",
    label: "Monthly Contribution",
    type: "currency",
    defaultValue: 750,
    min: 0,
    step: 0.01,
    required: true
  },
  {
    id: "annualReturnRate",
    queryKey: "return",
    label: "Expected annual return",
    type: "percent",
    defaultValue: 7,
    min: 0,
    max: 100,
    step: 0.01,
    required: true
  }
] as const;

const outputSchema = [
  { id: "futureValue", label: "Retirement Value", format: "currency", decimals: 2 },
  {
    id: "totalContributions",
    label: "Total Contributions",
    format: "currency",
    decimals: 2
  },
  { id: "totalGrowth", label: "Investment Growth", format: "currency", decimals: 2 }
] as const;

export const retirementCalculatorDefinition = {
  id: "retirement-calculator",
  category: "finance",
  slug: "retirement-calculator",
  metadata: {
    title: "Retirement Calculator",
    tags: ["retirement", "investing", "future value", "savings", "planning"],
    monetizationWeight: 9,
    difficulty: "intermediate",
    presentation: {
      primaryOutputId: "futureValue",
      chartDensity: "compact",
      compactInputs: false
    }
  },
  inputSchema,
  outputSchema,
  calculate: calculateRetirement
} satisfies CalculatorDefinition<typeof inputSchema, typeof outputSchema>;
