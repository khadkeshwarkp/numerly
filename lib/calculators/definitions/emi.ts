import { calculateEmi } from "@/lib/calculators/emi";
import type { CalculatorDefinition } from "@/types/calculator-engine";

const inputSchema = [
  {
    id: "principal",
    queryKey: "amount",
    label: "Loan Amount",
    type: "currency",
    defaultValue: 500000,
    min: 0.01,
    step: 0.01,
    required: true
  },
  {
    id: "annualInterestRate",
    queryKey: "rate",
    label: "Annual interest rate",
    type: "percent",
    defaultValue: 9,
    min: 0,
    max: 100,
    step: 0.01,
    required: true
  },
  {
    id: "loanTermMonths",
    queryKey: "term",
    label: "Loan term",
    type: "duration",
    suffix: "months",
    defaultValue: 60,
    min: 1,
    step: 1,
    required: true
  }
] as const;

const outputSchema = [
  { id: "monthlyEmi", label: "Monthly EMI", format: "currency", decimals: 2 },
  { id: "totalPayment", label: "Total Payment", format: "currency", decimals: 2 },
  { id: "totalInterest", label: "Total Interest", format: "currency", decimals: 2 }
] as const;

export const emiCalculatorDefinition = {
  id: "emi-calculator",
  category: "finance",
  slug: "emi-calculator",
  metadata: {
    title: "EMI Calculator",
    tags: ["loan", "emi", "interest", "payment", "debt"],
    monetizationWeight: 9,
    difficulty: "intermediate",
    presentation: {
      primaryOutputId: "monthlyEmi",
      chartDensity: "comfortable",
      compactInputs: true
    }
  },
  inputSchema,
  outputSchema,
  calculate: calculateEmi
} satisfies CalculatorDefinition<typeof inputSchema, typeof outputSchema>;
