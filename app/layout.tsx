import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Space_Grotesk, Manrope } from "next/font/google";
import { AppHeader } from "@/components/layout/AppHeader";
import "./globals.css";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.numerly.org"),
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
      <body className={`min-h-screen font-sans ${displayFont.variable} ${bodyFont.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
