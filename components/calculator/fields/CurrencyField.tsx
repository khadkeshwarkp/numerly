import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  inputMode?: "decimal" | "numeric";
  hasError?: boolean;
  onChange: (value: string) => void;
};

export function CurrencyField({
  id,
  value,
  prefix,
  suffix,
  placeholder,
  min,
  max,
  step,
  inputMode,
  hasError,
  onChange
}: Props) {
  const displayValue = Number.isFinite(value) ? value : "";
  const resolvedPrefix = prefix ?? "$";

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        {resolvedPrefix}
      </span>
      <Input
        id={id}
        type="number"
        inputMode={inputMode ?? "decimal"}
        value={displayValue}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        aria-invalid={hasError}
        onChange={(event) => onChange(event.target.value)}
        className={cn("h-11 pl-7", suffix ? "pr-12" : "")}
      />
      {suffix ? (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}
