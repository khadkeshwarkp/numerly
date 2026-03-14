import type { CalculatorInputField } from "@/types/calculator-engine";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CurrencyField } from "@/components/calculator/fields/CurrencyField";
import { DurationField } from "@/components/calculator/fields/DurationField";
import { PercentField } from "@/components/calculator/fields/PercentField";
import { SelectField } from "@/components/calculator/fields/SelectField";

type Props = {
  id: string;
  field: CalculatorInputField;
  value: number;
  hasError?: boolean;
  values: Record<string, number>;
  onChange: (value: string) => void;
};

function resolveSuffix(field: CalculatorInputField, values: Record<string, number>): string | undefined {
  if (field.suffix) return field.suffix;
  if (!field.unitBy) return field.unit;

  const raw = values[field.unitBy.fieldId];
  const mapped = Number.isFinite(raw) ? field.unitBy.map[raw] : undefined;
  return mapped ?? field.unitBy.fallback ?? field.unit;
}

export function FieldRenderer({ id, field, value, hasError, values, onChange }: Props) {
  const suffix = resolveSuffix(field, values);

  if (field.type === "fieldset") {
    return null;
  }

  if (field.type === "select") {
    return (
      <SelectField
        value={Number.isFinite(value) ? value : null}
        options={field.options}
        placeholder={field.placeholder}
        onChange={onChange}
      />
    );
  }

  if (field.type === "toggle") {
    const trueValue = field.trueValue ?? 1;
    const isChecked = Number.isFinite(value) ? value === trueValue : false;

    return (
      <div className="flex items-center justify-between rounded-md border px-3 py-2">
        <span className="text-sm">{field.label}</span>
        <Switch checked={isChecked} onCheckedChange={(next) => onChange(next ? "1" : "0")} />
      </div>
    );
  }

  if (field.type === "currency") {
    return (
      <CurrencyField
        id={id}
        value={value}
        prefix={field.prefix}
        suffix={suffix}
        placeholder={field.placeholder}
        min={field.min}
        max={field.max}
        step={field.step}
        inputMode={field.inputMode}
        hasError={hasError}
        onChange={onChange}
      />
    );
  }

  if (field.type === "percent") {
    return (
      <PercentField
        id={id}
        value={value}
        placeholder={field.placeholder}
        min={field.min}
        max={field.max}
        step={field.step}
        showSlider
        hasError={hasError}
        onChange={onChange}
      />
    );
  }

  if (field.type === "duration") {
    return (
      <DurationField
        id={id}
        value={value}
        suffix={suffix}
        placeholder={field.placeholder}
        min={field.min}
        max={field.max}
        step={field.step}
        inputMode={field.inputMode}
        hasError={hasError}
        onChange={onChange}
      />
    );
  }

  if (suffix) {
    return (
      <DurationField
        id={id}
        value={value}
        suffix={suffix}
        placeholder={field.placeholder}
        min={field.min}
        max={field.max}
        step={field.step}
        inputMode={field.inputMode}
        hasError={hasError}
        onChange={onChange}
      />
    );
  }

  const displayValue = Number.isFinite(value) ? value : "";

  return (
    <Input
      id={id}
      type="number"
      inputMode={field.inputMode ?? "decimal"}
      value={displayValue}
      min={field.min}
      max={field.max}
      step={field.step}
      placeholder={field.placeholder}
      aria-invalid={hasError}
      onChange={(event) => onChange(event.target.value)}
      className="h-11"
    />
  );
}
