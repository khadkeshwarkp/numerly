export type GpaInput = {
  totalGradePoints: number;
  totalCredits: number;
};

export type GpaResult = {
  gpa: number;
};

const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function calculateGpa({ totalGradePoints, totalCredits }: GpaInput): GpaResult {
  if (!Number.isFinite(totalGradePoints) || totalGradePoints < 0) {
    throw new RangeError("totalGradePoints must be a non-negative number");
  }

  if (!Number.isFinite(totalCredits) || totalCredits <= 0) {
    throw new RangeError("totalCredits must be a positive number");
  }

  return { gpa: round2(totalGradePoints / totalCredits) };
}
