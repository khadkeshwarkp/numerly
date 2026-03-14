import type { Metadata } from "next";
import type { CalculatorRuntimeDefinition } from "@/types/calculator-engine";
import type { CalculatorContent } from "@/types/calculator";

export function buildMetadata(
  content: CalculatorContent,
  calculatorMeta?: CalculatorRuntimeDefinition | null
): Metadata {
  const path = `/${content.category}/${content.slug}`;
  const ogImage = `/og/${content.category}-${content.slug}.png`;
  const tagKeywords = calculatorMeta?.metadata.tags ?? [];

  return {
    title: {
      absolute: content.seo.title
    },
    description: content.seo.description,
    category: content.category,
    keywords: [content.keyword, content.category, ...tagKeywords],
    alternates: { canonical: path },
    openGraph: {
      title: content.seo.title,
      description: content.seo.description,
      type: "article",
      url: path,
      images: [
        {
          url: ogImage,
          alt: `${content.h1} preview`
        }
      ]
    },
    twitter: {
      card: "summary",
      title: content.seo.title,
      description: content.seo.description,
      images: [ogImage]
    },
    other: {
      "article:section": content.category,
      "calculator:tags": tagKeywords.join(",")
    }
  };
}
