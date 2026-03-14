"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

type SearchItem = {
  title: string;
  href: string;
  category: string;
};

type Props = {
  items: SearchItem[];
};

export function HomeSearch({ items }: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    return items
      .filter((item) => item.title.toLowerCase().includes(normalized))
      .slice(0, 8);
  }, [items, query]);

  return (
    <section className="w-full max-w-2xl" aria-label="Calculator search">
      <label htmlFor="home-search-input" className="sr-only">
        Search calculators
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="home-search-input"
          type="search"
          className="h-12 rounded-full pl-10"
          placeholder="Search calculators (loan, BMI, compound interest...)"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
        />
      </div>

      {results.length ? (
        <div className="mt-2 overflow-hidden rounded-xl border bg-card shadow-soft" role="listbox" aria-label="Search results">
          {results.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between border-b px-4 py-3 text-sm transition last:border-b-0 hover:bg-muted"
            >
              <strong>{item.title}</strong>
              <small className="text-muted-foreground">{item.category}</small>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
