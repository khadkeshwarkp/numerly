"use client";

import dynamic from "next/dynamic";
import { CalculatorHero } from "@/components/calculator/CalculatorHero";
import { CalculatorInputs } from "@/components/calculator/CalculatorInputs";
import { CalculatorResults } from "@/components/calculator/CalculatorResults";
import { RecentlyUsedTracker } from "@/components/calculators/RecentlyUsedTracker";
import { Button } from "@/components/ui/button";
import {
  useCalculatorWorkspace,
  type CalculatorWorkspaceActions
} from "@/lib/hooks/use-calculator-workspace";

const ShareCenter = dynamic(
  () => import("@/components/calculators/ShareCenter").then((module) => module.ShareCenter),
  {
    ssr: false,
    loading: () => (
      <Button type="button" variant="outline" size="sm" disabled>
        Share
      </Button>
    )
  }
);

const GpaCalculatorWorkspace = dynamic(
  () =>
    import("@/components/calculator/GpaCalculatorWorkspace").then(
      (module) => module.GpaCalculatorWorkspace
    ),
  {
    ssr: false
  }
);

type Props = {
  calculatorId: string;
};

function scenarioErrors(
  state: ReturnType<typeof useCalculatorWorkspace>["state"],
  target: "primary" | "secondary"
) {
  return target === "primary" ? state.primaryResult.errors : (state.secondaryResult?.errors ?? {});
}

function scenarioValues(
  state: ReturnType<typeof useCalculatorWorkspace>["state"],
  target: "primary" | "secondary"
) {
  return target === "primary" ? state.primaryValues : state.compareValues;
}

function scenarioChange(
  actions: CalculatorWorkspaceActions,
  target: "primary" | "secondary"
): (fieldId: string, rawValue: string) => void {
  return target === "primary" ? actions.setPrimaryInputValue : actions.setSecondaryInputValue;
}

export function CalculatorToolsPane({ calculatorId }: Props) {
  const { state, actions } = useCalculatorWorkspace(calculatorId, { mode: "interactive" });
  const calculator = state.calculator;

  if (!calculator) return null;

  if (calculator.id === "gpa-calculator") {
    return (
      <section aria-label={`${calculator.metadata.title} workspace`}>
        <RecentlyUsedTracker
          id={calculator.id}
          title={calculator.metadata.title}
          category={calculator.category}
          slug={calculator.slug}
        />
        <GpaCalculatorWorkspace title={calculator.metadata.title} />
      </section>
    );
  }

  const primaryOutputId = calculator.metadata.presentation?.primaryOutputId;
  const primaryOutput = state.primaryResult.output as Record<string, number> | null;
  const secondaryOutput = (state.secondaryResult?.output as Record<string, number> | null) ?? null;

  return (
    <section className="space-y-4" aria-label={`${calculator.metadata.title} workspace`}>
      <RecentlyUsedTracker
        id={calculator.id}
        title={calculator.metadata.title}
        category={calculator.category}
        slug={calculator.slug}
      />

      <CalculatorHero
        inputs={
          <CalculatorInputs
            title={`${calculator.metadata.title} inputs`}
            inputSchema={calculator.inputSchema}
            compact={Boolean(calculator.metadata.presentation?.compactInputs)}
            showCompareToggle={state.isFinanceCalculator}
            compareEnabled={state.compareEnabled}
            onCompareEnabledChange={actions.setCompareEnabled}
            actions={
              <ShareCenter
                title={calculator.metadata.title}
                shortUrl={state.shortUrl}
                stateUrl={state.shareUrl}
                summaryText={state.summaryText}
                csvFilename={state.tableData ? `${calculator.slug}-table.csv` : undefined}
                csvData={state.csvData || undefined}
                snapshotLines={
                  primaryOutput
                    ? calculator.outputSchema.map((field) => {
                        const value = primaryOutput[field.id];
                        return `${field.label}: ${state.formatOutput(value, field)}`;
                      })
                    : ["No valid output available"]
                }
              />
            }
            scenarios={[
              {
                id: `${calculator.id}-a`,
                label: "Scenario A",
                values: scenarioValues(state, "primary"),
                errors: scenarioErrors(state, "primary"),
                onValueChange: scenarioChange(actions, "primary")
              },
              ...(state.compareEnabled
                ? [
                    {
                      id: `${calculator.id}-b`,
                      label: "Scenario B",
                      values: scenarioValues(state, "secondary"),
                      errors: scenarioErrors(state, "secondary"),
                      onValueChange: scenarioChange(actions, "secondary")
                    }
                  ]
                : [])
            ]}
          />
        }
        results={
          <CalculatorResults
            title="Results"
            outputSchema={calculator.outputSchema}
            output={primaryOutput}
            secondaryOutput={state.compareEnabled ? secondaryOutput : null}
            primaryOutputId={primaryOutputId}
            formatOutput={state.formatOutput}
            generalError={state.primaryResult.generalError}
            insights={state.insights}
          />
        }
      />
    </section>
  );
}
