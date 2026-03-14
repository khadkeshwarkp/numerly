import { calculateMortgage } from "@/lib/calculators/mortgage";
import type { CalculatorDefinition } from "@/types/calculator-engine";

const inputSchema = [
  {
    id: "homePrice",
    queryKey: "price",
    label: "Home Price",
    type: "currency",
    defaultValue: 450000,
    min: 0.01,
    step: 0.01,
    required: true
  },
  {
    id: "downPayment",
    queryKey: "down",
    label: "Down Payment",
    type: "currency",
    defaultValue: 90000,
    min: 0,
    step: 0.01,
    required: true
  },
  {
    id: "annualInterestRate",
    queryKey: "rate",
    label: "Annual interest rate",
    type: "percent",
    defaultValue: 6.75,
    min: 0,
    max: 100,
    step: 0.01,
    required: true
  },
  {
    id: "loanTermYears",
    queryKey: "years",
    label: "Loan term",
    type: "duration",
    suffix: "years",
    defaultValue: 30,
    min: 1,
    step: 1,
    required: true
  },
  {
    id: "annualPropertyTax",
    queryKey: "tax",
    label: "Annual Property Tax",
    type: "currency",
    defaultValue: 5400,
    min: 0,
    step: 0.01,
    required: true
  },
  {
    id: "annualHomeInsurance",
    queryKey: "insurance",
    label: "Annual Home Insurance",
    type: "currency",
    defaultValue: 1800,
    min: 0,
    step: 0.01,
    required: true
  }
] as const;

const outputSchema = [
  { id: "loanAmount", label: "Loan Amount", format: "currency", decimals: 2 },
  {
    id: "monthlyPrincipalAndInterest",
    label: "Monthly Principal & Interest",
    format: "currency",
    decimals: 2
  },
  {
    id: "monthlyPaymentWithEscrow",
    label: "Monthly Payment (With Escrow)",
    format: "currency",
    decimals: 2
  },
  { id: "totalPayment", label: "Total Payment", format: "currency", decimals: 2 },
  { id: "totalInterest", label: "Total Interest", format: "currency", decimals: 2 }
] as const;

export const mortgageCalculatorDefinition = {
  id: "mortgage-calculator",
  category: "finance",
  slug: "mortgage-calculator",
  metadata: {
    title: "Mortgage Calculator",
    tags: ["mortgage", "home loan", "housing", "interest", "payment"],
    monetizationWeight: 10,
    difficulty: "advanced",
    presentation: {
      primaryOutputId: "monthlyPaymentWithEscrow",
      chartDensity: "comfortable",
      compactInputs: false
    }
  },
  inputSchema,
  outputSchema,
  calculate: calculateMortgage
} satisfies CalculatorDefinition<typeof inputSchema, typeof outputSchema>;
