import type { SVGProps } from "react";

type Props = {
  categoryId: string;
};

function SvgBase({ children, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

function FinanceIcon() {
  return (
    <SvgBase>
      <path d="M12 3v18" />
      <path d="M16 7.5a3.5 3.5 0 0 0-3.5-2h-1A3.5 3.5 0 0 0 8 9a3 3 0 0 0 3 3h2a3 3 0 0 1 3 3 3.5 3.5 0 0 1-3.5 3h-1A3.5 3.5 0 0 1 8 15.5" />
    </SvgBase>
  );
}

function HealthIcon() {
  return (
    <SvgBase>
      <path d="M12 20s-6.7-4.2-9-8.4C1.3 8.1 3.2 5 6.3 5c2 0 3.2 1.1 4 2.4C11.1 6.1 12.3 5 14.3 5 17.4 5 19.3 8.1 21 11.6 18.7 15.8 12 20 12 20Z" />
    </SvgBase>
  );
}

function MathIcon() {
  return (
    <SvgBase>
      <path d="M6 8h12" />
      <path d="M6 16h12" />
      <path d="M12 4v8" />
      <path d="M6.5 12h3" />
      <path d="M14.5 12h3" />
    </SvgBase>
  );
}

function EducationIcon() {
  return (
    <SvgBase>
      <path d="m3 9 9-5 9 5-9 5-9-5Z" />
      <path d="M7 11.5V16c0 1.6 2.2 3 5 3s5-1.4 5-3v-4.5" />
    </SvgBase>
  );
}

function ScienceIcon() {
  return (
    <SvgBase>
      <path d="M9 3h6" />
      <path d="M10 3v5l-4.6 8a3 3 0 0 0 2.6 4h8a3 3 0 0 0 2.6-4L14 8V3" />
      <path d="M8.2 14h7.6" />
    </SvgBase>
  );
}

function ConversionIcon() {
  return (
    <SvgBase>
      <path d="M4 8h12" />
      <path d="m13 5 3 3-3 3" />
      <path d="M20 16H8" />
      <path d="m11 13-3 3 3 3" />
    </SvgBase>
  );
}

function StatisticsIcon() {
  return (
    <SvgBase>
      <path d="M4 20h16" />
      <path d="M7 17v-5" />
      <path d="M12 17V7" />
      <path d="M17 17v-8" />
    </SvgBase>
  );
}

function EverydayIcon() {
  return (
    <SvgBase>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.7v2.2" />
      <path d="M12 19.1v2.2" />
      <path d="m4.7 4.7 1.5 1.5" />
      <path d="m17.8 17.8 1.5 1.5" />
      <path d="M2.7 12h2.2" />
      <path d="M19.1 12h2.2" />
      <path d="m4.7 19.3 1.5-1.5" />
      <path d="m17.8 6.2 1.5-1.5" />
    </SvgBase>
  );
}

function FallbackIcon() {
  return (
    <SvgBase>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 9.2v6" />
      <path d="M12 7h.01" />
    </SvgBase>
  );
}

export function CategoryIcon({ categoryId }: Props) {
  if (categoryId === "finance") return <FinanceIcon />;
  if (categoryId === "health") return <HealthIcon />;
  if (categoryId === "math") return <MathIcon />;
  if (categoryId === "education") return <EducationIcon />;
  if (categoryId === "science") return <ScienceIcon />;
  if (categoryId === "conversion") return <ConversionIcon />;
  if (categoryId === "statistics") return <StatisticsIcon />;
  if (categoryId === "everyday") return <EverydayIcon />;
  return <FallbackIcon />;
}
