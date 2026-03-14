export type FaqItem = {
  q: string;
  a: string;
};

export type InternalLink = {
  href: string;
  label: string;
};

export type FormulaVariable = {
  name: string;
  meaning: string;
};

export type CalculatorContent = {
  id: string;
  category: string;
  slug: string;
  keyword: string;
  seo: {
    title: string;
    description: string;
  };
  h1: string;
  intro: string;
  instructions?: string[];
  explanation: string;
  formulaExplanation?: string;
  formula: {
    expression: string;
    variables: FormulaVariable[];
  };
  example: {
    input: string;
    steps: string[];
    result: string;
  };
  edgeCases?: string[];
  practicalTips?: string[];
  faqs: FaqItem[];
  relatedTopics?: InternalLink[];
  internalLinks: InternalLink[];
};
