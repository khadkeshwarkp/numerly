import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  emphasize?: boolean;
  secondary?: string;
  delta?: string;
  deltaState?: "positive" | "negative" | "neutral";
};

export function ResultStat({
  label,
  value,
  emphasize = false,
  secondary,
  delta,
  deltaState = "neutral"
}: Props) {
  return (
    <article className="space-y-2 border-b border-border/70 py-4 last:border-b-0">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
      <p
        className={cn(
          "font-semibold tabular-nums text-foreground",
          emphasize ? "text-4xl leading-tight" : "text-3xl leading-tight"
        )}
      >
        {value}
      </p>
      {secondary || delta ? (
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">{secondary}</span>
          {delta ? (
            <span
              className={cn(
                "font-medium",
                deltaState === "positive" && "text-emerald-600",
                deltaState === "negative" && "text-red-600",
                deltaState === "neutral" && "text-muted-foreground"
              )}
            >
              {delta}
            </span>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
