import {
  assertNonNegative,
  assertPositive,
  futureValueLumpSum,
  futureValueOrdinaryAnnuity,
  round2
} from "@/lib/calculators/finance-utils";

export type RetirementInput = {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturnRate: number;
};

export type RetirementResult = {
  futureValue: number;
  totalContributions: number;
  totalGrowth: number;
};

export function calculateRetirement({
  currentAge,
  retirementAge,
  currentSavings,
  monthlyContribution,
  annualReturnRate
}: RetirementInput): RetirementResult {
  assertNonNegative("currentAge", currentAge);
  assertPositive("retirementAge", retirementAge);
  assertNonNegative("currentSavings", currentSavings);
  assertNonNegative("monthlyContribution", monthlyContribution);
  assertNonNegative("annualReturnRate", annualReturnRate);

  if (retirementAge <= currentAge) {
    throw new RangeError("retirementAge must be greater than currentAge");
  }

  const months = Math.round((retirementAge - currentAge) * 12);
  const monthlyRate = annualReturnRate / 100 / 12;

  const growthOfCurrentSavings = futureValueLumpSum(
    currentSavings,
    monthlyRate,
    months
  );
  const growthOfContributions = futureValueOrdinaryAnnuity(
    monthlyContribution,
    monthlyRate,
    months
  );

  const futureValue = growthOfCurrentSavings + growthOfContributions;
  const totalContributions = currentSavings + monthlyContribution * months;

  return {
    futureValue: round2(futureValue),
    totalContributions: round2(totalContributions),
    totalGrowth: round2(futureValue - totalContributions)
  };
}
