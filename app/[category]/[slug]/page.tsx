import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CalculatorPageTemplate } from "@/components/calculators/CalculatorPageTemplate";
import { CalculatorSupplementaryPane } from "@/components/calculators/workspace/CalculatorSupplementaryPane";
import { CalculatorToolsPane } from "@/components/calculators/workspace/CalculatorToolsPane";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getInternalLinkGroups } from "@/lib/calculators/internal-links";
import {
  getCalculatorByRoute,
  getRegisteredCalculatorPaths
} from "@/lib/calculators/registry";
import { getCalculatorContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

type Params = { category: string; slug: string };

type PageProps = {
  params: Promise<Params>;
};

export const dynamicParams = false;

function CalculatorToolsFallback() {
  return (
    <section className="py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-12 animate-pulse rounded bg-muted" />
            <div className="h-12 animate-pulse rounded bg-muted" />
            <div className="h-12 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-16 animate-pulse rounded bg-muted" />
            <div className="h-16 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function SupplementaryFallback() {
  return (
    <section className="py-8">
      <Card>
        <CardContent className="p-6">
          <div className="h-72 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    </section>
  );
}

export async function generateStaticParams(): Promise<Params[]> {
  return getRegisteredCalculatorPaths();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const content = await getCalculatorContent(resolved.category, resolved.slug);
  const calculator = getCalculatorByRoute(resolved.category, resolved.slug);
  if (!content) return {};
  return buildMetadata(content, calculator);
}

export default async function CalculatorPage({ params }: PageProps) {
  const resolved = await params;
  const content = await getCalculatorContent(resolved.category, resolved.slug);
  const calculator = getCalculatorByRoute(resolved.category, resolved.slug);
  if (!content || !calculator) notFound();
  const internalLinkGroups = getInternalLinkGroups(calculator.id);
  const showSupplementary = calculator.category === "finance";

  return (
    <CalculatorPageTemplate
      content={content}
      calculatorTools={(
        <Suspense fallback={<CalculatorToolsFallback />}>
          <CalculatorToolsPane calculatorId={calculator.id} />
        </Suspense>
      )}
      calculatorSupplementary={
        showSupplementary ? (
          <Suspense fallback={<SupplementaryFallback />}>
            <CalculatorSupplementaryPane calculatorId={calculator.id} />
          </Suspense>
        ) : null
      }
      internalLinkGroups={internalLinkGroups}
    />
  );
}
