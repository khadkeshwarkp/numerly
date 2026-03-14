import { calculateBmi } from "@/lib/calculators/bmi";
import type { CalculatorDefinition } from "@/types/calculator-engine";

const inputSchema = [
  {
    id: "unitSystem",
    queryKey: "unit",
    label: "Unit system",
    type: "select",
    defaultValue: 0,
    options: [
      { label: "Metric (kg, cm)", value: 0 },
      { label: "US (lb, in)", value: 1 }
    ],
    required: true
  },
  {
    id: "weight",
    queryKey: "weight",
    label: "Weight",
    type: "number",
    defaultValue: 70,
    min: 1,
    step: 0.1,
    inputMode: "decimal",
    unitBy: {
      fieldId: "unitSystem",
      map: {
        0: "kg",
        1: "lb"
      }
    },
    required: true
  },
  {
    id: "height",
    queryKey: "height",
    label: "Height",
    type: "number",
    defaultValue: 175,
    min: 1,
    step: 0.1,
    inputMode: "decimal",
    unitBy: {
      fieldId: "unitSystem",
      map: {
        0: "cm",
        1: "in"
      }
    },
    required: true
  }
] as const;

const outputSchema = [{ id: "bmi", label: "BMI", format: "number", decimals: 2 }] as const;

export const bmiCalculatorDefinition = {
  id: "bmi-calculator",
  category: "health",
  slug: "bmi-calculator",
  metadata: {
    title: "BMI Calculator",
    tags: ["health", "body", "weight", "fitness"],
    monetizationWeight: 1,
    difficulty: "beginner"
  },
  inputSchema,
  outputSchema,
  calculate: calculateBmi
} satisfies CalculatorDefinition<typeof inputSchema, typeof outputSchema>;
