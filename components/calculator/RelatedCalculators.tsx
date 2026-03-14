import Link from "next/link";

type RelatedItem = {
  id: string;
  title: string;
  href: string;
};

type Props = {
  title: string;
  items: RelatedItem[];
};

export function RelatedCalculators({ title, items }: Props) {
  if (!items.length) return null;

  return (
    <section className="space-y-4 py-12">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="rounded-xl border bg-card p-4 text-sm font-medium transition hover:border-primary/30 hover:bg-muted"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
