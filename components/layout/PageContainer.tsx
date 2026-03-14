import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageContainerTag = "main" | "section" | "div";

type Props = {
  children: ReactNode;
  className?: string;
  as?: PageContainerTag;
};

export function PageContainer({ children, className, as = "main" }: Props) {
  const Component = as;
  return <Component className={cn("mx-auto w-full max-w-6xl px-4", className)}>{children}</Component>;
}
