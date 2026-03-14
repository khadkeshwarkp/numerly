import type { ReactNode } from "react";
import { CalculatorContent } from "@/components/calculator/CalculatorContent";
import { CalculatorFAQ } from "@/components/calculator/CalculatorFAQ";
import { RelatedCalculators } from "@/components/calculator/RelatedCalculators";
import { PageContainer } from "@/components/layout/PageContainer";
import type { InternalLinkGroups } from "@/lib/calculators/internal-links";
import { getCalculatorByRoute } from "@/lib/calculators/registry";
import type { CalculatorContent as CalculatorContentType } from "@/types/calculator";

type Props = {
  content: CalculatorContentType;
  calculatorTools?: ReactNode;
  calculatorSupplementary?: ReactNode;
  internalLinkGroups?: InternalLinkGroups;
};

export function CalculatorPageTemplate({
  content,
  calculatorTools,
  calculatorSupplementary,
  internalLinkGroups
}: Props) {
  const fallbackLinks = content.internalLinks.map((link) => ({
    id: link.href,
    title: link.label,
    href: link.href
  }));

  const relatedCalculators =
    internalLinkGroups?.related.length ? internalLinkGroups.related : fallbackLinks;

  const calculatorMeta = getCalculatorByRoute(content.category, content.slug);
  const fullUrl = `https://www.numerly.org/${content.category}/${content.slug}`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a
      }
    }))
  };

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: content.h1,
    url: fullUrl,
    applicationCategory: `${content.category} calculator`,
    operatingSystem: "Any",
    description: content.seo.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    keywords: [content.keyword, ...(calculatorMeta?.metadata.tags ?? [])].join(", ")
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.numerly.org/"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: content.category[0].toUpperCase() + content.category.slice(1),
        item: `https://www.numerly.org/${content.category}`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: content.h1,
        item: fullUrl
      }
    ]
  };

  return (
    <PageContainer
      as="main"
      className={`${content.id === "gpa-calculator" ? "max-w-5xl" : ""} py-12 md:py-16`}
    >
      <header className="space-y-3 pb-6">
        <h1 className="text-4xl font-bold tracking-tight">{content.h1}</h1>
        <p className="max-w-3xl text-muted-foreground">{content.intro}</p>
      </header>

      {calculatorTools}

      {calculatorSupplementary ? <section className="py-8">{calculatorSupplementary}</section> : null}

      <CalculatorContent content={content} />
      <CalculatorFAQ faqs={content.faqs} />
      <RelatedCalculators title="Related calculators" items={relatedCalculators} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </PageContainer>
  );
}
