import type { CalculatorContent as CalculatorContentType } from "@/types/calculator";

type Props = {
  content: CalculatorContentType;
};

export function CalculatorContent({ content }: Props) {
  return (
    <section className="space-y-12 py-12">
      <article className="max-w-prose space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Explanation</h2>
        <p className="leading-relaxed text-muted-foreground">{content.explanation}</p>
      </article>

      <article className="max-w-prose space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Formula</h2>
        <p className="font-medium text-foreground">{content.formula.expression}</p>
        {content.formulaExplanation ? (
          <p className="leading-relaxed text-muted-foreground">{content.formulaExplanation}</p>
        ) : null}
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          {content.formula.variables.map((variable) => (
            <li key={variable.name}>
              <span className="font-semibold text-foreground">{variable.name}:</span> {variable.meaning}
            </li>
          ))}
        </ul>
      </article>

      <article className="max-w-prose space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Example</h2>
        <p className="leading-relaxed text-muted-foreground">{content.example.input}</p>
        <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
          {content.example.steps.map((step, index) => (
            <li key={`${step}-${index}`}>{step}</li>
          ))}
        </ol>
        <p className="leading-relaxed text-muted-foreground">{content.example.result}</p>
      </article>
    </section>
  );
}
