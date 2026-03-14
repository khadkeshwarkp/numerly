# Numerly Platform Architecture

## 1) Layered Architecture

1. Calculator Engine Layer
- `lib/calculators/definitions/*`: typed calculator definitions (schema + formulas + metadata)
- `lib/calculators/*.ts`: pure formula functions and shared finance utilities
- `lib/calculators/validation.ts`: runtime input/output validation
- `lib/calculators/registry.ts`: centralized typed registry

2. UI Rendering Layer
- `components/calculators/DynamicCalculatorRenderer.tsx`: schema-driven form rendering + live calculation
- `components/calculators/CalculatorPageTemplate.tsx`: content + calculator authority layout
- `components/calculators/*Card.tsx`: card-level UI primitives

3. Content Layer
- `content/calculators/<category>/<slug>.json`: structured calculator content
- `lib/content.ts`: content loading and schema guard

4. SEO Layer
- `lib/seo.ts`: metadata builder
- `components/calculators/CalculatorPageTemplate.tsx`: FAQ/WebApplication/Breadcrumb JSON-LD
- `app/sitemap.ts`, `app/robots.ts`: crawl directives

5. Discovery Layer
- `app/page.tsx`: hero/search/categories/popular/trending/recent
- `app/[category]/page.tsx`: category landing pages
- `lib/calculators/catalog.ts`: homepage and category query helpers

6. Visualization Layer
- `components/charts/*`: SVG charts (line/bar/pie)
- `components/calculators/finance/FinanceVisualizationSection.tsx`
- `components/calculators/finance/LoanTableSection.tsx`

7. Sharing Layer
- `components/calculators/ShareCenter.tsx`: Link/Embed/Export/Copy Summary

8. Internal Linking Layer
- `lib/calculators/related.ts`: deterministic related scoring
- `lib/calculators/internal-links.ts`: bundle generation (related/category/advanced/beginner)

## 2) URL and Route System

- Homepage: `/`
- Category pages: `/finance`, `/health`, `/math`, `/education`, `/science`, `/conversion`, `/statistics`, `/everyday`
- Calculator pages: `/<category>/<slug>`
- All routes statically generated using `generateStaticParams` and Next export.

## 3) Folder Structure

```text
app/
  [category]/
    [slug]/page.tsx
    page.tsx
  page.tsx
  layout.tsx
  sitemap.ts
  robots.ts
components/
  calculators/
    finance/
    CalculatorPageTemplate.tsx
    DynamicCalculatorRenderer.tsx
    ShareCenter.tsx
  charts/
  home/
  layout/
content/
  calculators/
    finance/
    health/
    education/
lib/
  calculators/
    definitions/
    catalog.ts
    internal-links.ts
    related.ts
    registry.ts
    validation.ts
  content.ts
  seo.ts
  site-categories.ts
types/
  calculator-engine.ts
  calculator.ts
docs/
  NUMERLY_PLATFORM_ARCHITECTURE.md
```

## 4) Page Layout Diagrams

### Calculator page (desktop)

```text
[H1 + Intro]
---------------------------------------------------
| LEFT (content)            | RIGHT (sticky tools)|
| TOC                       | Inputs              |
| How to use                | Results             |
| Formula                   | Insights            |
| Example                   | Compare toggle      |
| Explanation               | Share button        |
| Edge cases                |                     |
| Tips                      |                     |
| FAQs                      |                     |
| Related topics            |                     |
---------------------------------------------------
| Full width: charts + data table + link bundles  |
---------------------------------------------------
```

### Calculator page (mobile)

```text
[H1 + Intro]
[Inputs]
[Results]
[Insights]
[Charts/Table]
[Long-form content]
[Internal links]
```

## 5) UI System

- Neutral palette, subtle borders, low-contrast shadows
- 8px spacing rhythm
- Tabular numbers for all result values and tables
- Accessibility: labels, aria roles, focus-visible styles, semantic headings
- Dark mode via `data-theme` with localStorage persistence

## 6) SEO Structure

- Metadata per calculator:
  - title
  - description
  - canonical
  - Open Graph/Twitter image placeholder
  - category/tags keywords
- JSON-LD per calculator page:
  - `WebApplication`
  - `FAQPage`
  - `BreadcrumbList`
- Sitemap and robots generated from registry + category taxonomy
