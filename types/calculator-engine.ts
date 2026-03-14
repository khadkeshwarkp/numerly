export type FieldOption = {
  label: string;
  value: number;
};

type BaseInputField<Id extends string = string> = {
  id: Id;
  queryKey?: string;
  label: string;
  required?: boolean;
  description?: string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  unit?: string;
  inputMode?: "decimal" | "numeric";
  advanced?: boolean;
  group?: string;
  unitBy?: {
    fieldId: string;
    map: Record<number, string>;
    fallback?: string;
  };
};

export type NumberInputField<Id extends string = string> = BaseInputField<Id> & {
  type: "number" | "currency" | "percent" | "duration";
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
};

export type SelectInputField<Id extends string = string> = BaseInputField<Id> & {
  type: "select";
  defaultValue: number;
  options: readonly FieldOption[];
};

export type ToggleInputField<Id extends string = string> = BaseInputField<Id> & {
  type: "toggle";
  defaultValue: number;
  trueValue?: number;
  falseValue?: number;
};

export type LeafInputField =
  | NumberInputField
  | SelectInputField
  | ToggleInputField;

export type FieldsetInputField<Id extends string = string> = BaseInputField<Id> & {
  type: "fieldset";
  fields: readonly LeafInputField[];
  collapsedByDefault?: boolean;
};

export type CalculatorInputField = LeafInputField | FieldsetInputField;
export type InputSchema = readonly CalculatorInputField[];
export type FlattenedInputField = LeafInputField;

export type OutputFormat = "number" | "currency" | "percent";

export type CalculatorOutputField<Id extends string = string> = {
  id: Id;
  label: string;
  format?: OutputFormat;
  decimals?: number;
};

export type OutputSchema = readonly CalculatorOutputField[];

type FlattenSchema<Schema extends InputSchema> =
  Schema[number] extends FieldsetInputField
    ? FieldsetInputField["fields"][number]
    : Schema[number];

export type InputValues<Schema extends InputSchema> = {
  [Field in FlattenSchema<Schema> as Field["id"]]: number;
};

export type OutputValues<Schema extends OutputSchema> = {
  [Field in Schema[number] as Field["id"]]: number;
};

export type CalculatorInsightSeverity = "info" | "warning" | "success";

export type CalculatorInsight = {
  id: string;
  title: string;
  message: string;
  severity?: CalculatorInsightSeverity;
};

export type ChartPoint = {
  x: number;
  y: number;
  label?: string;
};

export type LineChartData = {
  title: string;
  yLabel?: string;
  points: ChartPoint[];
};

export type BarChartDatum = {
  label: string;
  value: number;
};

export type BarChartData = {
  title: string;
  bars: BarChartDatum[];
};

export type PieChartDatum = {
  label: string;
  value: number;
};

export type PieChartData = {
  title: string;
  slices: PieChartDatum[];
};

export type CalculatorVisualizationData = {
  lineChart?: LineChartData;
  barChart?: BarChartData;
  pieChart?: PieChartData;
};

export type TableColumn = {
  key: string;
  label: string;
  format?: OutputFormat;
};

export type CalculatorTableData = {
  title: string;
  pageSize?: number;
  columns: TableColumn[];
  rows: Array<Record<string, number>>;
};

export type CalculatorRegistryMetadata = {
  title: string;
  tags: readonly string[];
  monetizationWeight?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  presentation?: {
    primaryOutputId?: string;
    chartDensity?: "compact" | "comfortable";
    compactInputs?: boolean;
    defaultAdvancedOpen?: boolean;
    resultTone?: "neutral" | "positive" | "caution";
  };
};

export type CalculatorDefinition<
  InSchema extends InputSchema = InputSchema,
  OutSchema extends OutputSchema = OutputSchema
> = {
  id: string;
  category: string;
  slug: string;
  metadata: CalculatorRegistryMetadata;
  inputSchema: InSchema;
  outputSchema: OutSchema;
  calculate: (input: InputValues<InSchema>) => OutputValues<OutSchema>;
  insightRules?: (
    output: OutputValues<OutSchema>,
    input: InputValues<InSchema>
  ) => CalculatorInsight[];
  buildVisualizationData?: (
    output: OutputValues<OutSchema>,
    input: InputValues<InSchema>
  ) => CalculatorVisualizationData | null;
  buildTableData?: (
    output: OutputValues<OutSchema>,
    input: InputValues<InSchema>
  ) => CalculatorTableData | null;
};

export type CalculatorRuntimeDefinition = {
  id: string;
  category: string;
  slug: string;
  metadata: CalculatorRegistryMetadata;
  inputSchema: InputSchema;
  outputSchema: OutputSchema;
  calculate: (input: Record<string, number>) => Record<string, number>;
  insightRules?: (
    output: Record<string, number>,
    input: Record<string, number>
  ) => CalculatorInsight[];
  buildVisualizationData?: (
    output: Record<string, number>,
    input: Record<string, number>
  ) => CalculatorVisualizationData | null;
  buildTableData?: (
    output: Record<string, number>,
    input: Record<string, number>
  ) => CalculatorTableData | null;
};

export type InputValidationResult<Schema extends InputSchema> =
  | { ok: true; data: InputValues<Schema> }
  | { ok: false; errors: Record<string, string> };

export type OutputValidationResult<Schema extends OutputSchema> =
  | { ok: true; data: OutputValues<Schema> }
  | { ok: false; errors: Record<string, string> };
