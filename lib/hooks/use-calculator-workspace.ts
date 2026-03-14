"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { flattenInputSchema } from "@/lib/calculators/input-schema";
import { getCalculatorById } from "@/lib/calculators/registry";
import {
  decodeValuesFromParams,
  encodeValuesToParams,
  getSchemaParamKeys,
  mergeSearchParams
} from "@/lib/calculators/url-state";
import { validateInputs, validateOutputs } from "@/lib/calculators/validation";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import type {
  CalculatorOutputField,
  CalculatorRuntimeDefinition,
  InputSchema,
  OutputValues
} from "@/types/calculator-engine";

type Mode = "interactive" | "readonly";

type UseCalculatorWorkspaceOptions = {
  mode?: Mode;
};

type CalculationState = {
  errors: Record<string, string>;
  output: OutputValues<readonly CalculatorOutputField[]> | null;
  inputData: Record<string, number> | null;
  generalError: string | null;
};

const COMPARE_PARAM_PREFIX = "cmp_";
const COMPARE_TOGGLE_KEY = "compare";

function formatOutput(value: number, field: CalculatorOutputField): string {
  const decimals = field.decimals ?? 2;

  if (field.format === "currency") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }

  if (field.format === "percent") {
    return `${value.toFixed(decimals)}%`;
  }

  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function buildDefaultValues(schema: InputSchema): Record<string, number> {
  const values: Record<string, number> = {};

  for (const field of flattenInputSchema(schema)) {
    values[field.id] = field.defaultValue;
  }

  return values;
}

function calculateScenario(
  schema: InputSchema,
  outputSchema: readonly CalculatorOutputField[],
  calculate: (input: Record<string, number>) => Record<string, number>,
  values: Record<string, number>
): CalculationState {
  const inputValidation = validateInputs(schema, values);

  if (!inputValidation.ok) {
    return {
      errors: inputValidation.errors,
      output: null,
      inputData: null,
      generalError: null
    };
  }

  try {
    const calculated = calculate(inputValidation.data);
    const outputValidation = validateOutputs(outputSchema, calculated);

    if (!outputValidation.ok) {
      return {
        errors: outputValidation.errors,
        output: null,
        inputData: inputValidation.data,
        generalError: null
      };
    }

    return {
      errors: {},
      output: outputValidation.data,
      inputData: inputValidation.data,
      generalError: null
    };
  } catch {
    return {
      errors: {},
      output: null,
      inputData: inputValidation.data,
      generalError: "Unable to calculate with current inputs"
    };
  }
}

export type CalculatorWorkspaceState = {
  calculator: CalculatorRuntimeDefinition | null;
  isFinanceCalculator: boolean;
  compareEnabled: boolean;
  primaryValues: Record<string, number>;
  compareValues: Record<string, number>;
  primaryResult: CalculationState;
  secondaryResult: CalculationState | null;
  insights: Array<{
    id: string;
    title: string;
    message: string;
    severity?: "info" | "warning" | "success";
  }>;
  visualization: ReturnType<NonNullable<CalculatorRuntimeDefinition["buildVisualizationData"]>> | null;
  tableData: ReturnType<NonNullable<CalculatorRuntimeDefinition["buildTableData"]>> | null;
  csvData: string;
  shareUrl: string;
  shortUrl: string;
  summaryText: string;
  formatOutput: (value: number, field: CalculatorOutputField) => string;
};

export type CalculatorWorkspaceActions = {
  setCompareEnabled: (enabled: boolean) => void;
  setPrimaryInputValue: (fieldId: string, rawValue: string) => void;
  setSecondaryInputValue: (fieldId: string, rawValue: string) => void;
};

const NOOP_ACTIONS: CalculatorWorkspaceActions = {
  setCompareEnabled: () => {},
  setPrimaryInputValue: () => {},
  setSecondaryInputValue: () => {}
};

function createEmptyCalculationState(): CalculationState {
  return {
    errors: {},
    output: null,
    inputData: null,
    generalError: null
  };
}

