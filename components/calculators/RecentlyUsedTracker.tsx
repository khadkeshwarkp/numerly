"use client";

import { useEffect } from "react";
import { trackRecentCalculator } from "@/lib/recently-used";

type Props = {
  id: string;
  title: string;
  category: string;
  slug: string;
};

export function RecentlyUsedTracker({ id, title, category, slug }: Props) {
  useEffect(() => {
    trackRecentCalculator({
      id,
      title,
      category,
      href: `/${category}/${slug}`
    });
  }, [id, title, category, slug]);

  return null;
}
