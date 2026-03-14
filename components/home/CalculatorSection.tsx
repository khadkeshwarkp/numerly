import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Item = {
  id: string;
  title: string;
  href: string;
  category: string;
  description?: string;
};

type Props = {
  id: string;
  title: string;
  items: Item[];
  description?: string;
};

function toCategoryLabel(category: string): string {
  return category[0].toUpperCase() + category.slice(1);
}

export function CalculatorSection({ id, title, items, description }: Props) {
  return (
    <section className="space-y-6 py-12" aria-labelledby={id}>
      <header className="space-y-2">
        <h2 id={id} className="text-2xl font-semibold tracking-tight">
          {title}
        </h2>
        {description ? <p className="text-muted-foreground">{description}</p> : null}
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link key={item.id} href={item.href} className="group">
            <Card className="h-full border-border/80 transition hover:border-primary/30 hover:bg-muted/30">
              <CardContent className="space-y-3 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {toCategoryLabel(item.category)}
                </p>
                <h3 className="text-base font-semibold">{item.title}</h3>
                {item.description ? (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                ) : null}
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
