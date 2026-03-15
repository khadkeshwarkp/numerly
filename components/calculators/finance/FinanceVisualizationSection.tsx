"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { LoanTableSection } from "@/components/calculators/finance/LoanTableSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  CalculatorTableData,
  CalculatorVisualizationData
} from "@/types/calculator-engine";

type Props = {
  visualization: CalculatorVisualizationData | null;
  tableData: CalculatorTableData | null;
};

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))"
];

function formatTooltipNumber(value: unknown): string {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return "0";
  return parsed.toLocaleString("en-US");
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; name: string }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-card/95 px-3 py-2 text-xs text-muted-foreground shadow-soft">
      {payload.map((item) => (
        <div key={item.name} className="flex items-center justify-between gap-4">
          <span>{item.name}</span>
          <span className="font-semibold text-foreground">{formatTooltipNumber(item.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function FinanceVisualizationSection({ visualization, tableData }: Props) {
  if (!visualization && !tableData) return null;

  return (
    <div className="space-y-6">
      {visualization?.lineChart ? (
        <Card>
          <CardHeader>
            <CardTitle>{visualization.lineChart.title}</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={visualization.lineChart.points.map((point) => ({
                  label: point.label ?? point.x,
                  value: point.y
                }))}
                margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="numerly-line" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--chart-2))" />
                    <stop offset="100%" stopColor="hsl(var(--chart-1))" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 6" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Balance"
                  stroke="url(#numerly-line)"
                  strokeWidth={2.5}
                  dot={{ r: 2, strokeWidth: 2, stroke: "hsl(var(--chart-1))", fill: "hsl(var(--background))" }}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : null}

      {visualization?.barChart ? (
        <Card>
          <CardHeader>
            <CardTitle>{visualization.barChart.title}</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visualization.barChart.bars}>
                <defs>
                  <linearGradient id="numerly-bar" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-3))" />
                    <stop offset="100%" stopColor="hsl(var(--chart-1))" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 6" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="value" name="Value" fill="url(#numerly-bar)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : null}

      {visualization?.pieChart ? (
        <Card>
          <CardHeader>
            <CardTitle>{visualization.pieChart.title}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-[minmax(0,340px)_1fr]">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {visualization.pieChart.slices.map((slice, index) => (
                      <linearGradient
                        key={slice.label}
                        id={`numerly-slice-${index}`}
                        x1="0"
                        x2="1"
                        y1="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor={CHART_COLORS[index % CHART_COLORS.length]} />
                        <stop offset="100%" stopColor="hsl(var(--background))" />
                      </linearGradient>
                    ))}
                  </defs>
                  <Tooltip content={<ChartTooltip />} />
                  <Pie
                    data={visualization.pieChart.slices}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    innerRadius={38}
                  >
                    {visualization.pieChart.slices.map((slice, index) => (
                      <Cell key={slice.label} fill={`url(#numerly-slice-${index})`} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {visualization.pieChart.slices.map((slice, index) => (
                <div
                  key={slice.label}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm"
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                    aria-hidden="true"
                  />
                  <span>{slice.label}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {slice.value.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {tableData ? <LoanTableSection tableData={tableData} /> : null}
    </div>
  );
}
