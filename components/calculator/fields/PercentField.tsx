import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

type Props = {
  id: string;
  value: number;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  showSlider?: boolean;
  hasError?: boolean;
  onChange: (value: string) => void;
};

export function PercentField({
  id,
  value,
  placeholder,
  min,
  max,
  step,
  showSlider,
  hasError,
  onChange
}: Props) {
  const displayValue = Number.isFinite(value) ? value : "";
  const sliderEnabled =
    Boolean(showSlider) && typeof min === "number" && typeof max === "number";

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          value={displayValue}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          aria-invalid={hasError}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 pr-10"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          %
        </span>
      </div>
      {sliderEnabled ? (
        <Slider
          value={[Number.isFinite(value) ? value : min ?? 0]}
          min={min}
          max={max}
          step={step ?? 0.1}
          onValueChange={(nextValue) => onChange(String(nextValue[0] ?? value))}
          aria-label="Percent slider"
        />
      ) : null}
    </div>
  );
}
