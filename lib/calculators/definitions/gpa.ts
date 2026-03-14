import { calculateGpa } from "@/lib/calculators/gpa";
import type { CalculatorDefinition } from "@/types/calculator-engine";

const inputSchema = [
  {
    id: "totalGradePoints",
    queryKey: "points",
    label: "Total Grade Points",
    type: "number",
    defaultValue: 42,
    min: 0,
    step: 0.01,
    required: true
  },
  {
    id: "totalCredits",
    queryKey: "credits",
    label: "Total Credits",
    type: "number",
    defaultValue: 12,
    min: 0.5,
    step: 0.5,
    required: true
  }
] as const;

const outputSchema = [
  { id: "gpa", label: "GPA", format: "number", decimals: 2 }
] as const;

export const gpaCalculatorDefinition = {
  id: "gpa-calculator",
  category: "education",
  slug: "gpa-calculator",
  metadata: {
    title: "GPA Calculator",
    tags: ["grades", "average", "score", "education"],
    monetizationWeight: 1,
    difficulty: "beginner"
  },
  inputSchema,
  outputSchema,
  calculate: calculateGpa
} satisfies CalculatorDefinition<typeof inputSchema, typeof outputSchema>;
