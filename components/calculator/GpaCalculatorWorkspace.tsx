"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { CalculatorCard } from "@/components/calculator/CalculatorCard";
import { ShareCenter } from "@/components/calculators/ShareCenter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type Props = {
  title: string;
};

type CourseRow = {
  grade: string;
  credits: string;
};

const MAX_ROWS = 50;
const GPA_GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"] as const;

const GRADE_POINTS: Record<(typeof GPA_GRADES)[number], number> = {
  "A+": 4,
  A: 4,
  "A-": 3.7,
  "B+": 3.3,
  B: 3,
  "B-": 2.7,
  "C+": 2.3,
  C: 2,
  "C-": 1.7,
  "D+": 1.3,
  D: 1,
  "D-": 0.7,
  F: 0
};

function makeInitialRows(): CourseRow[] {
  return Array.from({ length: MAX_ROWS }, () => ({ grade: "", credits: "" }));
}

function isRowComplete(row: CourseRow): boolean {
  const credits = Number(row.credits);
  return Boolean(row.grade) && Number.isFinite(credits) && credits > 0;
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function parseCoursesParam(raw: string | null): CourseRow[] {
  const rows = makeInitialRows();
  if (!raw) return rows;

  const parsed = decodeURIComponent(raw)
    .split(";")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .slice(0, MAX_ROWS);

  parsed.forEach((entry, index) => {
    const [gradeRaw, creditsRaw] = entry.split("~");
    const grade = GPA_GRADES.includes(gradeRaw as (typeof GPA_GRADES)[number]) ? gradeRaw : "";
    const creditsNum = Number(creditsRaw);

    rows[index] = {
      grade,
      credits: Number.isFinite(creditsNum) && creditsNum > 0 ? String(creditsNum) : ""
    };
  });

  return rows;
}

export function GpaCalculatorWorkspace({ title }: Props) {
  const pathname = usePathname();
  const [rows, setRows] = useState<CourseRow[]>(makeInitialRows());
  const [includeCumulative, setIncludeCumulative] = useState(false);
  const [priorGpa, setPriorGpa] = useState("");
  const [priorCredits, setPriorCredits] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRows(parseCoursesParam(params.get("courses")));
    setIncludeCumulative(params.get("cumulative") === "1");
    setPriorGpa(params.get("priorGpa") ?? "");
    setPriorCredits(params.get("priorCredits") ?? "");
  }, []);

  const completedRows = useMemo(() => rows.filter(isRowComplete), [rows]);
  const coursesParam = useMemo(
    () => completedRows.map((row) => `${row.grade}~${row.credits}`).join(";"),
    [completedRows]
  );
  const encodedCourses = useMemo(
    () => (coursesParam ? encodeURIComponent(coursesParam) : ""),
    [coursesParam]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (encodedCourses) params.set("courses", encodedCourses);
    else params.delete("courses");

    if (includeCumulative) {
      params.set("cumulative", "1");
      if (priorGpa) params.set("priorGpa", priorGpa);
      else params.delete("priorGpa");
      if (priorCredits) params.set("priorCredits", priorCredits);
      else params.delete("priorCredits");
    } else {
      params.delete("cumulative");
      params.delete("priorGpa");
      params.delete("priorCredits");
    }

    const nextQuery = params.toString();
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
    window.history.replaceState(null, "", nextUrl);
  }, [encodedCourses, includeCumulative, pathname, priorCredits, priorGpa]);

  const visibleCount = useMemo(() => {
    let count = 1;
    while (count < MAX_ROWS && isRowComplete(rows[count - 1])) count += 1;
    return count;
  }, [rows]);

  const stats = useMemo(() => {
    let totalCredits = 0;
    let totalPoints = 0;

    for (const row of completedRows) {
      const credits = Number(row.credits);
      const gradePoints = GRADE_POINTS[row.grade as keyof typeof GRADE_POINTS] ?? 0;
      totalCredits += credits;
      totalPoints += credits * gradePoints;
    }

    const priorGpaValue = Number(priorGpa);
    const priorCreditsValue = Number(priorCredits);
    const hasPrior =
      includeCumulative &&
      Number.isFinite(priorGpaValue) &&
      priorGpaValue >= 0 &&
      Number.isFinite(priorCreditsValue) &&
      priorCreditsValue > 0;

    const combinedCredits = totalCredits + (hasPrior ? priorCreditsValue : 0);
    const combinedPoints = totalPoints + (hasPrior ? priorGpaValue * priorCreditsValue : 0);
    const gpa = combinedCredits > 0 ? round2(combinedPoints / combinedCredits) : 0;

    return {
      gpa,
      totalCredits: round2(combinedCredits),
      currentCredits: round2(totalCredits),
      priorCredits: hasPrior ? round2(priorCreditsValue) : 0,
      courses: completedRows.length,
      hasPrior
    };
  }, [completedRows, includeCumulative, priorCredits, priorGpa]);

  const stateUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const origin = window.location.origin;
    const params = new URLSearchParams();
    if (encodedCourses) params.set("courses", encodedCourses);
    if (includeCumulative) {
      params.set("cumulative", "1");
      if (priorGpa) params.set("priorGpa", priorGpa);
      if (priorCredits) params.set("priorCredits", priorCredits);
    }
    const query = params.toString();
    return query ? `${origin}${pathname}?${query}` : `${origin}${pathname}`;
  }, [encodedCourses, includeCumulative, pathname, priorCredits, priorGpa]);

  const shortUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}${pathname}`;
  }, [pathname]);

  const summaryText = useMemo(() => {
    const lines = [
      `GPA: ${stats.gpa.toFixed(2)}`,
      `Total credits: ${stats.totalCredits.toFixed(2)}`,
      `Courses: ${stats.courses}`
    ];
    if (stats.hasPrior) {
      lines.push(`Includes prior credits: ${stats.priorCredits.toFixed(2)}`);
    }
    return [title, "", ...lines, "", `Link: ${stateUrl}`].join("\n");
  }, [stateUrl, stats, title]);

  function updateGrade(index: number, grade: string) {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], grade };
      return next;
    });
  }

  function updateCredits(index: number, credits: string) {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], credits };
      return next;
    });
  }

  function clearAll() {
    setRows(makeInitialRows());
    setIncludeCumulative(false);
    setPriorGpa("");
    setPriorCredits("");
  }

  return (
    <section className="space-y-8 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <CalculatorCard title={`${title} inputs`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Enter up to 50 courses. A new row appears after each completed row.
            </p>
            <ShareCenter
              title={title}
              shortUrl={shortUrl}
              stateUrl={stateUrl}
              summaryText={summaryText}
              snapshotLines={[
                `GPA: ${stats.gpa.toFixed(2)}`,
                `Total credits: ${stats.totalCredits.toFixed(2)}`,
                `Courses: ${stats.courses}`
              ]}
            />
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-[72px_minmax(0,1fr)_140px] gap-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span>Course</span>
              <span>Grade</span>
              <span>Credits</span>
            </div>

            <div className="space-y-2">
              {rows.slice(0, visibleCount).map((row, index) => (
                <div key={index} className="grid grid-cols-[72px_minmax(0,1fr)_140px] items-center gap-3 rounded-lg border p-2.5">
                  <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>

                  <Select value={row.grade} onValueChange={(value) => updateGrade(index, value)}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {GPA_GRADES.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    min={0}
                    step={0.5}
                    placeholder="Credits"
                    value={row.credits}
                    onChange={(event) => updateCredits(index, event.target.value)}
                    className="h-10"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-lg border bg-muted/30 p-4">
              <label className="flex items-center justify-between gap-3 text-sm font-medium">
                <span>Calculate cumulative GPA</span>
                <Switch checked={includeCumulative} onCheckedChange={setIncludeCumulative} />
              </label>
              {includeCumulative ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Prior GPA
                    </label>
                    <Input
                      type="number"
                      min={0}
                      max={4.0}
                      step={0.01}
                      value={priorGpa}
                      onChange={(event) => setPriorGpa(event.target.value)}
                      placeholder="e.g. 3.40"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Prior credits
                    </label>
                    <Input
                      type="number"
                      min={0}
                      step={0.5}
                      value={priorCredits}
                      onChange={(event) => setPriorCredits(event.target.value)}
                      placeholder="e.g. 42"
                      className="h-10"
                    />
                  </div>
                </div>
              ) : null}
            </div>
            <Button type="button" variant="outline" onClick={clearAll}>
              Clear All
            </Button>
          </div>
        </CalculatorCard>

        <CalculatorCard title="Results">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">GPA</p>
              <p className="text-4xl font-bold tabular-nums">{stats.gpa.toFixed(2)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total credits</p>
                <p className="text-2xl font-semibold tabular-nums">{stats.totalCredits.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Courses</p>
                <p className="text-2xl font-semibold tabular-nums">{stats.courses}</p>
              </div>
            </div>
            {includeCumulative && !stats.hasPrior ? (
              <p className="text-sm text-muted-foreground">
                Enter prior GPA and credits to compute cumulative GPA.
              </p>
            ) : null}
          </div>
        </CalculatorCard>
      </div>
    </section>
  );
}
