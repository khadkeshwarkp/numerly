import Link from "next/link";
import { Sparkles } from "lucide-react";
import { CalculatorSection } from "@/components/home/CalculatorSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HomeSearch } from "@/components/home/HomeSearch";
import { RecentlyUsedList } from "@/components/home/RecentlyUsedList";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/badge";
import {
  buildCalculatorHref,
  getAllCalculators,
  getCategoryCalculators,
  getCategorySummaries,
  getFeaturedHighRpm,
  getPopularCalculators,
  getTrendingCalculators
} from "@/lib/calculators/catalog";

function toCardItems(items: ReturnType<typeof getAllCalculators>) {
  return items.map((item) => ({
    id: item.id,
    title: item.metadata.title,
    category: item.category,
    href: buildCalculatorHref(item),
    description: item.metadata.tags.slice(0, 3).join(" • ")
  }));
}

const EXAMPLE_SEARCHES = [
  { label: "Loan calculator", href: "/finance/loan-calculator" },
  { label: "Mortgage calculator", href: "/finance/mortgage-calculator" },
  { label: "BMI calculator", href: "/health/bmi-calculator" },
  { label: "Compound interest", href: "/finance/compound-interest-calculator" }
];

export default function HomePage() {
  const all = getAllCalculators();
  const calculatorCount = all.length;
  const categories = getCategorySummaries();
  const popular = toCardItems(getPopularCalculators(6));
  const featured = toCardItems(getFeaturedHighRpm(6));
  const trending = toCardItems(getTrendingCalculators(6));

  const previews = categories.map((category) => ({
    id: category.id,
    calculators: getCategoryCalculators(category.id)
      .slice(0, 3)
      .map((calculator) => ({
        id: calculator.id,
        title: calculator.metadata.title,
        href: buildCalculatorHref(calculator)
      }))
  }));

  return (
    <PageContainer className="py-12 md:py-16">
      <section className="space-y-8 py-12">
        <Badge variant="secondary" className="inline-flex items-center gap-2 rounded-full px-3 py-1">
          <Sparkles className="h-3.5 w-3.5" />
          Precision-first calculator platform
        </Badge>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Discover {calculatorCount} interactive calculators
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Numerly is built for fast calculations, transparent formulas, and practical decisions.
          </p>
        </div>

        <HomeSearch
          items={toCardItems(all).map((item) => ({
            title: item.title,
            href: item.href,
            category: item.category
          }))}
        />

        <div className="flex flex-wrap gap-2">
          {EXAMPLE_SEARCHES.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <CategoryGrid categories={categories} previews={previews} />

      <CalculatorSection
        id="popular-heading"
        title="Popular calculators"
        description="Most-used tools for common financial, health, and planning tasks."
        items={popular}
      />

      <RecentlyUsedList />

      <CalculatorSection
        id="trending-heading"
        title="Trending calculators"
        description="Calculators with high recent usage and scenario comparisons."
        items={trending}
      />

      <CalculatorSection
        id="featured-rpm-heading"
        title="Featured finance tools"
        description="High-impact calculators for borrowing, growth, and retirement planning."
        items={featured}
      />
    </PageContainer>
  );
}
