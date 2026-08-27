import type { ReactNode } from "react";
import { AnalyticsTracker } from "@/components/site/AnalyticsTracker";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
