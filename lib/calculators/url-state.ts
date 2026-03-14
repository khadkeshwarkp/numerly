import { flattenInputSchema } from "@/lib/calculators/input-schema";
import type { InputSchema } from "@/types/calculator-engine";

function getParamKey(
  field: InputSchema[number],
  scopePrefix?: string
): string {
  const base = field.queryKey ?? field.id;
  return scopePrefix ? `${scopePrefix}${base}` : base;
}

export function decodeValuesFromParams(
  schema: InputSchema,
  params: URLSearchParams,
  scopePrefix?: string
): Record<string, number> {
  const decoded: Record<string, number> = {};

  for (const field of flattenInputSchema(schema)) {
    const key = getParamKey(field, scopePrefix);
    const raw = params.get(key);
    if (raw === null) continue;

    const value = Number(raw);
    if (Number.isFinite(value)) {
      decoded[field.id] = value;
    }
  }

  return decoded;
}

export function encodeValuesToParams(
  schema: InputSchema,
  values: Record<string, number>,
  scopePrefix?: string
): URLSearchParams {
  const params = new URLSearchParams();

  for (const field of flattenInputSchema(schema)) {
    const value = values[field.id];
    if (!Number.isFinite(value)) continue;

    const key = getParamKey(field, scopePrefix);
    params.set(key, String(value));
  }

  return params;
}

export function mergeSearchParams(
  baseParams: URLSearchParams,
  newParams: URLSearchParams,
  keysToReplace: string[]
): URLSearchParams {
  const merged = new URLSearchParams(baseParams.toString());

  for (const key of keysToReplace) {
    merged.delete(key);
  }

  for (const [key, value] of newParams.entries()) {
    merged.set(key, value);
  }

  return merged;
}

export function getSchemaParamKeys(
  schema: InputSchema,
  scopePrefix?: string
): string[] {
  return flattenInputSchema(schema).map((field) => getParamKey(field, scopePrefix));
}
