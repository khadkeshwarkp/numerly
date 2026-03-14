"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CalculatorTableData, OutputFormat } from "@/types/calculator-engine";

type Props = {
  tableData: CalculatorTableData;
};

function formatCell(value: number, format: OutputFormat | undefined): string {
  if (format === "currency") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  if (format === "percent") {
    return `${value.toFixed(2)}%`;
  }

  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

export function LoanTableSection({ tableData }: Props) {
  const pageSize = tableData.pageSize ?? 24;
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(false);

  const totalPages = Math.max(1, Math.ceil(tableData.rows.length / pageSize));

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return tableData.rows.slice(start, start + pageSize);
  }, [page, pageSize, tableData.rows]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
        >
          <CardTitle>{tableData.title}</CardTitle>
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </CardHeader>

      {expanded ? (
        <CardContent className="space-y-4">
          <div className="max-h-[560px] overflow-auto rounded-lg border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {tableData.columns.map((column) => (
                    <th key={column.key} scope="col" className="sticky top-0 bg-card px-3 py-2 text-left font-medium">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row, rowIndex) => (
                  <tr key={`${row.month ?? rowIndex}-${rowIndex}`} className="border-t">
                    {tableData.columns.map((column) => (
                      <td key={column.key} className="whitespace-nowrap px-3 py-2 tabular-nums">
                        {formatCell(row[column.key], column.format)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between gap-3 text-sm">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={page <= 1}
              aria-label="Go to previous table page"
            >
              Previous
            </Button>
            <span className="tabular-nums text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              disabled={page >= totalPages}
              aria-label="Go to next table page"
            >
              Next
            </Button>
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
}
