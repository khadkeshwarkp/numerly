"use client";

import Link from "next/link";
import { Clock3 } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { readRecentCalculators, type RecentCalculatorItem } from "@/lib/recently-used";

export function RecentlyUsedList() {
  const [items, setItems] = useState<RecentCalculatorItem[]>([]);

  useEffect(() => {
    setItems(readRecentCalculators());
  }, []);

  if (!items.length) return null;

  return (
    <section className="space-y-6 py-12" aria-labelledby="recently-used-heading">
      <header className="space-y-2">
        <h2 id="recently-used-heading" className="text-2xl font-semibold tracking-tight">
          Recently Used
        </h2>
        <p className="text-muted-foreground">Resume your previous calculations.</p>
      </header>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link key={item.id} href={item.href}>
            <Card className="h-full transition hover:border-primary/30 hover:bg-muted/20">
              <CardContent className="space-y-2 p-5">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5" />
                  {item.category}
                </div>
                <h3 className="text-base font-semibold">{item.title}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
