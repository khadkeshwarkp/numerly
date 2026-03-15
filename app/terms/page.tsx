import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "Terms of Use | Numerly",
  description: "Review the terms of use for the Numerly calculator platform."
};

export default function TermsPage() {
  return (
    <PageContainer className="py-12 md:py-16">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Terms of Use</h1>
        <p className="max-w-3xl text-muted-foreground">
          By using Numerly, you agree to the terms below.
        </p>
      </header>

      <section className="mt-10 max-w-3xl space-y-6 text-muted-foreground">
        <p>
          Numerly provides calculators for informational purposes only. We do not guarantee
          results for any personal, academic, financial, or legal decision.
        </p>
        <p>
          You are responsible for verifying inputs and outputs before making any decision. Use
          of the platform is at your own risk.
        </p>
        <p>
          If you have questions about these terms, contact us at
          {" "}stellarfusiondynamics@gmail.com.
        </p>
      </section>
    </PageContainer>
  );
}
