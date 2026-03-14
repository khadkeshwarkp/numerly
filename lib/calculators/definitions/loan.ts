import { calculateLoan } from "@/lib/calculators/loan";
import {
  getLoanInsights,
  getLoanTableData,
  getLoanVisualizationData
} from "@/lib/calculators/loan-tools";
import type { CalculatorDefinition } from "@/types/calculator-engine";

const inputSchema = [
  {
    id: "principal",
    queryKey: "amount",
    label: "Loan Amount",
    type: "currency",
    defaultValue: 20000,
    min: 0.01,
    step: 0.01,
    required: true
  },
  {
    id: "annualInterestRate",
    queryKey: "rate",
    label: "Annual interest rate",
    type: "percent",
    defaultValue: 8,
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
  { id: "monthlyPayment", label: "Monthly Payment", format: "currency", decimals: 2 },
  { id: "totalPayment", label: "Total Payment", format: "currency", decimals: 2 },
  { id: "totalInterest", label: "Total Interest", format: "currency", decimals: 2 }
] as const;

export const loanCalculatorDefinition = {
  id: "loan-calculator",
  category: "finance",
  slug: "loan-calculator",
  metadata: {
    title: "Loan Calculator",
    tags: ["loan", "amortization", "interest", "payment", "debt"],
    monetizationWeight: 9,
    difficulty: "intermediate",
    presentation: {
      primaryOutputId: "monthlyPayment",
      chartDensity: "comfortable",
      compactInputs: false
    }
  },
  inputSchema,
  outputSchema,
  calculate: calculateLoan,
  insightRules: getLoanInsights,
  buildVisualizationData: getLoanVisualizationData,
  buildTableData: getLoanTableData
} satisfies CalculatorDefinition<typeof inputSchema, typeof outputSchema>;
