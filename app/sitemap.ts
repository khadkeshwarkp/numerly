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
