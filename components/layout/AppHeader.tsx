import Link from "next/link";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Input } from "@/components/ui/input";
import { getAllCalculators, getCategorySummaries } from "@/lib/calculators/catalog";

const MAX_SEARCH_SUGGESTIONS = 16;

export function AppHeader() {
  const categories = getCategorySummaries();
  const suggestions = getAllCalculators().slice(0, MAX_SEARCH_SUGGESTIONS);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Numerly
          </Link>

          <form className="relative flex-1" action="/" role="search" aria-label="Search calculators">
            <label htmlFor="site-search" className="sr-only">
              Search calculator
            </label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="site-search"
              name="q"
              type="search"
              className="h-10 pl-9"
              placeholder="Search calculator..."
              list="calculator-suggestions"
              autoComplete="off"
            />
            <datalist id="calculator-suggestions">
              {suggestions.map((calculator) => (
                <option key={calculator.id} value={calculator.metadata.title} />
              ))}
            </datalist>
          </form>

          <ThemeToggle />
        </div>

        <nav className="-mx-1 flex gap-1 overflow-x-auto pb-1" aria-label="Categories">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {category.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
