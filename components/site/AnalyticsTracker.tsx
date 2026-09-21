"use client";

import Script from "next/script";
import { useEffect } from "react";
import { trackEventOnce } from "@/lib/analytics/client";

export function AnalyticsTracker() {
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim() || "ylob2lw6up";
  const analyticsEnabled = process.env.NODE_ENV === "production";

  useEffect(() => {
    void trackEventOnce("app_opened", "app_opened");
  }, []);

  return (
    <>
      {analyticsEnabled && clarityProjectId ? (
        <Script id="clarity-analytics" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityProjectId}");
          `}
        </Script>
      ) : null}
      {analyticsEnabled ? (
        <>
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            src="https://www.googletagmanager.com/gtag/js?id=G-165PR16K2T"
          />
          <Script id="google-analytics-config" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-165PR16K2T');`}
          </Script>
        </>
      ) : null}
    </>
  );
}
