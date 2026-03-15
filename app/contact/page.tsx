import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "Contact | Numerly",
  description: "Contact Numerly for support, feedback, or business inquiries."
};

export default function ContactPage() {
  return (
    <PageContainer className="py-12 md:py-16">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
        <p className="max-w-3xl text-muted-foreground">
          We welcome feedback, bug reports, and partnership inquiries.
        </p>
      </header>

      <section className="mt-10 max-w-3xl space-y-4 text-muted-foreground">
        <p>Email us at:</p>
        <p className="text-foreground">stellarfusiondynamics@gmail.com</p>
      </section>
    </PageContainer>
  );
}
