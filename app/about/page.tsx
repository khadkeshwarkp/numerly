import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "About Numerly | Numerly",
  description: "Learn about Numerly and how we build fast, accurate calculator tools."
};

export default function AboutPage() {
  return (
    <PageContainer className="py-12 md:py-16">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">About Numerly</h1>
        <p className="max-w-3xl text-muted-foreground">
          Numerly is a focused calculator platform built for clarity, speed, and accuracy.
        </p>
      </header>

      <section className="mt-10 max-w-3xl space-y-6 text-muted-foreground">
        <p>
          Our tools are designed to be simple to use, reliable, and fast. We prioritize clean
          inputs, transparent formulas, and results you can trust.
        </p>
        <p>
          Numerly does not require accounts or logins to use calculators. We keep the experience
          lightweight so you can get answers quickly without distractions.
        </p>
      </section>
    </PageContainer>
  );
}
