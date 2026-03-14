import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import {
  buildCalculatorHref,
  getCategoryDiscoveryData,
  getCategorySummaries,
  getCategoryTitle
} from "@/lib/calculators/catalog";

type Params = { category: string };

type PageProps = {
  params: Promise<Params>;
};

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  return getCategorySummaries().map((item) => ({ category: item.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const data = getCategoryDiscoveryData(category);
  if (!data) return {};

  return {
    title: {
      absolute: `${data.label} Calculators | Numerly`
    },
    description: `Explore ${data.label.toLowerCase()} calculators with formulas, examples, and practical guidance.`,
    alternates: { canonical: `/${category}` },
    category,
    keywords: [category, `${category} calculators`, "numerly"]
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const data = getCategoryDiscoveryData(category);
  if (!data) notFound();

  return (
    <PageContainer className="py-12 md:py-16">
      <header className="space-y-3 py-6">
        <h1 className="text-4xl font-bold tracking-tight">{data.label} calculators</h1>
        <p className="max-w-3xl text-muted-foreground">{data.intro}</p>
      </header>

      <section className="space-y-6 py-8" aria-labelledby="category-calculators-heading">
        <h2 id="category-calculators-heading" className="text-2xl font-semibold tracking-tight">
          Calculator directory
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.calculators.length ? (
            data.calculators.map((calculator) => (
              <Link key={calculator.id} href={buildCalculatorHref(calculator)}>
                <Card className="h-full transition hover:border-primary/30 hover:bg-muted/30">
                  <CardContent className="space-y-2 p-5">
                    <h3 className="text-base font-semibold">{calculator.metadata.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {calculator.metadata.tags.slice(0, 3).join(" • ")}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <Card>
              <CardContent className="p-5 text-sm text-muted-foreground">
                More calculators coming soon. Explore <Link href="/finance">Finance</Link> and{" "}
                <Link href="/math">Math</Link>.
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="space-y-6 py-8" aria-labelledby="related-categories-heading">
        <h2 id="related-categories-heading" className="text-2xl font-semibold tracking-tight">
          Related categories
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.relatedCategories.map((item) => (
            <Link key={item.id} href={item.href} className="rounded-lg border bg-card p-4 text-sm hover:bg-muted">
              <h3 className="font-medium">{item.label}</h3>
              <p className="mt-1 text-muted-foreground">Explore {getCategoryTitle(item.id)} calculators</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4 py-8" aria-labelledby="category-guide-heading">
        <h2 id="category-guide-heading" className="text-2xl font-semibold tracking-tight">
          Category guide
        </h2>
        <div className="max-w-prose space-y-3">
          {data.educationalContent.map((paragraph, index) => (
            <p key={`${index}-${paragraph}`} className="text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
