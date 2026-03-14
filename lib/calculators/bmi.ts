export type BmiInput = {
  unitSystem: number;
  weight: number;
  height: number;
};

export type BmiResult = {
  bmi: number;
};

const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function calculateBmi({ unitSystem, weight, height }: BmiInput): BmiResult {
  if (!Number.isFinite(weight) || weight <= 0) {
    throw new RangeError("weight must be a positive number");
  }

  if (!Number.isFinite(height) || height <= 0) {
    throw new RangeError("height must be a positive number");
  }

  const isImperial = unitSystem === 1;
  const weightKg = isImperial ? weight * 0.45359237 : weight;
  const heightCm = isImperial ? height * 2.54 : height;
  const heightM = heightCm / 100;
  return { bmi: round2(weightKg / heightM ** 2) };
}
