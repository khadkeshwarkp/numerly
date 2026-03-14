import {
  assertInteger,
  assertNonNegative,
  assertPositive,
  futureValueLumpSum,
  futureValueOrdinaryAnnuity,
  round2
} from "@/lib/calculators/finance-utils";

export type CompoundInterestInput = {
  principal: number;
  annualInterestRate: number;
  years: number;
  compoundsPerYear: number;
  contributionPerPeriod: number;
};

export type CompoundInterestResult = {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
};

export function calculateCompoundInterest({
  principal,
  annualInterestRate,
  years,
  compoundsPerYear,
  contributionPerPeriod
}: CompoundInterestInput): CompoundInterestResult {
  assertNonNegative("principal", principal);
  assertNonNegative("annualInterestRate", annualInterestRate);
  assertPositive("years", years);
  assertPositive("compoundsPerYear", compoundsPerYear);
  assertInteger("compoundsPerYear", compoundsPerYear);
  assertNonNegative("contributionPerPeriod", contributionPerPeriod);

  const periods = years * compoundsPerYear;
  assertPositive("periods", periods);

  const periodicRate = annualInterestRate / 100 / compoundsPerYear;
  const futurePrincipal = futureValueLumpSum(principal, periodicRate, periods);
  const futureContributions = futureValueOrdinaryAnnuity(
    contributionPerPeriod,
    periodicRate,
    periods
  );

  const futureValue = futurePrincipal + futureContributions;
  const totalContributions = principal + contributionPerPeriod * periods;

  return {
    futureValue: round2(futureValue),
    totalContributions: round2(totalContributions),
    totalInterest: round2(futureValue - totalContributions)
  };
}
