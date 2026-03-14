import type { BarChartDatum } from "@/types/calculator-engine";

type Props = {
  bars: BarChartDatum[];
};

export function SvgBarChart({ bars }: Props) {
  if (!bars.length) return null;

  const width = 760;
  const height = 280;
  const padding = 28;
  const barWidth = (width - padding * 2) / bars.length;
  const maxValue = Math.max(...bars.map((bar) => bar.value), 1);

  return (
    <svg
      className="chart-svg bar-chart-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Bar chart"
      preserveAspectRatio="xMidYMid meet"
    >
      {bars.map((bar, index) => {
        const barHeight = ((height - padding * 2) * bar.value) / maxValue;
        const x = padding + index * barWidth + 14;
        const y = height - padding - barHeight;
        const colWidth = Math.max(28, barWidth - 28);
        const colMid = x + colWidth / 2;

        return (
          <g key={bar.label}>
            <rect x={x} y={y} width={colWidth} height={barHeight} fill="currentColor" opacity="0.72" />
            <text x={colMid} y={height - 6} textAnchor="middle" className="chart-label">
              {bar.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
