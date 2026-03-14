import { calculateInflation } from "@/lib/calculators/inflation";
import type { CalculatorDefinition } from "@/types/calculator-engine";

const inputSchema = [
  {
    id: "currentAmount",
    queryKey: "amount",
    label: "Current Amount",
    type: "currency",
    defaultValue: 1000,
    min: 0.01,
    step: 0.01,
    required: true
  },
  {
    id: "annualInflationRate",
    queryKey: "rate",
    label: "Annual inflation rate",
    type: "percent",
    defaultValue: 3,
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
  }
] as const;

const outputSchema = [
  { id: "futureCost", label: "Future Cost", format: "currency", decimals: 2 },
  {
    id: "cumulativeInflationPercent",
    label: "Cumulative Inflation",
    format: "percent",
    decimals: 2
  },
  {
    id: "purchasingPower",
    label: "Future Purchasing Power",
    format: "currency",
    decimals: 2
  },
  { id: "valueIncrease", label: "Value Increase", format: "currency", decimals: 2 }
] as const;

export const inflationCalculatorDefinition = {
  id: "inflation-calculator",
  category: "finance",
  slug: "inflation-calculator",
  metadata: {
    title: "Inflation Calculator",
    tags: ["inflation", "cpi", "purchasing power", "cost", "finance"],
    monetizationWeight: 7,
    difficulty: "beginner",
    presentation: {
      primaryOutputId: "futureCost",
      chartDensity: "compact",
      compactInputs: true
    }
  },
  inputSchema,
  outputSchema,
  calculate: calculateInflation
} satisfies CalculatorDefinition<typeof inputSchema, typeof outputSchema>;
