"use client";

import Script from "next/script";
import { useEffect } from "react";
import { trackEventOnce } from "@/lib/analytics/client";

export function AnalyticsTracker() {
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim();

  useEffect(() => {
    void trackEventOnce("app_opened", "app_opened");
  }, []);

  return (
    <>
      {clarityProjectId ? (
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
    </>
  );
}
