import type { MetadataRoute } from "next";
import { getCategorySummaries } from "@/lib/calculators/catalog";
import { getRegisteredCalculatorPaths } from "@/lib/calculators/registry";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.numerly.org";
  const paths = getRegisteredCalculatorPaths();
  const categories = getCategorySummaries();

  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about/`, changeFrequency: "yearly" as const, priority: 0.4 },
    { url: `${base}/contact/`, changeFrequency: "yearly" as const, priority: 0.4 },
    { url: `${base}/privacy/`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${base}/terms/`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${base}/disclaimer/`, changeFrequency: "yearly" as const, priority: 0.3 },
    ...categories.map((category) => ({
      url: `${base}/${category.id}/`,
      changeFrequency: "weekly" as const,
      priority: 0.9
    })),
    ...paths.map(({ category, slug }) => ({
      url: `${base}/${category}/${slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}
