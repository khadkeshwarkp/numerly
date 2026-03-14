import fs from "node:fs/promises";
import path from "node:path";
import type { CalculatorContent } from "@/types/calculator";

const CONTENT_DIR = path.join(process.cwd(), "content", "calculators");

function isCalculatorContent(value: unknown): value is CalculatorContent {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.category === "string" &&
    typeof item.slug === "string" &&
    typeof item.h1 === "string" &&
    typeof item.intro === "string" &&
    typeof item.explanation === "string" &&
    typeof item.seo === "object" &&
    item.seo !== null &&
    typeof (item.seo as Record<string, unknown>).title === "string" &&
    typeof (item.seo as Record<string, unknown>).description === "string" &&
    Array.isArray(item.faqs) &&
    Array.isArray(item.internalLinks)
  );
}

export async function getCalculatorContent(
  category: string,
  slug: string
): Promise<CalculatorContent | null> {
  const filePath = path.join(CONTENT_DIR, category, `${slug}.json`);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed: unknown = JSON.parse(raw);

    if (!isCalculatorContent(parsed)) {
      throw new Error(`Invalid calculator content schema: ${filePath}`);
    }

    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}
