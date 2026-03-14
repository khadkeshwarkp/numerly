import { calculatorRegistry } from "@/lib/calculators/registry";
import { getSiteCategories, getSiteCategory } from "@/lib/site-categories";
import type { CalculatorRuntimeDefinition } from "@/types/calculator-engine";

function toRuntime(
  calculator: (typeof calculatorRegistry)[number]
): CalculatorRuntimeDefinition {
  return calculator as unknown as CalculatorRuntimeDefinition;
}

export function getAllCalculators(): CalculatorRuntimeDefinition[] {
  return calculatorRegistry.map(toRuntime);
}

export type CategorySummary = {
  id: string;
  label: string;
  href: string;
  icon: string;
  count: number;
  description: string;
};

function toTitle(value: string): string {
  return value
    .split("-")
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(" ");
}

export function getCategorySummaries(): CategorySummary[] {
  const totals = new Map<string, number>();

  for (const calculator of getAllCalculators()) {
    totals.set(calculator.category, (totals.get(calculator.category) ?? 0) + 1);
  }

  return getSiteCategories().map((category) => ({
    id: category.id,
    label: category.label,
    href: `/${category.id}`,
    icon: category.icon,
    description: category.description,
    count: totals.get(category.id) ?? 0
  }));
}

export function getPopularCalculators(limit = 6): CalculatorRuntimeDefinition[] {
  return [...getAllCalculators()]
    .sort((a, b) => {
      const weightA = a.metadata.monetizationWeight ?? 0;
      const weightB = b.metadata.monetizationWeight ?? 0;
      return weightB - weightA || a.metadata.title.localeCompare(b.metadata.title);
    })
    .slice(0, limit);
}

export function getTrendingCalculators(limit = 6): CalculatorRuntimeDefinition[] {
  return [...getAllCalculators()]
    .sort((a, b) => {
      const scoreA = (a.metadata.tags.length * 4) + (a.metadata.monetizationWeight ?? 0);
      const scoreB = (b.metadata.tags.length * 4) + (b.metadata.monetizationWeight ?? 0);
      return scoreB - scoreA || a.metadata.title.localeCompare(b.metadata.title);
    })
    .slice(0, limit);
}

export function getFeaturedHighRpm(limit = 6): CalculatorRuntimeDefinition[] {
  return [...getAllCalculators()]
    .filter((calculator) => calculator.category === "finance")
    .sort((a, b) => {
      const weightA = a.metadata.monetizationWeight ?? 0;
      const weightB = b.metadata.monetizationWeight ?? 0;
      return weightB - weightA || a.metadata.title.localeCompare(b.metadata.title);
    })
    .slice(0, limit);
}

export function getCategoryCalculators(category: string): CalculatorRuntimeDefinition[] {
  return getAllCalculators()
    .filter((calculator) => calculator.category === category)
    .sort((a, b) => a.metadata.title.localeCompare(b.metadata.title));
}

export type CategoryDiscoveryData = {
  id: string;
  label: string;
  intro: string;
  educationalContent: string[];
  calculators: CalculatorRuntimeDefinition[];
  relatedCategories: Array<{ id: string; label: string; href: string }>;
};

export function getCategoryDiscoveryData(categoryId: string): CategoryDiscoveryData | null {
  const category = getSiteCategory(categoryId);
  if (!category) return null;

  const relatedCategories = category.relatedCategoryIds
    .map((id) => {
      const related = getSiteCategory(id);
      if (!related) return null;
      return { id: related.id, label: related.label, href: `/${related.id}` };
    })
    .filter((item): item is { id: string; label: string; href: string } => Boolean(item));

  return {
    id: category.id,
    label: category.label,
    intro: category.intro,
    educationalContent: category.educationalContent,
    calculators: getCategoryCalculators(category.id),
    relatedCategories
  };
}

export function getDeepLinkGroups(): Array<{
  title: string;
  links: Array<{ label: string; href: string }>;
}> {
  const categories = getCategorySummaries();
  const popular = getPopularCalculators(6);

  return [
    {
      title: "Categories",
      links: categories.map((category) => ({ label: category.label, href: category.href }))
    },
    {
      title: "Popular",
      links: popular.map((calculator) => ({
        label: calculator.metadata.title,
        href: `/${calculator.category}/${calculator.slug}`
      }))
    },
    {
      title: "Guides",
      links: [
        { label: "Calculator methodology", href: "/everyday" },
        { label: "Finance tools", href: "/finance" },
        { label: "Statistics tools", href: "/statistics" }
      ]
    }
  ];
}

export function buildCalculatorHref(calculator: CalculatorRuntimeDefinition): string {
  return `/${calculator.category}/${calculator.slug}`;
}

export function getCategoryTitle(categoryId: string): string {
  const category = getSiteCategory(categoryId);
  return category?.label ?? toTitle(categoryId);
}
