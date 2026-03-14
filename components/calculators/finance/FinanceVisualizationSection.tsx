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

const PIE_COLORS = ["#334155", "#64748b", "#94a3b8", "#cbd5e1", "#e2e8f0"];

function formatTooltipNumber(value: unknown): string {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return "0";
  return parsed.toLocaleString("en-US");
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
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatTooltipNumber(value)} />
                <Line type="monotone" dataKey="value" stroke="#0f172a" strokeWidth={2} dot={false} />
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatTooltipNumber(value)} />
                <Bar dataKey="value" fill="#334155" radius={[8, 8, 0, 0]} />
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
                  <Tooltip formatter={(value) => formatTooltipNumber(value)} />
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
                      <Cell key={slice.label} fill={PIE_COLORS[index % PIE_COLORS.length]} />
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
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
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
