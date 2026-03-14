import { calculateAmortizedLoan, round2 } from "@/lib/calculators/finance-utils";

export type EmiInput = {
  principal: number;
  annualInterestRate: number;
  loanTermMonths: number;
};

export type EmiResult = {
  monthlyEmi: number;
  totalPayment: number;
  totalInterest: number;
};

export function calculateEmi({
  principal,
  annualInterestRate,
  loanTermMonths
}: EmiInput): EmiResult {
  const result = calculateAmortizedLoan(
    principal,
    annualInterestRate,
    loanTermMonths
  );

  return {
    monthlyEmi: round2(result.monthlyPayment),
    totalPayment: round2(result.totalPayment),
    totalInterest: round2(result.totalInterest)
  };
}
