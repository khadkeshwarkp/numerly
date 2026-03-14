"use client";

import { SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { AdvancedFieldset } from "@/components/calculator/fields/AdvancedFieldset";
import { FieldRenderer } from "@/components/calculator/fields/FieldRenderer";
import { CalculatorCard } from "@/components/calculator/CalculatorCard";
import { Switch } from "@/components/ui/switch";
import type { CalculatorInputField, InputSchema } from "@/types/calculator-engine";

type Scenario = {
  id: string;
  label: string;
  values: Record<string, number>;
  errors: Record<string, string>;
  onValueChange: (fieldId: string, rawValue: string) => void;
};

type Props = {
  title: string;
  inputSchema: InputSchema;
  scenarios: Scenario[];
  compareEnabled?: boolean;
  showCompareToggle?: boolean;
  onCompareEnabledChange?: (enabled: boolean) => void;
  actions?: ReactNode;
  compact?: boolean;
};

export function CalculatorInputs({
  title,
  inputSchema,
  scenarios,
  compareEnabled,
  showCompareToggle,
  onCompareEnabledChange,
  actions,
  compact = false
}: Props) {
  const [openFieldsets, setOpenFieldsets] = useState<Record<string, boolean>>({});

  function isFieldsetOpen(field: CalculatorInputField): boolean {
    if (field.type !== "fieldset") return true;
    return openFieldsets[field.id] ?? !field.collapsedByDefault;
  }

  function toggleFieldset(fieldId: string, isOpen: boolean) {
    setOpenFieldsets((current) => ({ ...current, [fieldId]: !isOpen }));
  }

  function renderField(
    field: CalculatorInputField,
    scenario: Scenario
  ): ReactNode {
    if (field.type === "fieldset") {
      const open = isFieldsetOpen(field);
      return (
        <AdvancedFieldset
          key={`${scenario.id}-${field.id}`}
          title={field.label}
          description={field.description}
          open={open}
          onToggle={() => toggleFieldset(field.id, open)}
        >
          {field.fields.map((nested) => renderField(nested, scenario))}
        </AdvancedFieldset>
      );
    }

    const id = `${scenario.id}-${field.id}`;
    const hasError = Boolean(scenario.errors[field.id]);
    const value = scenario.values[field.id];
    const showLabel = field.type !== "toggle";
    const showValue = field.type !== "toggle" && field.type !== "select";

    return (
      <div key={id} className="space-y-2">
        {showLabel ? (
          <div className="flex items-start justify-between gap-2">
            <label htmlFor={id} className="text-sm font-medium">
              {field.label}
            </label>
            {showValue && Number.isFinite(value) ? (
              <span className="text-xs tabular-nums text-muted-foreground">{value}</span>
            ) : null}
          </div>
        ) : null}
        {field.description ? (
          <p className="text-xs text-muted-foreground">{field.description}</p>
        ) : null}
        <FieldRenderer
          id={id}
          field={field}
          value={value}
          hasError={hasError}
          values={scenario.values}
          onChange={(nextValue) => scenario.onValueChange(field.id, nextValue)}
        />
        {hasError ? (
          <p id={`${id}-error`} className="text-xs text-destructive" role="alert">
            {scenario.errors[field.id]}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <CalculatorCard title={title}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        {showCompareToggle ? (
          <label className="inline-flex items-center gap-2 text-sm text-muted-foreground" htmlFor="compare-toggle">
            <Switch
              id="compare-toggle"
              checked={Boolean(compareEnabled)}
              onCheckedChange={onCompareEnabledChange}
              aria-label="Compare another scenario"
            />
            Compare another scenario
          </label>
        ) : (
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            Interactive inputs
          </span>
        )}
        {actions}
      </div>

      <div className={compact ? "space-y-3" : "space-y-4"}>
        {scenarios.map((scenario) => (
          <fieldset key={scenario.id} className="space-y-4 rounded-lg border bg-muted/40 p-4">
            <legend className="px-1 text-sm font-medium text-muted-foreground">{scenario.label}</legend>
            {inputSchema.map((field) => renderField(field, scenario))}
          </fieldset>
        ))}
      </div>
    </CalculatorCard>
  );
}
