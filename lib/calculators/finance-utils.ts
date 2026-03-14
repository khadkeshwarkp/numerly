export type AmortizedLoanResult = {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
};

const EPSILON = 1e-12;

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function assertFinite(name: string, value: number): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} must be a finite number`);
  }
}

export function assertNonNegative(name: string, value: number): void {
  assertFinite(name, value);
  if (value < 0) {
    throw new RangeError(`${name} must be a non-negative number`);
  }
}

export function assertPositive(name: string, value: number): void {
  assertFinite(name, value);
  if (value <= 0) {
    throw new RangeError(`${name} must be a positive number`);
  }
}

export function assertInteger(name: string, value: number): void {
  assertFinite(name, value);
  if (!Number.isInteger(value)) {
    throw new RangeError(`${name} must be an integer`);
  }
}

export function calculateAmortizedLoan(
  principal: number,
  annualInterestRate: number,
  loanTermMonths: number
): AmortizedLoanResult {
  assertPositive("principal", principal);
  assertNonNegative("annualInterestRate", annualInterestRate);
  assertPositive("loanTermMonths", loanTermMonths);
  assertInteger("loanTermMonths", loanTermMonths);

  const monthlyRate = annualInterestRate / 100 / 12;
  const n = loanTermMonths;

  const monthlyPayment =
    monthlyRate <= EPSILON
      ? principal / n
      : (principal * monthlyRate * (1 + monthlyRate) ** n) /
        ((1 + monthlyRate) ** n - 1);

  const totalPayment = monthlyPayment * n;

  return {
    monthlyPayment,
    totalPayment,
    totalInterest: totalPayment - principal
  };
}

export function futureValueLumpSum(
  principal: number,
  periodicRate: number,
  periods: number
): number {
  assertNonNegative("principal", principal);
  assertNonNegative("periodicRate", periodicRate);
  assertNonNegative("periods", periods);

  return principal * (1 + periodicRate) ** periods;
}

export function futureValueOrdinaryAnnuity(
  contributionPerPeriod: number,
  periodicRate: number,
  periods: number
): number {
  assertNonNegative("contributionPerPeriod", contributionPerPeriod);
  assertNonNegative("periodicRate", periodicRate);
  assertNonNegative("periods", periods);

  if (periodicRate <= EPSILON) {
    return contributionPerPeriod * periods;
  }

  return (
    contributionPerPeriod * (((1 + periodicRate) ** periods - 1) / periodicRate)
  );
}
