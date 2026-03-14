import { flattenInputSchema } from "@/lib/calculators/input-schema";
import type {
  FlattenedInputField,
  InputSchema,
  InputValidationResult,
  InputValues,
  OutputSchema,
  OutputValidationResult,
  OutputValues
} from "@/types/calculator-engine";

function getToggleValue(field: FlattenedInputField, raw: unknown): number {
  if (field.type !== "toggle") return Number(raw);

  const trueValue = field.trueValue ?? 1;
  const falseValue = field.falseValue ?? 0;
  const isChecked = typeof raw === "boolean" ? raw : raw === "1" || raw === 1;
  return isChecked ? trueValue : falseValue;
}

export function validateInputs<Schema extends InputSchema>(
  schema: Schema,
  values: Partial<Record<string, unknown>>
): InputValidationResult<Schema> {
  const errors: Record<string, string> = {};
  const parsed: Record<string, number> = {};

  for (const field of flattenInputSchema(schema)) {
    const raw = values[field.id];
    const isEmpty =
      raw === "" ||
      raw === null ||
      raw === undefined ||
      (typeof raw === "number" && Number.isNaN(raw));

    if (isEmpty) {
      if (field.required === false) {
        parsed[field.id] = field.defaultValue;
        continue;
      }

      errors[field.id] = `${field.label} is required`;
      continue;
    }

    const numericRaw = getToggleValue(field, raw);
    const numberValue = typeof numericRaw === "number" ? numericRaw : Number(String(numericRaw).trim());

    if (!Number.isFinite(numberValue)) {
      errors[field.id] = `${field.label} must be a valid number`;
      continue;
    }

    if ("min" in field && field.min !== undefined && numberValue < field.min) {
      errors[field.id] = `${field.label} must be at least ${field.min}`;
      continue;
    }

    if ("max" in field && field.max !== undefined && numberValue > field.max) {
      errors[field.id] = `${field.label} must be at most ${field.max}`;
      continue;
    }

    if (field.type === "select") {
      const valid = field.options.some((option) => option.value === numberValue);
      if (!valid) {
        errors[field.id] = `${field.label} is not a valid option`;
        continue;
      }
    }

    parsed[field.id] = numberValue;
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data: parsed as InputValues<Schema> };
}

export function validateOutputs<Schema extends OutputSchema>(
  schema: Schema,
  values: Partial<Record<string, unknown>>
): OutputValidationResult<Schema> {
  const errors: Record<string, string> = {};
  const parsed: Record<string, number> = {};

  for (const field of schema) {
    const value = values[field.id];

    if (typeof value !== "number" || !Number.isFinite(value)) {
      errors[field.id] = `${field.label} output is invalid`;
      continue;
    }

    parsed[field.id] = value;
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data: parsed as OutputValues<Schema> };
}
