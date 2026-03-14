import type { ReactNode } from "react";

type Props = {
  inputs: ReactNode;
  results: ReactNode;
};

export function CalculatorHero({ inputs, results }: Props) {
  return (
    <section className="py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>{inputs}</div>
        <div>{results}</div>
      </div>
    </section>
  );
}