export function useCalculatorWorkspace(
  calculatorId: string,
  options: UseCalculatorWorkspaceOptions = {}
): { state: CalculatorWorkspaceState; actions: CalculatorWorkspaceActions } {
  const mode = options.mode ?? "interactive";
  const isReadOnly = mode === "readonly";

  const calculator = getCalculatorById(calculatorId);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialValues = useMemo(() => {
    if (!calculator) return {};
    return buildDefaultValues(calculator.inputSchema);
  }, [calculator]);

  const [primaryValues, setPrimaryValues] = useState<Record<string, number>>(initialValues);
  const [compareValues, setCompareValues] = useState<Record<string, number>>(initialValues);
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [urlReady, setUrlReady] = useState(false);

  const resolvedValues = useMemo(() => {
    if (!calculator) return initialValues;

    const params = new URLSearchParams(searchParams.toString());
    const decodedPrimary = decodeValuesFromParams(calculator.inputSchema, params);

    return {
      ...initialValues,
      ...decodedPrimary
    };
  }, [calculator, initialValues, searchParams]);

  const resolvedCompareValues = useMemo(() => {
    if (!calculator) return initialValues;

    const params = new URLSearchParams(searchParams.toString());
    const decodedCompare = decodeValuesFromParams(
      calculator.inputSchema,
      params,
      COMPARE_PARAM_PREFIX
    );

    return {
      ...initialValues,
      ...decodedCompare
    };
  }, [calculator, initialValues, searchParams]);

  useEffect(() => {
    if (!calculator || isReadOnly) {
      setUrlReady(true);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    const nextPrimary = {
      ...initialValues,
      ...decodeValuesFromParams(calculator.inputSchema, params)
    };

    const nextCompare = {
      ...initialValues,
      ...decodeValuesFromParams(calculator.inputSchema, params, COMPARE_PARAM_PREFIX)
    };

    setPrimaryValues(nextPrimary);
    setCompareValues(nextCompare);

    const hasCompareParams = Object.keys(
      decodeValuesFromParams(calculator.inputSchema, params, COMPARE_PARAM_PREFIX)
    ).length > 0;

    const compareFromQuery = params.get(COMPARE_TOGGLE_KEY) === "1";
    setCompareEnabled(calculator.category === "finance" && (compareFromQuery || hasCompareParams));
    setUrlReady(true);
  }, [calculator, initialValues, isReadOnly, searchParams]);

  const debouncedValues = useDebouncedValue(primaryValues, 120);
  const debouncedCompareValues = useDebouncedValue(compareValues, 120);

  useEffect(() => {
    if (!calculator || isReadOnly || !urlReady) return;

    const baseParams = encodeValuesToParams(calculator.inputSchema, debouncedValues);
    const compareParams = compareEnabled
      ? encodeValuesToParams(
          calculator.inputSchema,
          debouncedCompareValues,
          COMPARE_PARAM_PREFIX
        )
      : new URLSearchParams();

    const nextParams = new URLSearchParams();

    for (const [key, value] of baseParams.entries()) {
      nextParams.set(key, value);
    }

    for (const [key, value] of compareParams.entries()) {
      nextParams.set(key, value);
    }

    if (compareEnabled) {
      nextParams.set(COMPARE_TOGGLE_KEY, "1");
    }

    const keysToReplace = [
      ...getSchemaParamKeys(calculator.inputSchema),
      ...getSchemaParamKeys(calculator.inputSchema, COMPARE_PARAM_PREFIX),
      COMPARE_TOGGLE_KEY
    ];

    const merged = mergeSearchParams(
      new URLSearchParams(searchParams.toString()),
      nextParams,
      keysToReplace
    );

    const current = searchParams.toString();
    const target = merged.toString();

    if (current === target) return;

    const href = target ? `${pathname}?${target}` : pathname;
    router.replace(href, { scroll: false });
  }, [
    calculator,
    compareEnabled,
    debouncedCompareValues,
    debouncedValues,
    isReadOnly,
    pathname,
    router,
    searchParams,
    urlReady
  ]);

  const isFinanceCalculator = calculator?.category === "finance";

  const effectivePrimaryValues = isReadOnly ? resolvedValues : primaryValues;
  const effectiveCompareValues = isReadOnly ? resolvedCompareValues : compareValues;
  const effectiveCompareEnabled = useMemo(() => {
    if (!calculator || !isFinanceCalculator) return false;
    if (!isReadOnly) return compareEnabled;

    const params = new URLSearchParams(searchParams.toString());
    const hasCompareParams = Object.keys(
      decodeValuesFromParams(calculator.inputSchema, params, COMPARE_PARAM_PREFIX)
    ).length > 0;

    return params.get(COMPARE_TOGGLE_KEY) === "1" || hasCompareParams;
  }, [calculator, compareEnabled, isFinanceCalculator, isReadOnly, searchParams]);

  const primaryResult = useMemo(() => {
    if (!calculator) return createEmptyCalculationState();

    return calculateScenario(
      calculator.inputSchema,
      calculator.outputSchema,
      calculator.calculate,
      effectivePrimaryValues
    );
  }, [calculator, effectivePrimaryValues]);

  const secondaryResult = useMemo(() => {
    if (!calculator || !effectiveCompareEnabled) return null;

    return calculateScenario(
      calculator.inputSchema,
      calculator.outputSchema,
      calculator.calculate,
      effectiveCompareValues
    );
  }, [calculator, effectiveCompareEnabled, effectiveCompareValues]);

  const insights = useMemo(() => {
    if (!calculator?.insightRules || !primaryResult.output || !primaryResult.inputData) {
      return [];
    }

    return calculator.insightRules(primaryResult.output, primaryResult.inputData);
  }, [calculator, primaryResult.inputData, primaryResult.output]);

  const visualization = useMemo(() => {
    if (
      !isFinanceCalculator ||
      !calculator?.buildVisualizationData ||
      !primaryResult.output ||
      !primaryResult.inputData
    ) {
      return null;
    }

    return calculator.buildVisualizationData(primaryResult.output, primaryResult.inputData);
  }, [calculator, isFinanceCalculator, primaryResult.inputData, primaryResult.output]);

  const tableData = useMemo(() => {
    if (
      !isFinanceCalculator ||
      !calculator?.buildTableData ||
      !primaryResult.output ||
      !primaryResult.inputData
    ) {
      return null;
    }

    return calculator.buildTableData(primaryResult.output, primaryResult.inputData);
  }, [calculator, isFinanceCalculator, primaryResult.inputData, primaryResult.output]);

  const csvData = useMemo(() => {
    if (!tableData) return "";

    const header = tableData.columns.map((column) => column.label).join(",");
    const rows = tableData.rows.map((row) =>
      tableData.columns
        .map((column) => {
          const value = row[column.key];
          return Number.isFinite(value) ? String(value) : "";
        })
        .join(",")
    );

    return [header, ...rows].join("\n");
  }, [tableData]);

  const shareUrl = useMemo(() => {
    if (!calculator) return "";

    const params = new URLSearchParams();

    const first = encodeValuesToParams(calculator.inputSchema, effectivePrimaryValues);
    for (const [key, value] of first.entries()) {
      params.set(key, value);
    }

    if (effectiveCompareEnabled) {
      const second = encodeValuesToParams(
        calculator.inputSchema,
        effectiveCompareValues,
        COMPARE_PARAM_PREFIX
      );

      for (const [key, value] of second.entries()) {
        params.set(key, value);
      }

      params.set(COMPARE_TOGGLE_KEY, "1");
    }

    const query = params.toString();
    const relative = query ? `${pathname}?${query}` : pathname;
    const origin =
      typeof window === "undefined" ? "https://www.numerly.com" : window.location.origin;

    return `${origin}${relative}`;
  }, [calculator, effectiveCompareEnabled, effectiveCompareValues, effectivePrimaryValues, pathname]);

  const shortUrl = useMemo(() => {
    const origin =
      typeof window === "undefined" ? "https://www.numerly.com" : window.location.origin;
    return `${origin}${pathname}`;
  }, [pathname]);

  const summaryText = useMemo(() => {
    if (!calculator) return "";

    if (!primaryResult.output) {
      return `${calculator.metadata.title}\n\nNo valid result yet.\n${shareUrl}`;
    }

    const lines = calculator.outputSchema.map((field) => {
      const value = (primaryResult.output as Record<string, number>)[field.id];
      return `${field.label}: ${formatOutput(value, field)}`;
    });

    return [calculator.metadata.title, "", ...lines, "", `Link: ${shareUrl}`].join("\n");
  }, [calculator, primaryResult.output, shareUrl]);

  const setInputValue = useCallback(
    (
      setter: Dispatch<SetStateAction<Record<string, number>>>,
      fieldId: string,
      rawValue: string
    ) => {
      setter((current) => ({
        ...current,
        [fieldId]: rawValue === "" ? Number.NaN : Number(rawValue)
      }));
    },
    []
  );

  const actions = useMemo<CalculatorWorkspaceActions>(() => {
    if (!calculator || isReadOnly) return NOOP_ACTIONS;

    return {
      setCompareEnabled,
      setPrimaryInputValue: (fieldId, rawValue) =>
        setInputValue(setPrimaryValues, fieldId, rawValue),
      setSecondaryInputValue: (fieldId, rawValue) =>
        setInputValue(setCompareValues, fieldId, rawValue)
    };
  }, [calculator, isReadOnly, setInputValue]);

  const state: CalculatorWorkspaceState = {
    calculator,
    isFinanceCalculator: Boolean(isFinanceCalculator),
    compareEnabled: effectiveCompareEnabled,
    primaryValues: effectivePrimaryValues,
    compareValues: effectiveCompareValues,
    primaryResult,
    secondaryResult,
    insights,
    visualization,
    tableData,
    csvData,
    shareUrl,
    shortUrl,
    summaryText,
    formatOutput
  };

  return { state, actions };
}
