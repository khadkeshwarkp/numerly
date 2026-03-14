import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.numerly.com"),
  title: {
    default: "Numerly",
    template: "%s | Numerly"
  },
  description: "Fast, accurate, SEO-first calculators.",
  alternates: { canonical: "/" }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const themeInitScript = `
    (function() {
      try {
        var key = "numerly-theme";
        var saved = window.localStorage.getItem(key);
        var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        var theme = saved === "dark" || saved === "light" ? saved : (prefersDark ? "dark" : "light");
        document.documentElement.classList.toggle("dark", theme === "dark");
      } catch (e) {
        document.documentElement.classList.remove("dark");
      }
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
