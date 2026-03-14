import type { ReactNode } from "react";

type Props = {
  left: ReactNode;
  right: ReactNode;
};

export function CalculatorLayout({ left, right }: Props) {
  return (
    <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8">{left}</div>
      <aside className="lg:col-span-4">{right}</aside>
    </section>
  );
}
