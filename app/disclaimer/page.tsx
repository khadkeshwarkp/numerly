import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "Disclaimer | Numerly",
  description: "Important disclaimers about calculator results and usage."
};

export default function DisclaimerPage() {
  return (
    <PageContainer className="py-12 md:py-16">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Disclaimer</h1>
        <p className="max-w-3xl text-muted-foreground">
          Numerly calculators are provided as general tools and should not be treated as
          professional advice.
        </p>
      </header>

      <section className="mt-10 max-w-3xl space-y-6 text-muted-foreground">
        <p>
          Results are estimates based on the inputs provided. We make reasonable efforts to
          ensure accuracy, but we do not guarantee correctness or fitness for any specific
          purpose.
        </p>
        <p>
          You should consult qualified professionals for decisions related to finance, health,
          education, or legal matters.
        </p>
        <p>
          Questions about this disclaimer can be sent to
          {" "}stellarfusiondynamics@gmail.com.
        </p>
      </section>
    </PageContainer>
  );
}
