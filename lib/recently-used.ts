export const RECENTLY_USED_STORAGE_KEY = "numerly-recent-calculators";
const MAX_RECENT_ITEMS = 5;

export type RecentCalculatorItem = {
  id: string;
  title: string;
  href: string;
  category: string;
  visitedAt: number;
};

function isRecentCalculatorItem(value: unknown): value is RecentCalculatorItem {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;

  return (
    typeof entry.id === "string" &&
    typeof entry.title === "string" &&
    typeof entry.href === "string" &&
    typeof entry.category === "string" &&
    typeof entry.visitedAt === "number"
  );
}

export function readRecentCalculators(): RecentCalculatorItem[] {
  try {
    const raw = window.localStorage.getItem(RECENTLY_USED_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isRecentCalculatorItem).slice(0, MAX_RECENT_ITEMS);
  } catch {
    return [];
  }
}

export function writeRecentCalculators(items: RecentCalculatorItem[]): void {
  try {
    window.localStorage.setItem(
      RECENTLY_USED_STORAGE_KEY,
      JSON.stringify(items.slice(0, MAX_RECENT_ITEMS))
    );
  } catch {
    // Ignore storage failures.
  }
}

export function trackRecentCalculator(
  entry: Omit<RecentCalculatorItem, "visitedAt">
): void {
  const existing = readRecentCalculators();
  const withoutCurrent = existing.filter((item) => item.id !== entry.id);

  const updated: RecentCalculatorItem[] = [
    {
      ...entry,
      visitedAt: Date.now()
    },
    ...withoutCurrent
  ].slice(0, MAX_RECENT_ITEMS);

  writeRecentCalculators(updated);
}
