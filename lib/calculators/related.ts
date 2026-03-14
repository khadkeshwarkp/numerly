import { calculatorRegistry } from "@/lib/calculators/registry";
import type { CalculatorRuntimeDefinition } from "@/types/calculator-engine";

const MIN_RELATED_COUNT = 3;
const MAX_RELATED_COUNT = 5;

const SCORE_SAME_CATEGORY = 1000;
const SCORE_SHARED_TAG = 100;
const SCORE_FINANCE_BOOST = 50;

export type RelatedCalculator = {
  id: string;
  category: string;
  slug: string;
  title: string;
  href: string;
  score: number;
};

type CandidateScore = {
  calculator: CalculatorRuntimeDefinition;
  score: number;
  sameCategory: boolean;
  sharedTagCount: number;
  financeBoost: number;
};

function toRuntime(calculator: (typeof calculatorRegistry)[number]): CalculatorRuntimeDefinition {
  return calculator as unknown as CalculatorRuntimeDefinition;
}

function clampCount(value: number): number {
  return Math.min(MAX_RELATED_COUNT, Math.max(MIN_RELATED_COUNT, value));
}

export function getRelatedCalculators(
  sourceId: string,
  options?: { count?: number }
): RelatedCalculator[] {
  const count = clampCount(options?.count ?? MAX_RELATED_COUNT);
  const runtimeRegistry = calculatorRegistry.map(toRuntime);

  const source = runtimeRegistry.find((item) => item.id === sourceId);
  if (!source) return [];

  const sourceTags = new Set(source.metadata.tags.map((tag) => tag.toLowerCase()));

  const scored: CandidateScore[] = runtimeRegistry
    .filter((candidate) => candidate.id !== source.id)
    .map((candidate) => {
      const sameCategory = candidate.category === source.category;

      let sharedTagCount = 0;
      for (const tag of candidate.metadata.tags) {
        if (sourceTags.has(tag.toLowerCase())) {
          sharedTagCount += 1;
        }
      }

      const financeBoost = candidate.category === "finance" ? 1 : 0;
      const monetizationWeight = candidate.metadata.monetizationWeight ?? 0;

      const score =
        (sameCategory ? SCORE_SAME_CATEGORY : 0) +
        sharedTagCount * SCORE_SHARED_TAG +
        financeBoost * SCORE_FINANCE_BOOST +
        monetizationWeight;

      return {
        calculator: candidate,
        score,
        sameCategory,
        sharedTagCount,
        financeBoost
      };
    });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (Number(b.sameCategory) !== Number(a.sameCategory)) {
      return Number(b.sameCategory) - Number(a.sameCategory);
    }
    if (b.sharedTagCount !== a.sharedTagCount) {
      return b.sharedTagCount - a.sharedTagCount;
    }
    if (b.financeBoost !== a.financeBoost) {
      return b.financeBoost - a.financeBoost;
    }
    return a.calculator.id.localeCompare(b.calculator.id);
  });

  return scored.slice(0, count).map(({ calculator, score }) => ({
    id: calculator.id,
    category: calculator.category,
    slug: calculator.slug,
    title: calculator.metadata.title,
    href: `/${calculator.category}/${calculator.slug}`,
    score
  }));
}
