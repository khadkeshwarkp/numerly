import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export function AdvancedFieldset({ title, description, open, onToggle, children }: Props) {
  return (
    <div className="rounded-lg border bg-muted/20">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>
          {title}
          {description ? (
            <span className="mt-1 block text-xs font-normal text-muted-foreground">
              {description}
            </span>
          ) : null}
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", open ? "rotate-180" : "")} />
      </button>
      {open ? <div className="space-y-4 border-t px-4 py-4">{children}</div> : null}
    </div>
  );
}
