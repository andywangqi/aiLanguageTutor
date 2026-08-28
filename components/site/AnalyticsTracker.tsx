"use client";

import { useEffect } from "react";
import { trackEventOnce } from "@/lib/analytics/client";

export function AnalyticsTracker() {
  useEffect(() => {
    void trackEventOnce("app_opened", "app_opened");
  }, []);

  return null;
}
