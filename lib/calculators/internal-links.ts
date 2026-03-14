import { calculatorRegistry } from "@/lib/calculators/registry";
import { getRelatedCalculators } from "@/lib/calculators/related";
import type { CalculatorRuntimeDefinition } from "@/types/calculator-engine";

type DifficultyLevel = "beginner" | "intermediate" | "advanced";

type InternalLinkItem = {
  id: string;
  title: string;
  href: string;
};

export type InternalLinkGroups = {
  related: InternalLinkItem[];
  category: InternalLinkItem[];
  advanced: InternalLinkItem[];
  beginner: InternalLinkItem[];
};

function toRuntime(calculator: (typeof calculatorRegistry)[number]): CalculatorRuntimeDefinition {
  return calculator as unknown as CalculatorRuntimeDefinition;
}

function toLinkItem(calculator: CalculatorRuntimeDefinition): InternalLinkItem {
  return {
    id: calculator.id,
    title: calculator.metadata.title,
    href: `/${calculator.category}/${calculator.slug}`
  };
}

function sortByRank(a: CalculatorRuntimeDefinition, b: CalculatorRuntimeDefinition): number {
  const weightA = a.metadata.monetizationWeight ?? 0;
  const weightB = b.metadata.monetizationWeight ?? 0;
  if (weightB !== weightA) return weightB - weightA;
  return a.metadata.title.localeCompare(b.metadata.title);
}

function getDifficultyScore(level: DifficultyLevel | undefined): number {
  if (level === "advanced") return 3;
  if (level === "intermediate") return 2;
  return 1;
}

function sortByDifficultyDesc(
  a: CalculatorRuntimeDefinition,
  b: CalculatorRuntimeDefinition
): number {
  const diff = getDifficultyScore(b.metadata.difficulty) - getDifficultyScore(a.metadata.difficulty);
  if (diff !== 0) return diff;
  return sortByRank(a, b);
}

function sortByDifficultyAsc(
  a: CalculatorRuntimeDefinition,
  b: CalculatorRuntimeDefinition
): number {
  const diff = getDifficultyScore(a.metadata.difficulty) - getDifficultyScore(b.metadata.difficulty);
  if (diff !== 0) return diff;
  return sortByRank(a, b);
}

function uniqueById(items: InternalLinkItem[]): InternalLinkItem[] {
  const seen = new Set<string>();
  const result: InternalLinkItem[] = [];

  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    result.push(item);
  }

  return result;
}

function selectLinks(
  primary: CalculatorRuntimeDefinition[],
  fallback: CalculatorRuntimeDefinition[],
  limit: number
): InternalLinkItem[] {
  const merged = [...primary, ...fallback]
    .map(toLinkItem);
  return uniqueById(merged).slice(0, limit);
}

export function getInternalLinkGroups(sourceId: string): InternalLinkGroups {
  const runtimeRegistry = calculatorRegistry.map(toRuntime);
  const source = runtimeRegistry.find((calculator) => calculator.id === sourceId);

  if (!source) {
    return { related: [], category: [], advanced: [], beginner: [] };
  }

  const others = runtimeRegistry.filter((calculator) => calculator.id !== source.id);

  const related = getRelatedCalculators(sourceId, { count: 5 }).map((item) => ({
    id: item.id,
    title: item.title,
    href: item.href
  }));

  const sameCategory = others
    .filter((calculator) => calculator.category === source.category)
    .sort(sortByRank);

  const financeFallback = others
    .filter((calculator) => calculator.category === "finance")
    .sort(sortByRank);

  const globalRanked = [...others].sort(sortByRank);

  const category = selectLinks(sameCategory, financeFallback, 5);

  const advancedPrimary = others
    .filter((calculator) => calculator.metadata.difficulty === "advanced")
    .sort(sortByDifficultyDesc);

  const advancedFallback = others
    .filter((calculator) => calculator.metadata.difficulty === "intermediate")
    .sort(sortByDifficultyDesc);

  const advanced = selectLinks(advancedPrimary, [...advancedFallback, ...globalRanked], 5);

  const beginnerPrimary = others
    .filter((calculator) => calculator.metadata.difficulty === "beginner")
    .sort(sortByDifficultyAsc);

  const beginner = selectLinks(beginnerPrimary, globalRanked, 5);

  return {
    related,
    category,
    advanced,
    beginner
  };
}
