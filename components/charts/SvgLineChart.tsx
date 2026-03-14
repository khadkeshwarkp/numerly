import type { ChartPoint } from "@/types/calculator-engine";

type Props = {
  points: ChartPoint[];
  height?: number;
};

export function SvgLineChart({ points, height = 200 }: Props) {
  if (points.length < 2) return null;

  const width = 760;
  const padding = 28;

  const xMin = Math.min(...points.map((point) => point.x));
  const xMax = Math.max(...points.map((point) => point.x));
  const yMin = Math.min(...points.map((point) => point.y));
  const yMax = Math.max(...points.map((point) => point.y));

  const xRange = xMax - xMin || 1;
  const yRange = yMax - yMin || 1;

  const path = points
    .map((point, index) => {
      const x = padding + ((point.x - xMin) / xRange) * (width - padding * 2);
      const y = height - padding - ((point.y - yMin) / yRange) * (height - padding * 2);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg
      className="chart-svg line-chart-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Line chart"
      preserveAspectRatio="xMidYMid meet"
    >
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
