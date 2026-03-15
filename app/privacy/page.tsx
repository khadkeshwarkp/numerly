import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "Privacy Policy | Numerly",
  description: "Read Numerly's privacy policy and learn how data is handled."
};

export default function PrivacyPage() {
  return (
    <PageContainer className="py-12 md:py-16">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="max-w-3xl text-muted-foreground">
          This policy explains how Numerly handles data when you use our calculators.
        </p>
      </header>

      <section className="mt-10 max-w-3xl space-y-6 text-muted-foreground">
        <p>
          Numerly does not require account creation. Calculator inputs are processed in your
          browser, and no sensitive data is required to use the tools.
        </p>
        <p>
          We may collect basic, aggregated usage information to improve performance and
          reliability. We do not sell personal data.
        </p>
        <p>
          If you have questions about this policy, contact us at
          {" "}stellarfusiondynamics@gmail.com.
        </p>
      </section>
    </PageContainer>
  );
}
