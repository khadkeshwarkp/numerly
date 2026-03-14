export type SiteCategory = {
  id: string;
  label: string;
  icon: string;
  description: string;
  intro: string;
  educationalContent: string[];
  relatedCategoryIds: string[];
};

export const SITE_CATEGORIES: SiteCategory[] = [
  {
    id: "finance",
    label: "Finance",
    icon: "FI",
    description: "Loans, investing, budgeting, and long-term planning tools.",
    intro:
      "Finance calculators for borrowing, investing, and decision support with transparent assumptions.",
    educationalContent: [
      "Finance tools are most reliable when assumptions are explicit. Always verify rate units and compounding periods.",
      "Use scenario comparison to understand trade-offs between monthly affordability and total long-term cost.",
      "Pair calculators with sensitivity analysis by testing optimistic, neutral, and conservative assumptions."
    ],
    relatedCategoryIds: ["statistics", "everyday", "math"]
  },
  {
    id: "health",
    label: "Health",
    icon: "HE",
    description: "Body metrics, wellness, and evidence-based health estimators.",
    intro:
      "Health calculators designed for quick screening and educational understanding, not diagnosis.",
    educationalContent: [
      "Health calculators can guide awareness but should be interpreted with medical context.",
      "Use multiple indicators instead of relying on a single metric.",
      "For personal medical decisions, consult qualified professionals."
    ],
    relatedCategoryIds: ["everyday", "statistics", "science"]
  },
  {
    id: "math",
    label: "Math",
    icon: "MA",
    description: "Core algebra, geometry, and equation-solving utilities.",
    intro: "Math calculators built for accuracy, speed, and learning by showing formulas clearly.",
    educationalContent: [
      "Math tools should help with both answers and method clarity.",
      "Re-check dimensions and units when applying formulas to real-world values.",
      "Use worked examples to confirm input interpretation."
    ],
    relatedCategoryIds: ["science", "statistics", "conversion"]
  },
  {
    id: "education",
    label: "Education",
    icon: "ED",
    description: "Academic scoring, planning, and learning-related estimators.",
    intro:
      "Education calculators for grades, progress tracking, and structured study planning.",
    educationalContent: [
      "Educational calculators are strongest when your grading model is clearly defined.",
      "Use consistent scales and weighted averages for accurate interpretation.",
      "Track assumptions over time to compare progress across terms."
    ],
    relatedCategoryIds: ["math", "statistics", "everyday"]
  },
  {
    id: "science",
    label: "Science",
    icon: "SC",
    description: "Physics, chemistry, and scientific reference calculators.",
    intro:
      "Science calculators that prioritize unit correctness and transparent formula mapping.",
    educationalContent: [
      "Convert to SI units before interpreting scientific formulas.",
      "Review boundary conditions to avoid invalid outputs.",
      "Use charts to inspect behavior trends rather than single-point outputs."
    ],
    relatedCategoryIds: ["math", "conversion", "statistics"]
  },
  {
    id: "conversion",
    label: "Conversion",
    icon: "CV",
    description: "Fast and precise unit and measurement conversions.",
    intro:
      "Conversion tools for metric, imperial, and domain-specific unit translation.",
    educationalContent: [
      "Always verify source unit labels before conversion.",
      "Use standardized precision for reporting outputs.",
      "When chaining conversions, keep full precision until final display."
    ],
    relatedCategoryIds: ["science", "math", "everyday"]
  },
  {
    id: "statistics",
    label: "Statistics",
    icon: "ST",
    description: "Probability, distributions, and data analysis support.",
    intro:
      "Statistics calculators to help summarize, model, and interpret data-driven questions.",
    educationalContent: [
      "Statistical outputs are only as strong as input quality and sample assumptions.",
      "Check distribution assumptions before using advanced estimators.",
      "Compare central tendency and dispersion together for better interpretation."
    ],
    relatedCategoryIds: ["math", "science", "finance"]
  },
  {
    id: "everyday",
    label: "Everyday",
    icon: "EV",
    description: "Practical daily-use calculators for common life decisions.",
    intro:
      "Everyday calculators optimized for practical planning and quick decision support.",
    educationalContent: [
      "Use realistic constraints and ranges when planning daily scenarios.",
      "Compare alternatives to avoid over-relying on a single output.",
      "Re-run calculations when assumptions change to keep decisions current."
    ],
    relatedCategoryIds: ["finance", "health", "conversion"]
  }
];

const categoryMap = new Map(SITE_CATEGORIES.map((category) => [category.id, category]));

export function getSiteCategories(): SiteCategory[] {
  return SITE_CATEGORIES;
}

export function getSiteCategory(categoryId: string): SiteCategory | null {
  return categoryMap.get(categoryId) ?? null;
}
