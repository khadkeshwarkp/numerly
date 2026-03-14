import { calculateCompoundInterest } from "@/lib/calculators/compound-interest";
import type { CalculatorDefinition } from "@/types/calculator-engine";

const inputSchema = [
  {
    id: "principal",
    queryKey: "principal",
    label: "Initial balance",
    type: "currency",
    defaultValue: 10000,
    min: 0,
    step: 0.01,
    required: true
  },
  {
    id: "annualInterestRate",
    queryKey: "rate",
    label: "Interest rate",
    type: "percent",
    defaultValue: 8,
    min: 0,
    max: 100,
    step: 0.01,
    required: true
  },
  {
    id: "years",
    queryKey: "years",
    label: "Time period",
    type: "duration",
    suffix: "years",
    defaultValue: 10,
    min: 1,
    step: 1,
    required: true
  },
  {
    id: "compoundsPerYear",
    queryKey: "freq",
    label: "Compounding frequency",
    type: "select",
    defaultValue: 12,
    options: [
      { label: "Yearly (1x)", value: 1 },
      { label: "Semi-annually (2x)", value: 2 },
      { label: "Quarterly (4x)", value: 4 },
      { label: "Monthly (12x)", value: 12 },
      { label: "Weekly (52x)", value: 52 },
      { label: "Daily (365x)", value: 365 }
    ],
    required: true
  },
  {
    id: "additionalDeposits",
    label: "Additional deposits",
    type: "fieldset",
    description: "Optional deposits added every compounding period.",
    collapsedByDefault: true,
    fields: [
      {
        id: "contributionPerPeriod",
        queryKey: "contrib",
        label: "Deposit per period",
        type: "currency",
        defaultValue: 0,
        min: 0,
        step: 0.01,
        required: false
      }
    ]
  }
] as const;

const outputSchema = [
  { id: "futureValue", label: "Future Value", format: "currency", decimals: 2 },
  {
    id: "totalContributions",
    label: "Total Contributions",
    format: "currency",
    decimals: 2
  },
  {
    id: "totalInterest",
    label: "Total Interest Earned",
    format: "currency",
    decimals: 2
  }
] as const;

export const compoundInterestCalculatorDefinition = {
  id: "compound-interest-calculator",
  category: "finance",
  slug: "compound-interest-calculator",
  metadata: {
    title: "Compound Interest Calculator",
    tags: ["investing", "compound interest", "returns", "savings", "future value"],
    monetizationWeight: 8,
    difficulty: "intermediate",
    presentation: {
      primaryOutputId: "futureValue",
      chartDensity: "compact",
      compactInputs: false
    }
  },
  inputSchema,
  outputSchema,
  calculate: (input) =>
    calculateCompoundInterest(input as unknown as Parameters<typeof calculateCompoundInterest>[0])
} satisfies CalculatorDefinition<typeof inputSchema, typeof outputSchema>;
