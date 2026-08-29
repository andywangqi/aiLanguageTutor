import type { ReactNode } from "react";
import { AnalyticsTracker } from "@/components/site/AnalyticsTracker";
import "./globals.css";
import "./home-v1.css";

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
