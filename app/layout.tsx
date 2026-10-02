import type { ReactNode } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { DocumentLanguage } from "@/components/site/DocumentLanguage";
import { AnalyticsTracker } from "@/components/site/AnalyticsTracker";
import "./globals.css";
import "./home-v1.css";
import "./reading-practice.css";

export const metadata: Metadata = {
  verification: {
    other: {
      "saashub-verification": "ahgxcwtg07n5"
    }
  }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const h = await headers();
  const locale = h.get("x-locale") ?? "en";

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body>
        <DocumentLanguage />
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
