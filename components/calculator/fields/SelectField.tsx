import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import type { FieldOption } from "@/types/calculator-engine";

type Props = {
  value: number | null;
  options: readonly FieldOption[];
  placeholder?: string;
  onChange: (value: string) => void;
};

export function SelectField({ value, options, placeholder, onChange }: Props) {
  const stringValue = Number.isFinite(value) ? String(value) : "";

  return (
    <Select value={stringValue} onValueChange={onChange}>
      <SelectTrigger className="h-11">
        <SelectValue placeholder={placeholder ?? "Select"} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
