import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  value: number;
  suffix?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  inputMode?: "decimal" | "numeric";
  hasError?: boolean;
  onChange: (value: string) => void;
};

export function DurationField({
  id,
  value,
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

  return (
    <div className="relative">
      <Input
        id={id}
        type="number"
        inputMode={inputMode ?? "numeric"}
        value={displayValue}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        aria-invalid={hasError}
        onChange={(event) => onChange(event.target.value)}
        className={cn("h-11", suffix ? "pr-14" : "")}
      />
      {suffix ? (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}
