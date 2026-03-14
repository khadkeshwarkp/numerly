type TocItem = {
  id: string;
  label: string;
};

type Props = {
  items: TocItem[];
};

export function TableOfContents({ items }: Props) {
  return (
    <section className="rounded-xl border bg-muted/30 p-6" aria-labelledby="toc-heading">
      <h2 id="toc-heading" className="mb-4 text-xl font-semibold">
        Table of contents
      </h2>
      <nav aria-label="Table of contents">
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="text-sm text-muted-foreground hover:text-foreground hover:underline">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
