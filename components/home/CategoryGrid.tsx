import Link from "next/link";
import { CategoryIcon } from "@/components/home/CategoryIcon";
import type { CategorySummary } from "@/lib/calculators/catalog";

type CategoryPreview = {
  id: string;
  calculators: Array<{ id: string; title: string; href: string }>;
};

type Props = {
  categories: CategorySummary[];
  previews: CategoryPreview[];
};

export function CategoryGrid({ categories, previews }: Props) {
  const previewMap = new Map(previews.map((item) => [item.id, item.calculators]));

  return (
    <section className="space-y-6 py-12" aria-labelledby="categories-heading">
      <header className="space-y-2">
        <h2 id="categories-heading" className="text-2xl font-semibold tracking-tight">
          Categories
        </h2>
        <p className="text-muted-foreground">
          Explore focused calculators by domain. Each category includes tools with clear formulas.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const topCalculators = previewMap.get(category.id) ?? [];

          return (
            <article key={category.id} className="rounded-xl border bg-card p-5 shadow-soft">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{category.label}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} calculators</p>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-muted/60">
                  <CategoryIcon categoryId={category.id} />
                </span>
              </div>

              <p className="mb-4 text-sm text-muted-foreground">{category.description}</p>

              <div className="space-y-2">
                {topCalculators.map((calculator) => (
                  <Link
                    key={calculator.id}
                    href={calculator.href}
                    className="block rounded-md border border-transparent px-2 py-1 text-sm transition hover:border-border hover:bg-muted"
                  >
                    {calculator.title}
                  </Link>
                ))}
              </div>

              <Link
                href={category.href}
                className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
              >
                View all {category.label.toLowerCase()} calculators
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
