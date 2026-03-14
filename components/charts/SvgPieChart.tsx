import type { PieChartDatum } from "@/types/calculator-engine";

type Props = {
  slices: PieChartDatum[];
};

const COLORS = ["#6b7280", "#374151", "#9ca3af", "#4b5563", "#d1d5db"];

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const radians = (angle - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(radians),
    y: cy + r * Math.sin(radians)
  };
}

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z"
  ].join(" ");
}

export function SvgPieChart({ slices }: Props) {
  if (!slices.length) return null;

  const total = slices.reduce((sum, slice) => sum + Math.max(0, slice.value), 0);
  if (total <= 0) return null;

  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 104;
  let startAngle = 0;

  return (
    <div className="pie-layout">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="chart-svg pie-chart-svg"
        role="img"
        aria-label="Pie chart"
        preserveAspectRatio="xMidYMid meet"
      >
        {slices.map((slice, index) => {
          const value = Math.max(0, slice.value);
          const sweep = (value / total) * 360;
          const endAngle = startAngle + sweep;
          const path = describeArc(cx, cy, radius, startAngle, endAngle);
          const color = COLORS[index % COLORS.length];
          startAngle = endAngle;

          return <path key={slice.label} d={path} fill={color} stroke="#ffffff" strokeWidth="1" />;
        })}
      </svg>

      <div className="pie-legend">
        {slices.map((slice, index) => {
          const pct = (slice.value / total) * 100;
          return (
            <div className="pie-legend-item" key={slice.label}>
              <span
                className="pie-swatch"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                aria-hidden="true"
              />
              <span>{slice.label}</span>
              <span className="pie-legend-value">{pct.toFixed(2)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
