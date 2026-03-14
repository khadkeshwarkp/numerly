import {
  assertNonNegative,
  assertPositive,
  calculateAmortizedLoan,
  round2
} from "@/lib/calculators/finance-utils";

export type MortgageInput = {
  homePrice: number;
  downPayment: number;
  annualInterestRate: number;
  loanTermYears: number;
  annualPropertyTax: number;
  annualHomeInsurance: number;
};

export type MortgageResult = {
  loanAmount: number;
  monthlyPrincipalAndInterest: number;
  monthlyPaymentWithEscrow: number;
  totalPayment: number;
  totalInterest: number;
};

export function calculateMortgage({
  homePrice,
  downPayment,
  annualInterestRate,
  loanTermYears,
  annualPropertyTax,
  annualHomeInsurance
}: MortgageInput): MortgageResult {
  assertPositive("homePrice", homePrice);
  assertNonNegative("downPayment", downPayment);
  assertNonNegative("annualInterestRate", annualInterestRate);
  assertPositive("loanTermYears", loanTermYears);
  assertNonNegative("annualPropertyTax", annualPropertyTax);
  assertNonNegative("annualHomeInsurance", annualHomeInsurance);

  if (downPayment >= homePrice) {
    throw new RangeError("downPayment must be less than homePrice");
  }

  const loanAmount = homePrice - downPayment;
  const loanTermMonths = Math.round(loanTermYears * 12);

  const amortized = calculateAmortizedLoan(
    loanAmount,
    annualInterestRate,
    loanTermMonths
  );

  const monthlyEscrow = (annualPropertyTax + annualHomeInsurance) / 12;
  const monthlyPaymentWithEscrow = amortized.monthlyPayment + monthlyEscrow;
  const totalPayment = amortized.totalPayment + monthlyEscrow * loanTermMonths;

  return {
    loanAmount: round2(loanAmount),
    monthlyPrincipalAndInterest: round2(amortized.monthlyPayment),
    monthlyPaymentWithEscrow: round2(monthlyPaymentWithEscrow),
    totalPayment: round2(totalPayment),
    totalInterest: round2(amortized.totalInterest)
  };
}
