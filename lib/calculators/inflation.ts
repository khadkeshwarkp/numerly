import { assertNonNegative, assertPositive, round2 } from "@/lib/calculators/finance-utils";

export type InflationInput = {
  currentAmount: number;
  annualInflationRate: number;
  years: number;
};

export type InflationResult = {
  futureCost: number;
  cumulativeInflationPercent: number;
  purchasingPower: number;
  valueIncrease: number;
};

export function calculateInflation({
  currentAmount,
  annualInflationRate,
  years
}: InflationInput): InflationResult {
  assertPositive("currentAmount", currentAmount);
  assertNonNegative("annualInflationRate", annualInflationRate);
  assertPositive("years", years);

  const inflationFactor = (1 + annualInflationRate / 100) ** years;
  const futureCost = currentAmount * inflationFactor;
  const purchasingPower = currentAmount / inflationFactor;
  const valueIncrease = futureCost - currentAmount;
  const cumulativeInflationPercent = (inflationFactor - 1) * 100;

  return {
    futureCost: round2(futureCost),
    cumulativeInflationPercent: round2(cumulativeInflationPercent),
    purchasingPower: round2(purchasingPower),
    valueIncrease: round2(valueIncrease)
  };
}
