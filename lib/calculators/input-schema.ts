import type { FlattenedInputField, InputSchema } from "@/types/calculator-engine";

export function flattenInputSchema(
  schema: InputSchema | readonly FlattenedInputField[]
): FlattenedInputField[] {
  const flattened: FlattenedInputField[] = [];

  for (const field of schema) {
    if (field.type === "fieldset") {
      flattened.push(...flattenInputSchema(field.fields));
      continue;
    }

    flattened.push(field);
  }

  return flattened;
}
