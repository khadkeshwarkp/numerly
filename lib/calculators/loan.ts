import { calculateAmortizedLoan, round2 } from "@/lib/calculators/finance-utils";

export type LoanInput = {
  principal: number;
  annualInterestRate: number;
  loanTermMonths: number;
};

export type LoanResult = {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
};

export function calculateLoan({
  principal,
  annualInterestRate,
  loanTermMonths
}: LoanInput): LoanResult {
  const result = calculateAmortizedLoan(
    principal,
    annualInterestRate,
    loanTermMonths
  );

  return {
    monthlyPayment: round2(result.monthlyPayment),
    totalPayment: round2(result.totalPayment),
    totalInterest: round2(result.totalInterest)
  };
}
