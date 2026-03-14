import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FaqItem } from "@/types/calculator";

type Props = {
  faqs: FaqItem[];
};

export function CalculatorFAQ({ faqs }: Props) {
  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
      <Accordion type="single" collapsible className="rounded-lg border bg-card px-4">
        {faqs.map((faq, index) => (
          <AccordionItem key={faq.q} value={`faq-${index}`}>
            <AccordionTrigger>{faq.q}</AccordionTrigger>
            <AccordionContent>{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
